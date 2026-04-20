-- licensing.bd Database Schema
-- Supabase (PostgreSQL) Migration File
-- Complete schema with tables, indexes, RLS policies, and triggers

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- Subscription plans
DO $$ BEGIN
    CREATE TYPE subscription_plan_enum AS ENUM ('free', 'professional', 'business', 'enterprise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Preferred languages
DO $$ BEGIN
    CREATE TYPE preferred_language_enum AS ENUM ('en', 'bn');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Business ownership types
DO $$ BEGIN
    CREATE TYPE ownership_type_enum AS ENUM ('local', 'foreign', 'joint_venture');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- License status
DO $$ BEGIN
    CREATE TYPE license_status_enum AS ENUM ('active', 'pending', 'expiring_soon', 'expired', 'unknown');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Document categories
DO $$ BEGIN
    CREATE TYPE doc_category_enum AS ENUM (
        'license_certificate', 'company_doc', 'identity', 'premises',
        'financial', 'correspondence', 'staff', 'custom'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Reminder types
DO $$ BEGIN
    CREATE TYPE reminder_type_enum AS ENUM ('renewal', 'document_expiry', 'filing', 'custom');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Notification channels
DO $$ BEGIN
    CREATE TYPE notification_channel_enum AS ENUM ('email', 'sms', 'whatsapp', 'push');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Compliance event types
DO $$ BEGIN
    CREATE TYPE compliance_event_type_enum AS ENUM ('renewal_due', 'filing_due', 'doc_expiry', 'custom');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Compliance event status
DO $$ BEGIN
    CREATE TYPE compliance_event_status_enum AS ENUM ('pending', 'completed', 'overdue');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Message roles for AI conversations
DO $$ BEGIN
    CREATE TYPE message_role_enum AS ENUM ('user', 'assistant');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Notification log status
DO $$ BEGIN
    CREATE TYPE notification_status_enum AS ENUM ('sent', 'failed', 'bounced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Subscription event types
DO $$ BEGIN
    CREATE TYPE subscription_event_type_enum AS ENUM ('created', 'upgraded', 'downgraded', 'cancelled', 'payment_failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- TABLES
-- ============================================================================

-- 1. users table
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    full_name text,
    phone_bd text CHECK (phone_bd IS NULL OR phone_bd ~ '^\+880[1-9][0-9]{8}$'),
    subscription_plan subscription_plan_enum NOT NULL DEFAULT 'free',
    subscription_expires_at timestamptz,
    preferred_language preferred_language_enum NOT NULL DEFAULT 'en',
    notification_prefs jsonb NOT NULL DEFAULT '{"email": true, "sms": false, "whatsapp": false, "push": true}',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. businesses table
CREATE TABLE IF NOT EXISTS businesses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name text NOT NULL,
    business_type varchar(255) NOT NULL,
    location_division varchar(100),
    location_district varchar(100),
    ownership_type ownership_type_enum NOT NULL DEFAULT 'local',
    health_score integer DEFAULT 0 CHECK (health_score >= 0 AND health_score <= 100),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. license_tracking table
CREATE TABLE IF NOT EXISTS license_tracking (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    license_slug varchar(255) NOT NULL,
    license_name_en text NOT NULL,
    license_name_bn text,
    issuing_authority text,
    status license_status_enum NOT NULL DEFAULT 'unknown',
    issue_date date,
    expiry_date date,
    renewal_notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. documents table
CREATE TABLE IF NOT EXISTS documents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    license_tracking_id uuid REFERENCES license_tracking(id) ON DELETE SET NULL,
    file_name text NOT NULL,
    file_key text NOT NULL,
    file_size_bytes bigint NOT NULL,
    doc_category doc_category_enum NOT NULL,
    custom_category_name varchar(255),
    issue_date date,
    expiry_date date,
    is_archived boolean NOT NULL DEFAULT false,
    version_number integer NOT NULL DEFAULT 1,
    uploaded_at timestamptz NOT NULL DEFAULT now()
);

-- 5. reminders table
CREATE TABLE IF NOT EXISTS reminders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    license_tracking_id uuid REFERENCES license_tracking(id) ON DELETE CASCADE,
    reminder_type reminder_type_enum NOT NULL,
    trigger_days_before integer NOT NULL DEFAULT 30,
    channel notification_channel_enum NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    last_sent_at timestamptz,
    next_send_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. compliance_events table
CREATE TABLE IF NOT EXISTS compliance_events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    event_type compliance_event_type_enum NOT NULL,
    title_en text NOT NULL,
    title_bn text,
    description text,
    due_date date NOT NULL,
    status compliance_event_status_enum NOT NULL DEFAULT 'pending',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 7. ai_conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_id uuid REFERENCES businesses(id) ON DELETE SET NULL,
    message_role message_role_enum NOT NULL,
    message_text text NOT NULL,
    tokens_used integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. notification_log table
CREATE TABLE IF NOT EXISTS notification_log (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel notification_channel_enum NOT NULL,
    recipient text NOT NULL,
    subject text,
    body_preview varchar(500),
    status notification_status_enum NOT NULL,
    sent_at timestamptz,
    error_message text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. subscription_events table
CREATE TABLE IF NOT EXISTS subscription_events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type subscription_event_type_enum NOT NULL,
    plan_from subscription_plan_enum,
    plan_to subscription_plan_enum,
    amount_bdt integer,
    payment_method text,
    payment_reference text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_plan ON users(subscription_plan);

-- Businesses indexes
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_is_active ON businesses(is_active);

-- License tracking indexes
CREATE INDEX IF NOT EXISTS idx_license_tracking_business_id ON license_tracking(business_id);
CREATE INDEX IF NOT EXISTS idx_license_tracking_status ON license_tracking(status);
CREATE INDEX IF NOT EXISTS idx_license_tracking_expiry_date ON license_tracking(expiry_date);
CREATE INDEX IF NOT EXISTS idx_license_tracking_slug ON license_tracking(license_slug);

-- Documents indexes
CREATE INDEX IF NOT EXISTS idx_documents_business_id ON documents(business_id);
CREATE INDEX IF NOT EXISTS idx_documents_license_tracking_id ON documents(license_tracking_id);
CREATE INDEX IF NOT EXISTS idx_documents_doc_category ON documents(doc_category);
CREATE INDEX IF NOT EXISTS idx_documents_is_archived ON documents(is_archived);
CREATE INDEX IF NOT EXISTS idx_documents_expiry_date ON documents(expiry_date);

-- Reminders indexes
CREATE INDEX IF NOT EXISTS idx_reminders_business_id ON reminders(business_id);
CREATE INDEX IF NOT EXISTS idx_reminders_license_tracking_id ON reminders(license_tracking_id);
CREATE INDEX IF NOT EXISTS idx_reminders_is_active ON reminders(is_active);
CREATE INDEX IF NOT EXISTS idx_reminders_next_send_at ON reminders(next_send_at);

-- Compliance events indexes
CREATE INDEX IF NOT EXISTS idx_compliance_events_business_id ON compliance_events(business_id);
CREATE INDEX IF NOT EXISTS idx_compliance_events_status ON compliance_events(status);
CREATE INDEX IF NOT EXISTS idx_compliance_events_due_date ON compliance_events(due_date);

-- AI conversations indexes
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_business_id ON ai_conversations(business_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON ai_conversations(created_at);

-- Notification log indexes
CREATE INDEX IF NOT EXISTS idx_notification_log_user_id ON notification_log(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_log_status ON notification_log(status);
CREATE INDEX IF NOT EXISTS idx_notification_log_sent_at ON notification_log(sent_at);

-- Subscription events indexes
CREATE INDEX IF NOT EXISTS idx_subscription_events_user_id ON subscription_events(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_events_event_type ON subscription_events(event_type);
CREATE INDEX IF NOT EXISTS idx_subscription_events_created_at ON subscription_events(created_at);

-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to recalculate business health score
CREATE OR REPLACE FUNCTION recalculate_health_score()
RETURNS TRIGGER AS $$
DECLARE
    v_business_id uuid;
    v_total_licenses integer;
    v_active_licenses integer;
    v_not_expired_licenses integer;
    v_licenses_with_docs integer;
    v_licenses_with_reminders integer;
    v_score_active numeric;
    v_score_not_expired numeric;
    v_score_with_docs numeric;
    v_score_with_reminders numeric;
    v_health_score integer;
BEGIN
    -- Determine the business_id from the triggering table
    IF TG_TABLE_NAME = 'license_tracking' THEN
        v_business_id := NEW.business_id;
        -- Also handle DELETE case
        IF NEW.business_id IS NULL THEN
            v_business_id := OLD.business_id;
        END IF;
    ELSIF TG_TABLE_NAME = 'documents' THEN
        -- Get business_id from license_tracking or directly from business
        IF NEW.license_tracking_id IS NOT NULL THEN
            SELECT lt.business_id INTO v_business_id
            FROM license_tracking lt
            WHERE lt.id = NEW.license_tracking_id;
        ELSE
            v_business_id := NEW.business_id;
        END IF;
        -- Handle DELETE case
        IF v_business_id IS NULL THEN
            IF OLD.license_tracking_id IS NOT NULL THEN
                SELECT lt.business_id INTO v_business_id
                FROM license_tracking lt
                WHERE lt.id = OLD.license_tracking_id;
            ELSE
                v_business_id := OLD.business_id;
            END IF;
        END IF;
    ELSIF TG_TABLE_NAME = 'reminders' THEN
        -- Get business_id from license_tracking
        IF NEW.license_tracking_id IS NOT NULL THEN
            SELECT lt.business_id INTO v_business_id
            FROM license_tracking lt
            WHERE lt.id = NEW.license_tracking_id;
        ELSE
            v_business_id := NEW.business_id;
        END IF;
        -- Handle DELETE case
        IF v_business_id IS NULL THEN
            IF OLD.license_tracking_id IS NOT NULL THEN
                SELECT lt.business_id INTO v_business_id
                FROM license_tracking lt
                WHERE lt.id = OLD.license_tracking_id;
            ELSE
                v_business_id := OLD.business_id;
            END IF;
        END IF;
    END IF;

    -- Exit if no business_id found
    IF v_business_id IS NULL THEN
        RETURN NULL;
    END IF;

    -- Calculate total licenses for this business
    SELECT COUNT(*) INTO v_total_licenses
    FROM license_tracking
    WHERE business_id = v_business_id;

    -- If no licenses, set health score to 0
    IF v_total_licenses = 0 THEN
        UPDATE businesses
        SET health_score = 0, updated_at = now()
        WHERE id = v_business_id;
        RETURN NULL;
    END IF;

    -- Calculate active licenses (status = 'active')
    SELECT COUNT(*) INTO v_active_licenses
    FROM license_tracking
    WHERE business_id = v_business_id AND status = 'active';

    -- Calculate not expired licenses (expiry_date IS NULL OR expiry_date > CURRENT_DATE)
    SELECT COUNT(*) INTO v_not_expired_licenses
    FROM license_tracking
    WHERE business_id = v_business_id
      AND (expiry_date IS NULL OR expiry_date > CURRENT_DATE);

    -- Calculate licenses with at least one document
    SELECT COUNT(DISTINCT lt.id) INTO v_licenses_with_docs
    FROM license_tracking lt
    LEFT JOIN documents d ON d.license_tracking_id = lt.id AND d.is_archived = false
    WHERE lt.business_id = v_business_id
    GROUP BY lt.id
    HAVING COUNT(d.id) > 0;

    -- Handle case where no licenses have documents
    IF v_licenses_with_docs IS NULL THEN
        v_licenses_with_docs := 0;
    END IF;

    -- Recalculate licenses with documents properly
    SELECT COUNT(*) INTO v_licenses_with_docs
    FROM (
        SELECT DISTINCT lt.id
        FROM license_tracking lt
        INNER JOIN documents d ON d.license_tracking_id = lt.id AND d.is_archived = false
        WHERE lt.business_id = v_business_id
    ) subq;

    -- Calculate licenses with at least one active reminder
    SELECT COUNT(*) INTO v_licenses_with_reminders
    FROM (
        SELECT DISTINCT lt.id
        FROM license_tracking lt
        INNER JOIN reminders r ON r.license_tracking_id = lt.id AND r.is_active = true
        WHERE lt.business_id = v_business_id
    ) subq;

    -- Calculate scores (as percentages of total)
    v_score_active := (v_active_licenses::numeric / v_total_licenses::numeric) * 40;
    v_score_not_expired := (v_not_expired_licenses::numeric / v_total_licenses::numeric) * 30;
    v_score_with_docs := (v_licenses_with_docs::numeric / v_total_licenses::numeric) * 20;
    v_score_with_reminders := (v_licenses_with_reminders::numeric / v_total_licenses::numeric) * 10;

    -- Sum up and round to integer
    v_health_score := ROUND(v_score_active + v_score_not_expired + v_score_with_docs + v_score_with_reminders);

    -- Ensure score is within bounds
    IF v_health_score < 0 THEN
        v_health_score := 0;
    ELSIF v_health_score > 100 THEN
        v_health_score := 100;
    END IF;

    -- Update the business health score
    UPDATE businesses
    SET health_score = v_health_score, updated_at = now()
    WHERE id = v_business_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to auto-update updated_at on businesses table
CREATE TRIGGER trigger_update_businesses_timestamp
    BEFORE UPDATE ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers to recalculate health score on related table changes
CREATE TRIGGER trigger_recalculate_health_score_license_insert
    AFTER INSERT OR UPDATE ON license_tracking
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_health_score();

CREATE TRIGGER trigger_recalculate_health_score_license_delete
    AFTER DELETE ON license_tracking
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_health_score();

CREATE TRIGGER trigger_recalculate_health_score_documents_insert
    AFTER INSERT OR UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_health_score();

CREATE TRIGGER trigger_recalculate_health_score_documents_delete
    AFTER DELETE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_health_score();

CREATE TRIGGER trigger_recalculate_health_score_reminders_insert
    AFTER INSERT OR UPDATE ON reminders
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_health_score();

CREATE TRIGGER trigger_recalculate_health_score_reminders_delete
    AFTER DELETE ON reminders
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_health_score();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- users table policies
-- ----------------------------------------------------------------------------
-- Users can only access their own row
CREATE POLICY users_select_own ON users
    FOR SELECT
    USING (id = auth.uid());

CREATE POLICY users_update_own ON users
    FOR UPDATE
    USING (id = auth.uid());

CREATE POLICY users_delete_own ON users
    FOR DELETE
    USING (id = auth.uid());

-- ----------------------------------------------------------------------------
-- businesses table policies
-- ----------------------------------------------------------------------------
-- Users can only access businesses they own
CREATE POLICY businesses_select_own ON businesses
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY businesses_insert_own ON businesses
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY businesses_update_own ON businesses
    FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY businesses_delete_own ON businesses
    FOR DELETE
    USING (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- license_tracking table policies
-- ----------------------------------------------------------------------------
-- Access through business ownership chain
CREATE POLICY license_tracking_select ON license_tracking
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = license_tracking.business_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY license_tracking_insert ON license_tracking
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = license_tracking.business_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY license_tracking_update ON license_tracking
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = license_tracking.business_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY license_tracking_delete ON license_tracking
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = license_tracking.business_id
            AND b.user_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- documents table policies
-- ----------------------------------------------------------------------------
CREATE POLICY documents_select ON documents
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = documents.business_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY documents_insert ON documents
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = documents.business_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY documents_update ON documents
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = documents.business_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY documents_delete ON documents
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = documents.business_id
            AND b.user_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- reminders table policies
-- ----------------------------------------------------------------------------
CREATE POLICY reminders_select ON reminders
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = reminders.business_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY reminders_insert ON reminders
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = reminders.business_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY reminders_update ON reminders
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = reminders.business_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY reminders_delete ON reminders
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = reminders.business_id
            AND b.user_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- compliance_events table policies
-- ----------------------------------------------------------------------------
CREATE POLICY compliance_events_select ON compliance_events
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = compliance_events.business_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY compliance_events_insert ON compliance_events
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = compliance_events.business_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY compliance_events_update ON compliance_events
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = compliance_events.business_id
            AND b.user_id = auth.uid()
        )
    );

CREATE POLICY compliance_events_delete ON compliance_events
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = compliance_events.business_id
            AND b.user_id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- ai_conversations table policies
-- ----------------------------------------------------------------------------
CREATE POLICY ai_conversations_select ON ai_conversations
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY ai_conversations_insert ON ai_conversations
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY ai_conversations_delete ON ai_conversations
    FOR DELETE
    USING (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- notification_log table policies
-- ----------------------------------------------------------------------------
CREATE POLICY notification_log_select ON notification_log
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY notification_log_insert ON notification_log
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- subscription_events table policies
-- ----------------------------------------------------------------------------
CREATE POLICY subscription_events_select ON subscription_events
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY subscription_events_insert ON subscription_events
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- INITIAL DATA (Optional - for testing)
-- ============================================================================

-- Note: In production, remove or comment out any test data inserts

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE users IS 'User accounts linked to Supabase auth';
COMMENT ON TABLE businesses IS 'Business entities owned by users';
COMMENT ON TABLE license_tracking IS 'License tracking records for businesses';
COMMENT ON TABLE documents IS 'Document vault for business compliance files';
COMMENT ON TABLE reminders IS 'Automated reminders for renewals and deadlines';
COMMENT ON TABLE compliance_events IS 'Compliance events and filing requirements';
COMMENT ON TABLE ai_conversations IS 'AI assistant conversation history';
COMMENT ON TABLE notification_log IS 'Log of all sent notifications';
COMMENT ON TABLE subscription_events IS 'Subscription and payment event history';

COMMENT ON COLUMN businesses.health_score IS 'Computed compliance health score (0-100)';
COMMENT ON COLUMN users.notification_prefs IS 'JSON object with notification channel preferences';
COMMENT ON COLUMN documents.file_key IS 'S3 object key for encrypted document storage';
