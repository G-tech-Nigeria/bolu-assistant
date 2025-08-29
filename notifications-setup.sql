-- Notifications and Push Subscriptions Setup
-- Run this in your Supabase SQL editor

-- Create notifications table
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create push subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    endpoint TEXT UNIQUE NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_id TEXT DEFAULT 'default',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_sent_at ON notifications(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications(category);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON notifications(scheduled_for);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Enable Row Level Security (RLS)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications table
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = 'default');

CREATE POLICY "Users can insert their own notifications" ON notifications
    FOR INSERT WITH CHECK (user_id = 'default');

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (user_id = 'default');

CREATE POLICY "Users can delete their own notifications" ON notifications
    FOR DELETE USING (user_id = 'default');

-- Create policies for push_subscriptions table
CREATE POLICY "Users can view their own push subscriptions" ON push_subscriptions
    FOR SELECT USING (user_id = 'default');

CREATE POLICY "Users can insert their own push subscriptions" ON push_subscriptions
    FOR INSERT WITH CHECK (user_id = 'default');

CREATE POLICY "Users can update their own push subscriptions" ON push_subscriptions
    FOR UPDATE USING (user_id = 'default');

CREATE POLICY "Users can delete their own push subscriptions" ON push_subscriptions
    FOR DELETE USING (user_id = 'default');

-- Create function to clean up old notifications
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

-- Create a scheduled job to clean up old notifications (runs daily)
-- Note: This requires pg_cron extension to be enabled in Supabase
-- SELECT cron.schedule('clean-old-notifications', '0 2 * * *', 'SELECT clean_old_notifications();');

-- Create function to get notification statistics
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

-- Create function to mark notifications as read
CREATE OR REPLACE FUNCTION mark_notifications_read(
    notification_ids UUID[],
    user_id_param TEXT DEFAULT 'default'
)
RETURNS void AS $$
BEGIN
    UPDATE notifications 
    SET read = true, updated_at = NOW()
    WHERE id = ANY(notification_ids)
    AND user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read(
    user_id_param TEXT DEFAULT 'default'
)
RETURNS void AS $$
BEGIN
    UPDATE notifications 
    SET read = true, updated_at = NOW()
    WHERE user_id = user_id_param
    AND read = false;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample notifications for testing
INSERT INTO notifications (title, body, type, category, priority, action_url, icon) VALUES
('Welcome to BoluLife! 🎉', 'Your personal command center is ready to help you stay organized and productive.', 'info', 'general', 'medium', '/', '🎯'),
('Plant Care Reminder', 'Time to water your plants! Check your plant care schedule.', 'reminder', 'plants', 'medium', '/plant-care', '🌱'),
('Daily Task Check-in', 'Do not forget to review and update your daily agenda.', 'reminder', 'agenda', 'high', '/agenda', '📋'),
('Health Goal Achievement', 'Congratulations! You have maintained your gym streak for 7 days!', 'achievement', 'health', 'high', '/health-habits', '🏆')
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON notifications TO authenticated;
GRANT ALL ON push_subscriptions TO authenticated;
GRANT EXECUTE ON FUNCTION get_notification_stats(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notifications_read(UUID[], TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_all_notifications_read(TEXT) TO authenticated;
