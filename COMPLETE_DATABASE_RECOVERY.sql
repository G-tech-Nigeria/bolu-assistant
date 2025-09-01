-- =============================================================================
-- COMPLETE DATABASE RECOVERY FOR BOLULIFE PROJECT
-- =============================================================================
-- This file contains ALL SQL needed to completely restore your database
-- Run this in your Supabase SQL Editor or PostgreSQL database
-- 
-- IMPORTANT: This will recreate ALL tables and structure for your BoluLife app
-- =============================================================================

-- Clean up any existing policies and tables (optional - use with caution)
-- DROP POLICY IF EXISTS "Allow public access to calendar_events" ON calendar_events;
-- (Add more DROP statements if needed)

-- =============================================================================
-- 1. CORE TABLES - Main application tables
-- =============================================================================

-- Calendar Events
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    category TEXT DEFAULT 'general',
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar Categories
CREATE TABLE IF NOT EXISTS calendar_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note Folders (create first since notes references it)
CREATE TABLE IF NOT EXISTS note_folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes
CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    folder_id UUID REFERENCES note_folders(id) ON DELETE SET NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agenda Tasks
CREATE TABLE IF NOT EXISTS agenda_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time_range TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority TEXT DEFAULT 'medium',
    category TEXT DEFAULT 'general',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plants
CREATE TABLE IF NOT EXISTS plants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    species TEXT,
    type TEXT,
    location TEXT,
    health TEXT DEFAULT 'healthy',
    light_needs TEXT DEFAULT 'medium',
    last_watered TIMESTAMP WITH TIME ZONE,
    next_watering TIMESTAMP WITH TIME ZONE,
    watering_frequency INTEGER DEFAULT 7,
    humidity_needs TEXT DEFAULT 'medium',
    temperature_range TEXT DEFAULT '18-24°C',
    fertilizer_frequency INTEGER DEFAULT 4,
    last_fertilized TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    size TEXT DEFAULT 'medium',
    pot_size TEXT,
    image_url TEXT,
    care_tasks JSONB,
    pot_color TEXT DEFAULT '#8B4513',
    plant_type TEXT DEFAULT 'tropical',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 2. FINANCE TABLES
-- =============================================================================

-- Finance Transactions
CREATE TABLE IF NOT EXISTS finance_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'completed',
    expected_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets
CREATE TABLE IF NOT EXISTS budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    spent DECIMAL(10,2) DEFAULT 0,
    month TEXT NOT NULL,
    year INTEGER NOT NULL,
    budget_limit DECIMAL(10,2),
    period TEXT DEFAULT 'monthly' CHECK (period IN ('monthly', 'yearly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bills
CREATE TABLE IF NOT EXISTS bills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    name TEXT,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    category TEXT DEFAULT 'utilities',
    status TEXT DEFAULT 'pending',
    paid_date DATE,
    is_recurring BOOLEAN DEFAULT false,
    frequency TEXT DEFAULT 'monthly' CHECK (frequency IN ('monthly', 'quarterly', 'yearly', 'once')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Savings Goals
CREATE TABLE IF NOT EXISTS savings_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    name TEXT NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) DEFAULT 0,
    category TEXT DEFAULT 'general',
    target_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 3. HEALTH & WELLNESS TABLES
-- =============================================================================

-- Health Habits
CREATE TABLE IF NOT EXISTS health_habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 4. CAREER & BUSINESS TABLES
-- =============================================================================

-- Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    job_description TEXT,
    location TEXT,
    salary_range TEXT,
    employment_type TEXT,
    application_status TEXT DEFAULT 'applied',
    application_date DATE NOT NULL,
    application_url TEXT,
    contact_person TEXT,
    contact_email TEXT,
    notes TEXT,
    interview_dates JSONB,
    documents_submitted JSONB,
    follow_up_date DATE,
    priority_level INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Areas
CREATE TABLE IF NOT EXISTS business_areas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Goals
CREATE TABLE IF NOT EXISTS business_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    area_id UUID REFERENCES business_areas(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'in_progress',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Ideas
CREATE TABLE IF NOT EXISTS business_ideas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    area_id UUID REFERENCES business_areas(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'idea',
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Note Folders
CREATE TABLE IF NOT EXISTS business_note_folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    area_id UUID REFERENCES business_areas(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Notes
CREATE TABLE IF NOT EXISTS business_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    area_id UUID REFERENCES business_areas(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES business_note_folders(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    business_area TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 5. LIFE GOALS & PERSONAL DEVELOPMENT
-- =============================================================================

-- Life Goals
CREATE TABLE IF NOT EXISTS life_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'in_progress',
    target_date DATE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    preference_key TEXT NOT NULL UNIQUE,
    preference_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 6. DEVELOPMENT & LEARNING TABLES
-- =============================================================================

-- Development Roadmap Phases
CREATE TABLE IF NOT EXISTS dev_roadmap_phases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    status TEXT DEFAULT 'not_started',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Topics
CREATE TABLE IF NOT EXISTS dev_roadmap_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phase_id UUID REFERENCES dev_roadmap_phases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Projects
CREATE TABLE IF NOT EXISTS dev_roadmap_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phase_id UUID REFERENCES dev_roadmap_phases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    status TEXT DEFAULT 'not_started',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Resources
CREATE TABLE IF NOT EXISTS dev_roadmap_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id UUID REFERENCES dev_roadmap_topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT,
    type TEXT DEFAULT 'link',
    order_index INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap User Stats
CREATE TABLE IF NOT EXISTS dev_roadmap_user_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    current_streak INTEGER DEFAULT 0,
    total_hours DECIMAL(5,2) DEFAULT 0,
    leetcode_solved INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Daily Logs
CREATE TABLE IF NOT EXISTS dev_roadmap_daily_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    hours_studied DECIMAL(3,1) DEFAULT 0,
    leetcode_solved INTEGER DEFAULT 0,
    notes TEXT,
    phase_id UUID REFERENCES dev_roadmap_phases(id),
    topic_id UUID REFERENCES dev_roadmap_topics(id),
    project_id UUID REFERENCES dev_roadmap_projects(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Achievements
CREATE TABLE IF NOT EXISTS dev_roadmap_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    unlocked BOOLEAN DEFAULT FALSE,
    order_index INTEGER NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Study Sessions
CREATE TABLE IF NOT EXISTS dev_roadmap_study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coding Journey Progress
CREATE TABLE IF NOT EXISTS coding_journey_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'default',
    section_id TEXT NOT NULL,
    subsection_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, section_id, subsection_id)
);

-- Portfolio Links
CREATE TABLE IF NOT EXISTS portfolio_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 7. NOTIFICATIONS & PUSH SYSTEM
-- =============================================================================

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('reminder', 'achievement', 'alert', 'info')),
    category TEXT NOT NULL CHECK (category IN ('calendar', 'agenda', 'health', 'plants', 'finance', 'dev', 'general')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    icon TEXT,
    data JSONB,
    user_id TEXT DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Push Subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    endpoint TEXT UNIQUE NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_id TEXT DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 8. ACCOUNTABILITY SYSTEM
-- =============================================================================

-- Accountability Users
CREATE TABLE IF NOT EXISTS accountability_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL DEFAULT '👤',
    points INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accountability Tasks
CREATE TABLE IF NOT EXISTS accountability_tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES accountability_users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    proof_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accountability Penalties
CREATE TABLE IF NOT EXISTS accountability_penalties (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES accountability_users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accountability Achievements
CREATE TABLE IF NOT EXISTS accountability_achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES accountability_users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accountability Settings
CREATE TABLE IF NOT EXISTS accountability_settings (
    id TEXT PRIMARY KEY,
    penalty_amount DECIMAL(10,2) NOT NULL DEFAULT 5.00,
    points_per_task INTEGER NOT NULL DEFAULT 10,
    points_per_achievement INTEGER NOT NULL DEFAULT 25,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 9. CREATE ALL INDEXES FOR PERFORMANCE
-- =============================================================================

-- Calendar indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_category ON calendar_events(category);

-- Agenda indexes
CREATE INDEX IF NOT EXISTS idx_agenda_tasks_date ON agenda_tasks(date);
CREATE INDEX IF NOT EXISTS idx_agenda_tasks_completed ON agenda_tasks(completed);
CREATE INDEX IF NOT EXISTS idx_agenda_tasks_order ON agenda_tasks(order_index);

-- Notes indexes
CREATE INDEX IF NOT EXISTS idx_notes_folder_id ON notes(folder_id);
CREATE INDEX IF NOT EXISTS idx_notes_is_pinned ON notes(is_pinned);
CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title);

-- Plants indexes
CREATE INDEX IF NOT EXISTS idx_plants_next_watering ON plants(next_watering);
CREATE INDEX IF NOT EXISTS idx_plants_type ON plants(type);
CREATE INDEX IF NOT EXISTS idx_plants_health ON plants(health);
CREATE INDEX IF NOT EXISTS idx_plants_light_needs ON plants(light_needs);

-- Finance indexes
CREATE INDEX IF NOT EXISTS idx_finance_transactions_type ON finance_transactions(type);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_date ON finance_transactions(date);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_category ON finance_transactions(category);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_date_type ON finance_transactions(date, type);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_status ON finance_transactions(status);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_expected_date ON finance_transactions(expected_date);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);
CREATE INDEX IF NOT EXISTS idx_savings_goals_category ON savings_goals(category);
CREATE INDEX IF NOT EXISTS idx_bills_due_date ON bills(due_date);
CREATE INDEX IF NOT EXISTS idx_bills_status ON bills(status);
CREATE INDEX IF NOT EXISTS idx_bills_category ON bills(category);
CREATE INDEX IF NOT EXISTS idx_bills_paid_date ON bills(paid_date);

-- Job applications indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_date ON job_applications(application_date);
CREATE INDEX IF NOT EXISTS idx_job_applications_company ON job_applications(company_name);
CREATE INDEX IF NOT EXISTS idx_job_applications_priority ON job_applications(priority_level);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(application_status);

-- Business indexes
CREATE INDEX IF NOT EXISTS idx_business_goals_area ON business_goals(area_id);
CREATE INDEX IF NOT EXISTS idx_business_goals_completed ON business_goals(status);
CREATE INDEX IF NOT EXISTS idx_business_goals_priority ON business_goals(priority);
CREATE INDEX IF NOT EXISTS idx_business_goals_order ON business_goals(order_index);
CREATE INDEX IF NOT EXISTS idx_business_ideas_area ON business_ideas(area_id);
CREATE INDEX IF NOT EXISTS idx_business_ideas_status ON business_ideas(status);
CREATE INDEX IF NOT EXISTS idx_business_ideas_category ON business_ideas(category);
CREATE INDEX IF NOT EXISTS idx_business_notes_area ON business_notes(area_id);
CREATE INDEX IF NOT EXISTS idx_business_notes_folder ON business_notes(folder_id);
CREATE INDEX IF NOT EXISTS idx_business_notes_pinned ON business_notes(is_pinned);
CREATE INDEX IF NOT EXISTS idx_business_note_folders_area ON business_note_folders(area_id);

-- Life goals indexes
CREATE INDEX IF NOT EXISTS idx_life_goals_category ON life_goals(category);
CREATE INDEX IF NOT EXISTS idx_life_goals_status ON life_goals(status);
CREATE INDEX IF NOT EXISTS idx_life_goals_priority ON life_goals(priority);
CREATE INDEX IF NOT EXISTS idx_life_goals_target_date ON life_goals(target_date);

-- User preferences indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_key ON user_preferences(preference_key);

-- Development roadmap indexes
CREATE INDEX IF NOT EXISTS idx_phases_status ON dev_roadmap_phases(status);
CREATE INDEX IF NOT EXISTS idx_topics_phase_id ON dev_roadmap_topics(phase_id);
CREATE INDEX IF NOT EXISTS idx_topics_completed ON dev_roadmap_topics(completed);
CREATE INDEX IF NOT EXISTS idx_topics_order ON dev_roadmap_topics(order_index);
CREATE INDEX IF NOT EXISTS idx_resources_topic_id ON dev_roadmap_resources(topic_id);
CREATE INDEX IF NOT EXISTS idx_resources_completed ON dev_roadmap_resources(completed);
CREATE INDEX IF NOT EXISTS idx_resources_order ON dev_roadmap_resources(order_index);
CREATE INDEX IF NOT EXISTS idx_projects_phase_id ON dev_roadmap_projects(phase_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON dev_roadmap_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_order ON dev_roadmap_projects(order_index);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON dev_roadmap_daily_logs(date);
CREATE INDEX IF NOT EXISTS idx_achievements_unlocked ON dev_roadmap_achievements(unlocked);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON dev_roadmap_achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_active ON dev_roadmap_achievements(active);
CREATE INDEX IF NOT EXISTS idx_achievements_order ON dev_roadmap_achievements(order_index);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON dev_roadmap_study_sessions(date);
CREATE INDEX IF NOT EXISTS idx_study_sessions_completed ON dev_roadmap_study_sessions(completed);
CREATE INDEX IF NOT EXISTS idx_coding_journey_user_id ON coding_journey_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_coding_journey_section_id ON coding_journey_progress(section_id);
CREATE INDEX IF NOT EXISTS idx_coding_journey_subsection_id ON coding_journey_progress(subsection_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_links_category ON portfolio_links(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_links_order ON portfolio_links(order_index);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_sent_at ON notifications(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications(category);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Accountability indexes
CREATE INDEX IF NOT EXISTS idx_accountability_tasks_user_date ON accountability_tasks(user_id, date);
CREATE INDEX IF NOT EXISTS idx_accountability_tasks_date ON accountability_tasks(date);
CREATE INDEX IF NOT EXISTS idx_accountability_penalties_user_date ON accountability_penalties(user_id, date);
CREATE INDEX IF NOT EXISTS idx_accountability_achievements_user ON accountability_achievements(user_id);

-- =============================================================================
-- 10. ENABLE ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_note_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE life_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_penalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_settings ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 11. CREATE POLICIES FOR PUBLIC ACCESS (Personal App)
-- =============================================================================

-- Calendar policies
CREATE POLICY "Allow public access to calendar_events" ON calendar_events FOR ALL USING (true);
CREATE POLICY "Allow public access to calendar_categories" ON calendar_categories FOR ALL USING (true);

-- Agenda policies
CREATE POLICY "Allow public access to agenda_tasks" ON agenda_tasks FOR ALL USING (true);

-- Notes policies
CREATE POLICY "Allow public access to notes" ON notes FOR ALL USING (true);
CREATE POLICY "Allow public access to note_folders" ON note_folders FOR ALL USING (true);

-- Plants policies
CREATE POLICY "Allow public access to plants" ON plants FOR ALL USING (true);

-- Finance policies
CREATE POLICY "Allow public access to finance_transactions" ON finance_transactions FOR ALL USING (true);
CREATE POLICY "Allow public access to budgets" ON budgets FOR ALL USING (true);
CREATE POLICY "Allow public access to bills" ON bills FOR ALL USING (true);
CREATE POLICY "Allow public access to savings_goals" ON savings_goals FOR ALL USING (true);

-- Health policies
CREATE POLICY "Allow public access to health_habits" ON health_habits FOR ALL USING (true);

-- Job applications policies
CREATE POLICY "Allow public access to job_applications" ON job_applications FOR ALL USING (true);

-- Business policies
CREATE POLICY "Allow public access to business_areas" ON business_areas FOR ALL USING (true);
CREATE POLICY "Allow public access to business_goals" ON business_goals FOR ALL USING (true);
CREATE POLICY "Allow public access to business_ideas" ON business_ideas FOR ALL USING (true);
CREATE POLICY "Allow public access to business_notes" ON business_notes FOR ALL USING (true);
CREATE POLICY "Allow public access to business_note_folders" ON business_note_folders FOR ALL USING (true);

-- Life goals policies
CREATE POLICY "Allow public access to life_goals" ON life_goals FOR ALL USING (true);

-- User preferences policies
CREATE POLICY "Allow public access to user_preferences" ON user_preferences FOR ALL USING (true);

-- Development roadmap policies
CREATE POLICY "Allow public access to dev_roadmap_phases" ON dev_roadmap_phases FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_topics" ON dev_roadmap_topics FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_projects" ON dev_roadmap_projects FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_resources" ON dev_roadmap_resources FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_user_stats" ON dev_roadmap_user_stats FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_daily_logs" ON dev_roadmap_daily_logs FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_achievements" ON dev_roadmap_achievements FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_study_sessions" ON dev_roadmap_study_sessions FOR ALL USING (true);
CREATE POLICY "Allow public access to coding_journey_progress" ON coding_journey_progress FOR ALL USING (true);
CREATE POLICY "Allow public access to portfolio_links" ON portfolio_links FOR ALL USING (true);

-- Notifications policies
CREATE POLICY "Allow public access to notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Allow public access to push_subscriptions" ON push_subscriptions FOR ALL USING (true);

-- Accountability policies
CREATE POLICY "Allow all operations on accountability_users" ON accountability_users FOR ALL USING (true);
CREATE POLICY "Allow all operations on accountability_tasks" ON accountability_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on accountability_penalties" ON accountability_penalties FOR ALL USING (true);
CREATE POLICY "Allow all operations on accountability_achievements" ON accountability_achievements FOR ALL USING (true);
CREATE POLICY "Allow all operations on accountability_settings" ON accountability_settings FOR ALL USING (true);

-- =============================================================================
-- 12. GRANT PERMISSIONS
-- =============================================================================

-- Grant permissions to all tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- =============================================================================
-- 13. CREATE UTILITY FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables with updated_at column
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agenda_tasks_updated_at BEFORE UPDATE ON agenda_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_note_folders_updated_at BEFORE UPDATE ON note_folders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plants_updated_at BEFORE UPDATE ON plants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_finance_transactions_updated_at BEFORE UPDATE ON finance_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bills_updated_at BEFORE UPDATE ON bills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON savings_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_habits_updated_at BEFORE UPDATE ON health_habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_areas_updated_at BEFORE UPDATE ON business_areas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_goals_updated_at BEFORE UPDATE ON business_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_ideas_updated_at BEFORE UPDATE ON business_ideas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_notes_updated_at BEFORE UPDATE ON business_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_note_folders_updated_at BEFORE UPDATE ON business_note_folders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_life_goals_updated_at BEFORE UPDATE ON life_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_phases_updated_at BEFORE UPDATE ON dev_roadmap_phases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_topics_updated_at BEFORE UPDATE ON dev_roadmap_topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_projects_updated_at BEFORE UPDATE ON dev_roadmap_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_resources_updated_at BEFORE UPDATE ON dev_roadmap_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_user_stats_updated_at BEFORE UPDATE ON dev_roadmap_user_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_daily_logs_updated_at BEFORE UPDATE ON dev_roadmap_daily_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_achievements_updated_at BEFORE UPDATE ON dev_roadmap_achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_study_sessions_updated_at BEFORE UPDATE ON dev_roadmap_study_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coding_journey_progress_updated_at BEFORE UPDATE ON coding_journey_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_links_updated_at BEFORE UPDATE ON portfolio_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_push_subscriptions_updated_at BEFORE UPDATE ON push_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Finance-specific functions
CREATE OR REPLACE FUNCTION update_budget_spent()
RETURNS TRIGGER AS $$
BEGIN
    -- Update budget spent when a transaction is added/updated
    IF NEW.type = 'expense' THEN
        UPDATE budgets 
        SET spent = spent + NEW.amount,
            updated_at = NOW()
        WHERE category = NEW.category;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update budget spent
CREATE TRIGGER update_budget_on_transaction
    AFTER INSERT OR UPDATE ON finance_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_budget_spent();

-- Notification utility functions
CREATE OR REPLACE FUNCTION clean_old_notifications()
RETURNS void AS $$
BEGIN
    -- Delete notifications older than 30 days
    DELETE FROM notifications 
    WHERE sent_at < NOW() - INTERVAL '30 days'
    AND read = true;
    
    -- Delete scheduled notifications that are past due by more than 7 days
    DELETE FROM notifications 
    WHERE scheduled_for < NOW() - INTERVAL '7 days'
    AND sent_at IS NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_notification_stats(user_id_param TEXT DEFAULT 'default')
RETURNS TABLE(
    total_notifications BIGINT,
    unread_count BIGINT,
    read_count BIGINT,
    high_priority_count BIGINT,
    today_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_notifications,
        COUNT(*) FILTER (WHERE read = false) as unread_count,
        COUNT(*) FILTER (WHERE read = true) as read_count,
        COUNT(*) FILTER (WHERE priority = 'high') as high_priority_count,
        COUNT(*) FILTER (WHERE DATE(sent_at) = CURRENT_DATE) as today_count
    FROM notifications 
    WHERE notifications.user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 14. INSERT DEFAULT/SAMPLE DATA
-- =============================================================================

-- Insert default calendar categories
INSERT INTO calendar_categories (name, color) VALUES 
('Work', '#EF4444'),
('Personal', '#3B82F6'),
('Health', '#10B981'),
('Finance', '#F59E0B'),
('Learning', '#8B5CF6'),
('Business', '#06B6D4')
ON CONFLICT (name) DO NOTHING;

-- Insert default note folders
INSERT INTO note_folders (name, description) VALUES 
('General', 'General notes and thoughts'),
('Ideas', 'Creative ideas and concepts'),
('Tasks', 'Task lists and reminders')
ON CONFLICT DO NOTHING;

-- Insert default business areas
INSERT INTO business_areas (name, description) VALUES 
('Technology', 'Tech-related business ventures'),
('Health & Wellness', 'Health and wellness products/services'),
('Education', 'Educational content and services'),
('Finance', 'Financial services and products')
ON CONFLICT DO NOTHING;

-- Insert default development phases
INSERT INTO dev_roadmap_phases (title, description, order_index, status) VALUES 
('Foundation', 'Basic programming concepts and fundamentals', 1, 'in_progress'),
('Frontend Development', 'HTML, CSS, JavaScript, React', 2, 'not_started'),
('Backend Development', 'Node.js, databases, APIs', 3, 'not_started'),
('Advanced Concepts', 'System design, algorithms, best practices', 4, 'not_started')
ON CONFLICT DO NOTHING;

-- Insert default achievements
INSERT INTO dev_roadmap_achievements (title, description, category, order_index) VALUES 
('First Steps', 'Complete your first programming lesson', 'beginner', 1),
('Code Warrior', 'Complete 10 lessons', 'progress', 2),
('Streak Master', 'Maintain a 7-day study streak', 'consistency', 3),
('Problem Solver', 'Solve 5 LeetCode problems', 'skills', 4)
ON CONFLICT DO NOTHING;

-- Insert default accountability settings
INSERT INTO accountability_settings (id, penalty_amount, points_per_task, points_per_achievement)
VALUES ('default-settings', 5.00, 10, 25)
ON CONFLICT (id) DO NOTHING;

-- Insert default accountability users
INSERT INTO accountability_users (id, name, avatar, points, streak)
VALUES 
    ('default-user-1', 'Me', '👤', 0, 0),
    ('default-user-2', 'Friend', '👥', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (title, body, type, category, priority, action_url, icon) VALUES
('Welcome to BoluLife! 🎉', 'Your personal command center is ready to help you stay organized and productive.', 'info', 'general', 'medium', '/', '🎯'),
('Plant Care Reminder', 'Time to water your plants! Check your plant care schedule.', 'reminder', 'plants', 'medium', '/plant-care', '🌱'),
('Daily Task Check-in', 'Do not forget to review and update your daily agenda.', 'reminder', 'agenda', 'high', '/agenda', '📋'),
('Health Goal Achievement', 'Congratulations! You have maintained your gym streak for 7 days!', 'achievement', 'health', 'high', '/health-habits', '🏆')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- 15. FINAL GRANTS AND PERMISSIONS
-- =============================================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_notification_stats(TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION clean_old_notifications() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION update_budget_spent() TO authenticated, anon;

-- =============================================================================
-- RECOVERY COMPLETE!
-- =============================================================================
-- Your BoluLife database has been completely restored with:
-- ✅ All 25+ tables recreated
-- ✅ All indexes for performance
-- ✅ Row Level Security enabled
-- ✅ Public access policies (for personal use)
-- ✅ All triggers and functions
-- ✅ Sample/default data inserted
-- ✅ Complete structure matching your application code
-- 
-- Your app should now work perfectly with this restored database!
-- =============================================================================
