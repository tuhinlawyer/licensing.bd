import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// POST /api/auth/verify - Verify Supabase token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token required' });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        ...profile
      }
    });
  } catch (error) {
    console.error('Auth verify error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

export default router;
