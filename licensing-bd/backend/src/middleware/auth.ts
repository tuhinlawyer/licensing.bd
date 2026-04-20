import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Require admin role
export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }

  // Check admin_users table
  const { data: adminUser, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('email', req.user.email)
    .single();

  if (error || !adminUser) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

// Check subscription plan
export const requirePlan = (requiredPlans: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const { data: userData, error } = await supabaseAdmin
      .from('users')
      .select('subscription_plan')
      .eq('id', req.user.id)
      .single();

    if (error || !userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!requiredPlans.includes(userData.subscription_plan)) {
      return res.status(403).json({
        success: false,
        message: `This feature requires ${requiredPlans.join(' or ')} plan`,
        upgradeRequired: true
      });
    }

    next();
  };
};

export default authenticate;
