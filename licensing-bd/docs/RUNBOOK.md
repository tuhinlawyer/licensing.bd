# licensing.bd Operational Runbook

This runbook provides step-by-step instructions for common operational tasks and emergency procedures.

## Table of Contents
- [Manual Operations](#manual-operations)
- [Deployment & Rollback](#deployment--rollback)
- [Database Operations](#database-operations)
- [Emergency Procedures](#emergency-procedures)
- [Monitoring & Alerts](#monitoring--alerts)
- [Contact Information](#contact-information)

---

## Manual Operations

### 1. Trigger Reminder Cron Job Manually

Use this when the automated cron fails or you need to test reminders immediately.

```bash
# Via curl (production)
curl -X POST https://api.licensing.bd/cron/reminders \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json"

# Via Railway CLI
railway run node dist/jobs/reminderEngine.js

# Check logs after triggering
tail -f logs/combined.log | grep "reminder"
```

**Expected Output:**
```json
{
  "success": true,
  "processed": 45,
  "sent": 42,
  "failed": 3
}
```

---

### 2. Check Notification Delivery Status

```sql
-- Check last 100 notifications
SELECT 
  channel,
  status,
  COUNT(*) as count,
  MAX(sent_at) as last_sent
FROM notification_log
WHERE sent_at > NOW() - INTERVAL '24 hours'
GROUP BY channel, status
ORDER BY count DESC;

-- Find failed notifications
SELECT 
  user_id,
  channel,
  recipient,
  error_message,
  sent_at
FROM notification_log
WHERE status = 'failed'
  AND sent_at > NOW() - INTERVAL '24 hours'
ORDER BY sent_at DESC
LIMIT 50;

-- Check delivery rate by channel
SELECT 
  channel,
  COUNT(*) FILTER (WHERE status = 'sent')::float / COUNT(*) * 100 as success_rate
FROM notification_log
WHERE sent_at > NOW() - INTERVAL '7 days'
GROUP BY channel;
```

**Alert Thresholds:**
- Email success rate < 95% → Investigate SendGrid
- SMS success rate < 90% → Contact SSL Wireless
- Any channel > 10 failures in 1 hour → Page on-call engineer

---

### 3. Manually Upgrade User's Plan

When a user has payment issues or needs manual plan adjustment.

```sql
-- Update user plan
UPDATE users
SET 
  subscription_plan = 'professional', -- or 'business', 'enterprise'
  subscription_expires_at = NOW() + INTERVAL '1 month',
  updated_at = NOW()
WHERE email = 'user@example.com';

-- Log the manual change
INSERT INTO subscription_events (
  user_id,
  event_type,
  plan_from,
  plan_to,
  amount_bdt,
  payment_method,
  payment_reference
)
SELECT 
  id,
  'upgraded',
  subscription_plan,
  'professional',
  1499,
  'manual',
  'Manual upgrade by admin: [YOUR_NAME]'
FROM users
WHERE email = 'user@example.com';

-- Verify the change
SELECT email, subscription_plan, subscription_expires_at
FROM users
WHERE email = 'user@example.com';
```

---

### 4. Retry Failed Notifications

```sql
-- Get failed notifications from last 24 hours
SELECT id, user_id, channel, recipient, subject, body_preview
FROM notification_log
WHERE status = 'failed'
  AND sent_at > NOW() - INTERVAL '24 hours'
  AND retry_count < 3;

-- Mark for retry (application will pick up on next cron)
UPDATE reminders
SET next_send_at = NOW() + INTERVAL '5 minutes'
WHERE id IN (
  SELECT reminder_id
  FROM notification_log
  WHERE status = 'failed'
    AND sent_at > NOW() - INTERVAL '24 hours'
);
```

---

## Deployment & Rollback

### Deploy to Production

```bash
# Frontend (Vercel)
cd frontend
vercel --prod

# Backend (Railway)
cd backend
npm run build
railway up

# Or trigger via GitHub push to main branch
git push origin main
```

### Rollback Deployment

**Vercel (Frontend):**
```bash
# List recent deployments
vercel ls

# Rollback to previous deployment
vercel rollback --target production

# Or rollback to specific deployment
vercel rollback [DEPLOYMENT_ID] --target production
```

**Railway (Backend):**
```bash
# View recent deployments
railway deployments

# Rollback to previous version
railway rollback

# Or deploy specific Git commit
railway up --commit=[COMMIT_SHA]
```

### Emergency Hotfix

1. Create hotfix branch: `git checkout -b hotfix/issue-name`
2. Make minimal changes
3. Test locally
4. Push and deploy: `git push origin hotfix/issue-name`
5. Merge to main after verification

---

## Database Operations

### Restore from Supabase Backup

1. **Download Backup:**
   - Go to Supabase Dashboard → Database → Backups
   - Download latest backup or point-in-time restore

2. **Restore to New Database:**
   ```bash
   # Create new database
   psql -h [HOST] -U postgres -c "CREATE DATABASE licensing_restore;"
   
   # Restore backup
   psql -h [HOST] -U postgres -d licensing_restore < backup.sql
   ```

3. **Verify Data:**
   ```sql
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM businesses;
   SELECT COUNT(*) FROM license_tracking;
   ```

4. **Switch Connection String:**
   - Update `SUPABASE_URL` in environment variables
   - Restart backend services

### Run Database Migrations

```bash
# Apply all pending migrations
psql $SUPABASE_URL -f supabase/migrations/*.sql

# Or use Supabase CLI
supabase db push
```

---

## Emergency Procedures

### WordPress REST API is Down

**Symptoms:**
- License search returns no results
- Onboarding wizard stuck at "Generating compliance map"
- AI Advisor not returning license cards

**Immediate Actions:**
1. System automatically falls back to cached `/data/license-map.json`
2. Verify cache is being served:
   ```bash
   curl https://api.licensing.bd/api/wordpress/business-types
   ```
3. If cache is stale, manually refresh:
   ```bash
   npx ts-node scripts/seed-license-map.ts
   ```
4. Contact WordPress hosting provider
5. Monitor until WordPress API is restored

**Post-Incident:**
- Increase cache TTL if needed
- Add additional monitoring for WordPress uptime

---

### Payment Gateway Failure

**SSLCOMMERZ Issues:**
1. Check SSLCOMMERZ dashboard for service status
2. Verify webhook endpoints are accessible:
   ```bash
   curl -X POST https://api.licensing.bd/api/payments/sslcommerz/success \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```
3. If gateway is down:
   - Temporarily disable SSLCOMMERZ option in UI
   - Notify affected users via email
   - Offer alternative payment method

**Stripe Issues:**
1. Check Stripe status page: https://status.stripe.com
2. Verify webhook signature validation
3. Check logs for `customer.subscription.*` events

---

### Database Performance Issues

**Symptoms:**
- Slow query responses (>2 seconds)
- Timeout errors
- Health check failures

**Immediate Actions:**
1. Check Supabase dashboard for:
   - CPU usage
   - Memory usage
   - Active connections
   - Slow query logs

2. Identify problematic queries:
   ```sql
   SELECT 
     pid,
     now() - pg_stat_activity.query_start AS duration,
     query
   FROM pg_stat_activity
   WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
   ORDER BY duration DESC;
   ```

3. Kill long-running queries if necessary:
   ```sql
   SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE state = 'idle in transaction'
     AND (now() - query_start) > interval '30 minutes';
   ```

4. Scale resources if needed (Supabase Pro/Team plan)

---

### Security Incident Response

**Suspected Breach:**
1. **Immediate containment:**
   - Rotate all API keys (Supabase, AWS, SendGrid, etc.)
   - Revoke suspicious sessions in Supabase Auth
   - Enable enhanced logging

2. **Investigation:**
   - Review access logs in Supabase Dashboard
   - Check AWS CloudTrail for S3 access
   - Audit user session logs

3. **Notification:**
   - Inform affected users within 24 hours
   - Report to Bangladesh Cyber Crime Unit if required
   - Document incident timeline

4. **Recovery:**
   - Patch vulnerabilities
   - Implement additional security measures
   - Conduct security audit

---

## Monitoring & Alerts

### Key Metrics to Monitor

| Metric | Threshold | Alert Channel |
|--------|-----------|---------------|
| API Error Rate | > 5% | Slack + Email |
| Average Response Time | > 500ms | Slack |
| Failed Notifications | > 10/hour | Email |
| Database Connections | > 80% capacity | Slack + SMS |
| S3 Storage Usage | > 90% of plan limit | Email |
| Cron Job Failures | Any failure | SMS |

### Where to Check

- **Vercel Analytics**: https://vercel.com/dashboard
- **Railway Logs**: https://railway.app/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **SendGrid Stats**: https://app.sendgrid.com/stats
- **AWS CloudWatch**: https://console.aws.amazon.com/cloudwatch

### Set Up Alerts

```bash
# Example: Uptime monitoring with UptimeRobot
# Monitor these endpoints:
- https://licensing.bd/health
- https://api.licensing.bd/health
- https://licensing.bd/wp-json/wp/v2/license

# Configure alerts to:
- ops@licensing.bd
- +880-XXX-XXXXXXX (SMS)
- #ops-alerts Slack channel
```

---

## Contact Information

### Internal Team

| Role | Name | Email | Phone |
|------|------|-------|-------|
| Technical Lead | [Name] | tech@licensing.bd | +880-XXX-XXXXXXX |
| DevOps Engineer | [Name] | devops@licensing.bd | +880-XXX-XXXXXXX |
| On-Call Engineer | Rotating | oncall@licensing.bd | +880-XXX-XXXXXXX |

### External Services Support

| Service | Support URL | Emergency Contact |
|---------|-------------|-------------------|
| Supabase | https://supabase.com/support | support@supabase.com |
| Vercel | https://vercel.com/support | enterprise@vercel.com |
| Railway | https://railway.app/help | support@railway.app |
| AWS | https://aws.amazon.com/contact-us | Account-specific |
| SendGrid | https://support.sendgrid.com | support@sendgrid.com |
| SSLCOMMERZ | https://www.sslcommerz.com/support | support@sslcommerz.com |
| SSL Wireless | https://www.sslwireless.com/support | +880-XXX-XXXXXXX |

### Escalation Path

1. **Level 1**: On-call engineer (0-30 minutes)
2. **Level 2**: Technical Lead (30-60 minutes)
3. **Level 3**: CTO / Founders (1-2 hours)
4. **External**: Service provider support (as needed)

---

## Appendix

### Useful Commands

```bash
# Check system health
curl https://api.licensing.bd/health

# View recent error logs
tail -100 logs/error.log

# Restart backend service (Railway)
railway restart

# Clear Redis cache
redis-cli FLUSHDB

# Check active users
psql $SUPABASE_URL -c "SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '24 hours';"
```

### Checklist: Weekly Operations

- [ ] Review error logs for recurring issues
- [ ] Check notification delivery rates
- [ ] Verify backup completion
- [ ] Review slow query logs
- [ ] Check SSL certificate expiry
- [ ] Review user feedback and support tickets
- [ ] Update dependencies (security patches)
- [ ] Test disaster recovery procedure (monthly)

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Maintained By:** DevOps Team
