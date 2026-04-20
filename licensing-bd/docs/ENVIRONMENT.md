# licensing.bd Environment Variables Documentation

This document contains all environment variables required for the licensing.bd platform.

## Table of Contents
- [Database & Authentication](#database--authentication)
- [Storage (AWS S3)](#storage-aws-s3)
- [Email & Communication](#email--communication)
- [Payment Gateways](#payment-gateways)
- [AI & External APIs](#ai--external-apis)
- [Security](#security)
- [Application Configuration](#application-configuration)

---

## Database & Authentication

### Supabase
| Variable | Description | Where to Get | Example | Required | Used By |
|----------|-------------|--------------|---------|----------|---------|
| `SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API | `https://abcdefgh.supabase.co` | ✅ Yes | Frontend, Backend |
| `SUPABASE_ANON_KEY` | Public anon key for client-side | Supabase Dashboard → Settings → API | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ Yes | Frontend, Backend |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS) | Supabase Dashboard → Settings → API | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ Yes | Backend only |

---

## Storage (AWS S3)

| Variable | Description | Where to Get | Example | Required | Used By |
|----------|-------------|--------------|---------|----------|---------|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key ID | AWS Console → IAM → Users → Security credentials | `AKIAIOSFODNN7EXAMPLE` | ✅ Yes | Backend |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret access key | AWS Console → IAM → Users → Security credentials | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | ✅ Yes | Backend |
| `AWS_S3_BUCKET_NAME` | Name of your S3 bucket | AWS Console → S3 → Create bucket | `licensing-bd-documents` | ✅ Yes | Backend |
| `AWS_REGION` | AWS region for S3 | AWS Console → S3 → Bucket settings | `ap-south-1` | ✅ Yes | Backend |

---

## Email & Communication

### SendGrid
| Variable | Description | Where to Get | Example | Required | Used By |
|----------|-------------|--------------|---------|----------|---------|
| `SENDGRID_API_KEY` | SendGrid API key | SendGrid Dashboard → Settings → API Keys | `SG.xxxxxxxxxx.yyyyyyyyyy` | ✅ Yes | Backend |
| `SENDGRID_FROM_EMAIL` | Sender email address | Your verified domain in SendGrid | `noreply@licensing.bd` | ⚠️ Recommended | Backend |

### SSL Wireless (Bangladesh SMS)
| Variable | Description | Where to Get | Example | Required | Used By |
|----------|-------------|--------------|---------|----------|---------|
| `SMS_API_KEY` | SSL Wireless API key | SSL Wireless Portal → API Settings | `abc123xyz456` | ✅ Yes* | Backend |
| `SMS_SID` | SSL Wireless Sender ID | SSL Wireless Portal → Sender ID | `LICENSING` | ✅ Yes* | Backend |

*Required if SMS notifications are enabled

---

## Payment Gateways

### Stripe (International)
| Variable | Description | Where to Get | Example | Required | Used By |
|----------|-------------|--------------|---------|----------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key | Stripe Dashboard → Developers → API keys | `sk_test_xxxxxxxxxx` or `sk_live_xxxxxxxxxx` | ✅ Yes* | Backend |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Stripe Dashboard → Developers → Webhooks | `whsec_xxxxxxxxxx` | ✅ Yes* | Backend |
| `STRIPE_PRICE_ID_PROFESSIONAL` | Stripe Price ID for Professional plan | Stripe Dashboard → Products | `price_xxxxxxxxxx` | ⚠️ Recommended | Backend |
| `STRIPE_PRICE_ID_BUSINESS` | Stripe Price ID for Business plan | Stripe Dashboard → Products | `price_xxxxxxxxxx` | ⚠️ Recommended | Backend |

### SSLCOMMERZ (Bangladesh)
| Variable | Description | Where to Get | Example | Required | Used By |
|----------|-------------|--------------|---------|----------|---------|
| `SSL_COMMERZ_STORE_ID` | SSLCOMMERZ Store ID | SSLCOMMERZ Dashboard | `testbox` or `live_store_id` | ✅ Yes* | Backend |
| `SSL_COMMERZ_STORE_PASSWORD` | SSLCOMMERZ Store Password | SSLCOMMERZ Dashboard | `xxxxxx` | ✅ Yes* | Backend |
| `SSL_COMMERZ_IS_LIVE` | Toggle between test/live mode | Set manually | `false` or `true` | ⚠️ Recommended | Backend |

*Required based on target market (BD vs International)

---

## AI & External APIs

### Anthropic (Claude API)
| Variable | Description | Where to Get | Example | Required | Used By |
|----------|-------------|--------------|---------|----------|---------|
| `CLAUDE_API_KEY` | Anthropic API key | Anthropic Console → API Keys | `sk-ant-xxxxxx` | ✅ Yes* | Backend |
| `CLAUDE_MODEL` | Claude model to use | Anthropic documentation | `claude-sonnet-4-20250514` | ⚠️ Recommended | Backend |

### WordPress REST API
| Variable | Description | Where to Get | Example | Required | Used By |
|----------|-------------|--------------|---------|----------|---------|
| `WP_BASE_URL` | WordPress site URL | Your WordPress installation | `https://licensing.bd` | ✅ Yes | Backend |
| `WP_APP_USERNAME` | WordPress Application Username | WordPress Users → Profile → Application Passwords | `api_user` | ✅ Yes | Backend |
| `WP_APP_PASSWORD` | WordPress Application Password | WordPress Users → Profile → Application Passwords | `xxxx xxxx xxxx xxxx` | ✅ Yes | Backend |

---

## Security

| Variable | Description | Where to Get | Example | Required | Used By |
|----------|-------------|--------------|---------|----------|---------|
| `JWT_SECRET` | Secret key for JWT signing | Generate with `openssl rand -hex 32` | `your-secret-key-here` | ✅ Yes | Backend |
| `CRON_SECRET` | Secret for cron job authentication | Generate with `openssl rand -hex 32` | `your-cron-secret` | ✅ Yes | Backend |
| `FRONTEND_URL` | Frontend application URL | Your deployment URL | `https://licensing.bd` or `http://localhost:3000` | ✅ Yes | Backend |

---

## Application Configuration

### Frontend (Next.js)
| Variable | Description | Where to Get | Example | Required | Used By |
|----------|-------------|--------------|---------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL (public) | Same as SUPABASE_URL | `https://abcdefgh.supabase.co` | ✅ Yes | Frontend |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public) | Same as SUPABASE_ANON_KEY | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | ✅ Yes | Frontend |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Your backend deployment | `https://api.licensing.bd` or `http://localhost:3001` | ✅ Yes | Frontend |
| `NEXT_PUBLIC_WP_BASE_URL` | WordPress base URL (for direct calls) | Your WordPress installation | `https://licensing.bd` | ⚠️ Recommended | Frontend |

### Backend (Express)
| Variable | Description | Where to Get | Example | Required | Used By |
|----------|-------------|--------------|---------|----------|---------|
| `NODE_ENV` | Node environment | Set manually | `development`, `staging`, `production` | ✅ Yes | Backend |
| `PORT` | Server port | Set manually | `3001` | ⚠️ Recommended | Backend |
| `LOG_LEVEL` | Winston log level | Set manually | `info`, `debug`, `error` | ⚠️ Recommended | Backend |

---

## Setup Instructions

### 1. Copy Environment Files
```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env.local

# Root
cp .env.example .env.local
```

### 2. Generate Secure Secrets
```bash
# Generate JWT secret
openssl rand -hex 32

# Generate cron secret
openssl rand -hex 32
```

### 3. Configure Services
1. **Supabase**: Create project at https://supabase.com
2. **AWS S3**: Create bucket in ap-south-1 region
3. **SendGrid**: Verify your domain and create API key
4. **Stripe/SSLCOMMERZ**: Complete merchant onboarding
5. **Anthropic**: Get API key from https://console.anthropic.com
6. **WordPress**: Create application password for API user

### 4. Security Best Practices
- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate secrets every 90 days
- Use GitHub Secrets for CI/CD pipelines
- Enable 2FA on all service accounts

---

## Troubleshooting

### Common Issues

**"Invalid API key" errors:**
- Check for extra whitespace in environment variables
- Ensure keys are not truncated when copying
- Verify the correct environment (test vs live)

**CORS errors:**
- Add your frontend URL to backend CORS allowed origins
- Check that FRONTEND_URL matches exactly (including http/https)

**S3 upload failures:**
- Verify IAM user has S3 permissions
- Check bucket policy allows uploads from your IP
- Ensure region matches bucket location

**SMS not sending:**
- Verify SSL Wireless account is active
- Check sender ID is approved
- Confirm phone numbers are in international format (+880...)

---

## Support

For issues with environment configuration:
- Technical Lead: tech@licensing.bd
- DevOps: devops@licensing.bd

Last updated: January 2025
