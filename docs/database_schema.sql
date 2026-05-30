-- ==========================================================================
-- FOOD RESCUE CONNECT - ENTERPRISE POSTGRESQL SCHEMA
-- Academic & Production-Grade Relational Schema with Automated Trigger Systems
-- ==========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS FOR ROLE-BASED ACCESS CONTROL (RBAC) & STATE MACHINES
CREATE TYPE user_role AS ENUM ('donor', 'ngo', 'volunteer', 'admin');
CREATE TYPE donation_status AS ENUM ('pending', 'approved', 'claimed', 'transit', 'delivered', 'rejected');
CREATE TYPE donation_scale AS ENUM ('household', 'event_bulk');
CREATE TYPE urgency_tier AS ENUM ('low', 'medium', 'high', 'critical');

-- 2. USERS TABLE (Core Authentication & Gamification Metrics)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'donor',
    phone VARCHAR(20) NOT NULL,
    avatar_url VARCHAR(255),
    points INTEGER DEFAULT 0 CHECK (points >= 0),
    level INTEGER DEFAULT 1 CHECK (level >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for authentication and search efficiency
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- 3. ORGANIZATIONS TABLE (NGO, Shelters, Foodbanks, College Canteens)
CREATE TABLE organizations (
    org_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'Shelter', 'NGO Trust', 'Campus Canteen', 'Banquet'
    registration_no VARCHAR(100) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    capacity INTEGER DEFAULT 0 CHECK (capacity >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orgs_verification ON organizations(is_verified);
CREATE INDEX idx_orgs_geo ON organizations(latitude, longitude);

-- 4. DONATIONS TABLE (Surplus Declarations, AI Freshness Indexing)
CREATE TABLE donations (
    donation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES users(user_id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    scale donation_scale NOT NULL DEFAULT 'household',
    quantity_description VARCHAR(255) NOT NULL,
    quantity_meals INTEGER NOT NULL CHECK (quantity_meals > 0),
    freshness_score DECIMAL(5,2) CHECK (freshness_score >= 0.00 AND freshness_score <= 100.00),
    consumption_window_hours INTEGER NOT NULL CHECK (consumption_window_hours > 0),
    status donation_status NOT NULL DEFAULT 'pending',
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_expiry ON donations(expires_at);

-- 5. RESCUE_MATCHES TABLE (Matching Engine Connecting Donors, Riders, NGOs)
CREATE TABLE rescue_matches (
    match_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_id UUID REFERENCES donations(donation_id) ON DELETE CASCADE,
    volunteer_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    ngo_id UUID REFERENCES organizations(org_id) ON DELETE RESTRICT,
    verification_qr_code VARCHAR(255) UNIQUE NOT NULL,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    picked_up_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_matches_volunteer ON rescue_matches(volunteer_id);

-- 6. COMMUNITY_SHORTAGES TABLE (NGO-Reported Food Deficits)
CREATE TABLE community_shortages (
    shortage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(org_id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    urgency urgency_tier NOT NULL DEFAULT 'medium',
    meals_needed INTEGER NOT NULL CHECK (meals_needed > 0),
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. CHAT_LOGS TABLE (Real-time Donor-Rider-Shelter Communication)
CREATE TABLE chat_logs (
    chat_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES rescue_matches(match_id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. SYSTEM_AUDIT_LOGS TABLE (Security, Abuse Tracking & RBAC Checks)
CREATE TABLE system_audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL, -- 'AUTH_SUCCESS', 'QUALITY_REJECT', 'USER_SUSPEND'
    triggered_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================================
-- AUTOMATION TRIGGER: Automatically Level Up Volunteer / Award Points
-- ==========================================================================

CREATE OR REPLACE FUNCTION award_points_on_delivery()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
        -- 1. Add points to Volunteer Rider
        UPDATE users 
        SET points = points + 150
        WHERE user_id = NEW.volunteer_id;
        
        -- 2. Recalculate level (Level = floor(sqrt(points / 100)) + 1)
        UPDATE users
        SET level = GREATEST(1, FLOOR(SQRT(points / 100))::INTEGER)
        WHERE user_id = NEW.volunteer_id;

        -- 3. Log audit event
        INSERT INTO system_audit_logs (event_type, triggered_by, description)
        VALUES ('MATCH_COMPLETED', NEW.volunteer_id, 'Delivery verification completed. 150 points awarded.');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_completed_rescue
AFTER UPDATE ON rescue_matches
FOR EACH ROW
EXECUTE FUNCTION award_points_on_delivery();
