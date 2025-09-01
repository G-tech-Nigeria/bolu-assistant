-- Restore Complete Dev Roadmap with All Subsections
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- DROP AND RECREATE TABLES
-- =============================================================================

DROP TABLE IF EXISTS dev_roadmap_study_sessions CASCADE;
DROP TABLE IF EXISTS dev_roadmap_daily_logs CASCADE;
DROP TABLE IF EXISTS dev_roadmap_achievements CASCADE;
DROP TABLE IF EXISTS dev_roadmap_user_stats CASCADE;
DROP TABLE IF EXISTS dev_roadmap_resources CASCADE;
DROP TABLE IF EXISTS dev_roadmap_projects CASCADE;
DROP TABLE IF EXISTS dev_roadmap_topics CASCADE;
DROP TABLE IF EXISTS dev_roadmap_phases CASCADE;

-- =============================================================================
-- CREATE TABLES
-- =============================================================================

-- Development Roadmap Phases
CREATE TABLE dev_roadmap_phases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    start_date DATE,
    end_date DATE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Topics
CREATE TABLE dev_roadmap_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phase_id UUID REFERENCES dev_roadmap_phases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Projects
CREATE TABLE dev_roadmap_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phase_id UUID REFERENCES dev_roadmap_phases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Resources
CREATE TABLE dev_roadmap_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id UUID REFERENCES dev_roadmap_topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT,
    type TEXT DEFAULT 'link' CHECK (type IN ('link', 'video', 'document', 'book')),
    completed BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap User Stats
CREATE TABLE dev_roadmap_user_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    total_hours NUMERIC(10,2) DEFAULT 0,
    total_leetcode_solved INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    total_achievements_unlocked INTEGER DEFAULT 0,
    total_projects_completed INTEGER DEFAULT 0,
    total_topics_completed INTEGER DEFAULT 0,
    total_phases_completed INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Daily Logs
CREATE TABLE dev_roadmap_daily_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    phase_id UUID REFERENCES dev_roadmap_phases(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES dev_roadmap_topics(id) ON DELETE SET NULL,
    project_id UUID REFERENCES dev_roadmap_projects(id) ON DELETE SET NULL,
    hours_spent NUMERIC(4,2) DEFAULT 0,
    leetcode_problems INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Achievements
CREATE TABLE dev_roadmap_achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    unlocked BOOLEAN DEFAULT FALSE,
    requirement TEXT,
    category TEXT DEFAULT 'general',
    points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Development Roadmap Study Sessions
CREATE TABLE dev_roadmap_study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    topic TEXT,
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- CREATE INDEXES
-- =============================================================================

CREATE INDEX idx_phases_status ON dev_roadmap_phases(status);
CREATE INDEX idx_phases_dates ON dev_roadmap_phases(start_date, end_date);
CREATE INDEX idx_topics_phase_id ON dev_roadmap_topics(phase_id);
CREATE INDEX idx_topics_completed ON dev_roadmap_topics(completed);
CREATE INDEX idx_topics_order ON dev_roadmap_topics(order_index);
CREATE INDEX idx_resources_topic_id ON dev_roadmap_resources(topic_id);
CREATE INDEX idx_resources_completed ON dev_roadmap_resources(completed);
CREATE INDEX idx_resources_order ON dev_roadmap_resources(order_index);
CREATE INDEX idx_projects_phase_id ON dev_roadmap_projects(phase_id);
CREATE INDEX idx_projects_status ON dev_roadmap_projects(status);
CREATE INDEX idx_projects_order ON dev_roadmap_projects(order_index);
CREATE INDEX idx_daily_logs_date ON dev_roadmap_daily_logs(date);
CREATE INDEX idx_daily_logs_phase_id ON dev_roadmap_daily_logs(phase_id);
CREATE INDEX idx_daily_logs_topic_id ON dev_roadmap_daily_logs(topic_id);
CREATE INDEX idx_daily_logs_project_id ON dev_roadmap_daily_logs(project_id);
CREATE INDEX idx_achievements_unlocked ON dev_roadmap_achievements(unlocked);
CREATE INDEX idx_achievements_category ON dev_roadmap_achievements(category);
CREATE INDEX idx_achievements_active ON dev_roadmap_achievements(is_active);
CREATE INDEX idx_achievements_order ON dev_roadmap_achievements(order_index);
CREATE INDEX idx_study_sessions_date ON dev_roadmap_study_sessions(date);
CREATE INDEX idx_study_sessions_completed ON dev_roadmap_study_sessions(completed);

-- =============================================================================
-- ENABLE RLS AND CREATE POLICIES
-- =============================================================================

ALTER TABLE dev_roadmap_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE dev_roadmap_study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to dev_roadmap_phases" ON dev_roadmap_phases FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_topics" ON dev_roadmap_topics FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_projects" ON dev_roadmap_projects FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_resources" ON dev_roadmap_resources FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_user_stats" ON dev_roadmap_user_stats FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_daily_logs" ON dev_roadmap_daily_logs FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_achievements" ON dev_roadmap_achievements FOR ALL USING (true);
CREATE POLICY "Allow public access to dev_roadmap_study_sessions" ON dev_roadmap_study_sessions FOR ALL USING (true);

-- =============================================================================
-- CREATE TRIGGERS
-- =============================================================================

CREATE TRIGGER update_dev_roadmap_phases_updated_at BEFORE UPDATE ON dev_roadmap_phases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_topics_updated_at BEFORE UPDATE ON dev_roadmap_topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_projects_updated_at BEFORE UPDATE ON dev_roadmap_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_resources_updated_at BEFORE UPDATE ON dev_roadmap_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_user_stats_updated_at BEFORE UPDATE ON dev_roadmap_user_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_daily_logs_updated_at BEFORE UPDATE ON dev_roadmap_daily_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_achievements_updated_at BEFORE UPDATE ON dev_roadmap_achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dev_roadmap_study_sessions_updated_at BEFORE UPDATE ON dev_roadmap_study_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- INSERT COMPLETE DEV ROADMAP CONTENT
-- =============================================================================

-- Insert Development Phases
INSERT INTO dev_roadmap_phases (title, description, status, order_index) VALUES
('Foundation', 'Learn the fundamentals of programming and computer science', 'not_started', 1),
('Frontend Development', 'Master HTML, CSS, JavaScript and modern frontend frameworks', 'not_started', 2),
('Backend Development', 'Learn server-side programming, databases, and APIs', 'not_started', 3),
('Full Stack Development', 'Combine frontend and backend to build complete applications', 'not_started', 4),
('Advanced Topics', 'Explore advanced concepts, algorithms, and system design', 'not_started', 5),
('Job Preparation', 'Prepare for technical interviews and land your first developer job', 'not_started', 6);

-- Get phase IDs for reference
DO $$
DECLARE
    foundation_id UUID;
    frontend_id UUID;
    backend_id UUID;
    fullstack_id UUID;
    advanced_id UUID;
    job_prep_id UUID;
BEGIN
    SELECT id INTO foundation_id FROM dev_roadmap_phases WHERE title = 'Foundation';
    SELECT id INTO frontend_id FROM dev_roadmap_phases WHERE title = 'Frontend Development';
    SELECT id INTO backend_id FROM dev_roadmap_phases WHERE title = 'Backend Development';
    SELECT id INTO fullstack_id FROM dev_roadmap_phases WHERE title = 'Full Stack Development';
    SELECT id INTO advanced_id FROM dev_roadmap_phases WHERE title = 'Advanced Topics';
    SELECT id INTO job_prep_id FROM dev_roadmap_phases WHERE title = 'Job Preparation';

    -- Foundation Topics
    INSERT INTO dev_roadmap_topics (phase_id, title, description, order_index) VALUES
    (foundation_id, 'Programming Fundamentals', 'Learn basic programming concepts, variables, data types, and control structures', 1),
    (foundation_id, 'Object-Oriented Programming', 'Understand classes, objects, inheritance, and polymorphism', 2),
    (foundation_id, 'Data Structures', 'Learn arrays, linked lists, stacks, queues, and trees', 3),
    (foundation_id, 'Algorithms', 'Study sorting, searching, and basic algorithm complexity', 4),
    (foundation_id, 'Version Control with Git', 'Learn Git basics, branching, merging, and collaboration', 5),
    (foundation_id, 'Command Line Basics', 'Master terminal commands and shell scripting', 6);

    -- Frontend Topics
    INSERT INTO dev_roadmap_topics (phase_id, title, description, order_index) VALUES
    (frontend_id, 'HTML5 Fundamentals', 'Learn semantic HTML, forms, and accessibility', 1),
    (frontend_id, 'CSS3 and Styling', 'Master CSS layouts, Flexbox, Grid, and responsive design', 2),
    (frontend_id, 'JavaScript Fundamentals', 'Learn ES6+, DOM manipulation, and async programming', 3),
    (frontend_id, 'React.js Framework', 'Build interactive UIs with React components and hooks', 4),
    (frontend_id, 'State Management', 'Learn Redux, Context API, and state management patterns', 5),
    (frontend_id, 'Frontend Testing', 'Write unit tests and integration tests for frontend code', 6);

    -- Backend Topics
    INSERT INTO dev_roadmap_topics (phase_id, title, description, order_index) VALUES
    (backend_id, 'Node.js and Express', 'Build server-side applications with Node.js', 1),
    (backend_id, 'Database Design', 'Learn SQL, database normalization, and relationships', 2),
    (backend_id, 'RESTful APIs', 'Design and build REST APIs with proper HTTP methods', 3),
    (backend_id, 'Authentication & Authorization', 'Implement JWT, OAuth, and security best practices', 4),
    (backend_id, 'Database Integration', 'Connect applications to PostgreSQL, MongoDB, or other databases', 5),
    (backend_id, 'API Testing', 'Write tests for APIs using tools like Postman and Jest', 6);

    -- Full Stack Topics
    INSERT INTO dev_roadmap_topics (phase_id, title, description, order_index) VALUES
    (fullstack_id, 'Full Stack Architecture', 'Design complete application architecture', 1),
    (fullstack_id, 'Deployment & DevOps', 'Deploy applications using Docker, AWS, or Heroku', 2),
    (fullstack_id, 'Performance Optimization', 'Optimize frontend and backend performance', 3),
    (fullstack_id, 'Security Best Practices', 'Implement security measures across the stack', 4),
    (fullstack_id, 'Monitoring & Logging', 'Set up application monitoring and error tracking', 5),
    (fullstack_id, 'CI/CD Pipelines', 'Automate testing and deployment processes', 6);

    -- Advanced Topics
    INSERT INTO dev_roadmap_topics (phase_id, title, description, order_index) VALUES
    (advanced_id, 'System Design', 'Design scalable systems and microservices', 1),
    (advanced_id, 'Advanced Algorithms', 'Study complex algorithms and data structures', 2),
    (advanced_id, 'Machine Learning Basics', 'Introduction to ML concepts and libraries', 3),
    (advanced_id, 'Cloud Computing', 'Learn AWS, Azure, or Google Cloud services', 4),
    (advanced_id, 'Mobile Development', 'Build mobile apps with React Native or Flutter', 5),
    (advanced_id, 'Blockchain & Web3', 'Explore blockchain technology and smart contracts', 6);

    -- Job Preparation Topics
    INSERT INTO dev_roadmap_topics (phase_id, title, description, order_index) VALUES
    (job_prep_id, 'Technical Interview Prep', 'Practice coding problems and system design', 1),
    (job_prep_id, 'Resume & Portfolio', 'Build a professional resume and portfolio', 2),
    (job_prep_id, 'Networking & LinkedIn', 'Build professional network and online presence', 3),
    (job_prep_id, 'Behavioral Interviews', 'Prepare for behavioral and situational questions', 4),
    (job_prep_id, 'Salary Negotiation', 'Learn negotiation strategies and market rates', 5),
    (job_prep_id, 'Career Planning', 'Plan your career path and growth strategy', 6);

END $$;

-- Insert Projects for each phase
DO $$
DECLARE
    foundation_id UUID;
    frontend_id UUID;
    backend_id UUID;
    fullstack_id UUID;
    advanced_id UUID;
    job_prep_id UUID;
BEGIN
    SELECT id INTO foundation_id FROM dev_roadmap_phases WHERE title = 'Foundation';
    SELECT id INTO frontend_id FROM dev_roadmap_phases WHERE title = 'Frontend Development';
    SELECT id INTO backend_id FROM dev_roadmap_phases WHERE title = 'Backend Development';
    SELECT id INTO fullstack_id FROM dev_roadmap_phases WHERE title = 'Full Stack Development';
    SELECT id INTO advanced_id FROM dev_roadmap_phases WHERE title = 'Advanced Topics';
    SELECT id INTO job_prep_id FROM dev_roadmap_phases WHERE title = 'Job Preparation';

    -- Foundation Projects
    INSERT INTO dev_roadmap_projects (phase_id, title, description, order_index) VALUES
    (foundation_id, 'Calculator App', 'Build a simple calculator using basic programming concepts', 1),
    (foundation_id, 'Todo List', 'Create a command-line todo list application', 2),
    (foundation_id, 'Number Guessing Game', 'Build a game using loops and conditional statements', 3),
    (foundation_id, 'Git Portfolio', 'Create a GitHub portfolio with proper Git workflow', 4);

    -- Frontend Projects
    INSERT INTO dev_roadmap_projects (phase_id, title, description, order_index) VALUES
    (frontend_id, 'Personal Portfolio Website', 'Build a responsive portfolio using HTML, CSS, and JavaScript', 1),
    (frontend_id, 'Weather App', 'Create a weather application using React and external APIs', 2),
    (frontend_id, 'E-commerce Frontend', 'Build a product catalog with shopping cart functionality', 3),
    (frontend_id, 'Social Media Dashboard', 'Create a dashboard with real-time updates', 4);

    -- Backend Projects
    INSERT INTO dev_roadmap_projects (phase_id, title, description, order_index) VALUES
    (backend_id, 'REST API for Blog', 'Build a complete blog API with CRUD operations', 1),
    (backend_id, 'User Authentication System', 'Implement JWT-based authentication', 2),
    (backend_id, 'File Upload Service', 'Create a service for handling file uploads', 3),
    (backend_id, 'Database Management System', 'Build a simple database with SQL queries', 4);

    -- Full Stack Projects
    INSERT INTO dev_roadmap_projects (phase_id, title, description, order_index) VALUES
    (fullstack_id, 'Full Stack Blog Platform', 'Complete blog with frontend and backend', 1),
    (fullstack_id, 'E-commerce Platform', 'Build a complete online store', 2),
    (fullstack_id, 'Task Management App', 'Create a Trello-like application', 3),
    (fullstack_id, 'Real-time Chat Application', 'Build a chat app with WebSocket', 4);

    -- Advanced Projects
    INSERT INTO dev_roadmap_projects (phase_id, title, description, order_index) VALUES
    (advanced_id, 'Microservices Architecture', 'Design and implement microservices', 1),
    (advanced_id, 'Machine Learning API', 'Build an API for ML model predictions', 2),
    (advanced_id, 'Cloud-Native Application', 'Deploy application to cloud platform', 3),
    (advanced_id, 'Mobile App', 'Build a cross-platform mobile application', 4);

    -- Job Preparation Projects
    INSERT INTO dev_roadmap_projects (phase_id, title, description, order_index) VALUES
    (job_prep_id, 'Technical Portfolio', 'Create a comprehensive technical portfolio', 1),
    (job_prep_id, 'Open Source Contribution', 'Contribute to an open source project', 2),
    (job_prep_id, 'Mock Interview Practice', 'Practice technical and behavioral interviews', 3),
    (job_prep_id, 'Career Development Plan', 'Create a detailed career roadmap', 4);

END $$;

-- Insert Resources for key topics
DO $$
DECLARE
    topic_id UUID;
BEGIN
    -- Resources for Programming Fundamentals
    SELECT id INTO topic_id FROM dev_roadmap_topics WHERE title = 'Programming Fundamentals' LIMIT 1;
    INSERT INTO dev_roadmap_resources (topic_id, title, url, type, order_index) VALUES
    (topic_id, 'freeCodeCamp - Basic JavaScript', 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', 'link', 1),
    (topic_id, 'Eloquent JavaScript Book', 'https://eloquentjavascript.net/', 'book', 2),
    (topic_id, 'JavaScript Crash Course', 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 'video', 3);

    -- Resources for React.js
    SELECT id INTO topic_id FROM dev_roadmap_topics WHERE title = 'React.js Framework' LIMIT 1;
    INSERT INTO dev_roadmap_resources (topic_id, title, url, type, order_index) VALUES
    (topic_id, 'React Official Tutorial', 'https://react.dev/learn', 'link', 1),
    (topic_id, 'React Documentation', 'https://react.dev/reference/react', 'document', 2),
    (topic_id, 'React Crash Course', 'https://www.youtube.com/watch?v=bMknfKXIFA8', 'video', 3);

    -- Resources for Node.js
    SELECT id INTO topic_id FROM dev_roadmap_topics WHERE title = 'Node.js and Express' LIMIT 1;
    INSERT INTO dev_roadmap_resources (topic_id, title, url, type, order_index) VALUES
    (topic_id, 'Node.js Official Guide', 'https://nodejs.org/en/learn/', 'link', 1),
    (topic_id, 'Express.js Documentation', 'https://expressjs.com/', 'document', 2),
    (topic_id, 'Node.js Crash Course', 'https://www.youtube.com/watch?v=Oe421EPjeBE', 'video', 3);

END $$;

-- Insert Achievements
INSERT INTO dev_roadmap_achievements (id, title, description, icon, requirement, category, points, order_index, is_active) VALUES
('first-hour', 'First Hour', 'Complete your first hour of study', '⏰', 'Study for 1 hour', 'milestone', 10, 1, true),
('first-day', 'First Day', 'Complete your first day of study', '📅', 'Study for 1 day', 'milestone', 50, 2, true),
('first-week', 'First Week', 'Complete your first week of study', '📆', 'Study for 7 days', 'milestone', 100, 3, true),
('first-month', 'First Month', 'Complete your first month of study', '🗓️', 'Study for 30 days', 'milestone', 500, 4, true),
('first-leetcode', 'First LeetCode', 'Solve your first LeetCode problem', '💻', 'Solve 1 LeetCode problem', 'coding', 25, 5, true),
('leetcode-10', 'LeetCode Beginner', 'Solve 10 LeetCode problems', '🎯', 'Solve 10 LeetCode problems', 'coding', 100, 6, true),
('leetcode-50', 'LeetCode Intermediate', 'Solve 50 LeetCode problems', '🏆', 'Solve 50 LeetCode problems', 'coding', 250, 7, true),
('leetcode-100', 'LeetCode Advanced', 'Solve 100 LeetCode problems', '👑', 'Solve 100 LeetCode problems', 'coding', 500, 8, true),
('first-project', 'First Project', 'Complete your first project', '🚀', 'Complete 1 project', 'project', 200, 9, true),
('project-5', 'Project Builder', 'Complete 5 projects', '🏗️', 'Complete 5 projects', 'project', 500, 10, true),
('project-10', 'Project Master', 'Complete 10 projects', '🎨', 'Complete 10 projects', 'project', 1000, 11, true),
('streak-7', 'Week Warrior', 'Maintain a 7-day study streak', '🔥', 'Study for 7 consecutive days', 'streak', 150, 12, true),
('streak-30', 'Month Master', 'Maintain a 30-day study streak', '🔥🔥', 'Study for 30 consecutive days', 'streak', 500, 13, true),
('streak-100', 'Century Club', 'Maintain a 100-day study streak', '🔥🔥🔥', 'Study for 100 consecutive days', 'streak', 1000, 14, true),
('hours-10', 'Dedicated Learner', 'Study for 10 hours', '📚', 'Study for 10 hours', 'time', 100, 15, true),
('hours-50', 'Serious Student', 'Study for 50 hours', '📖', 'Study for 50 hours', 'time', 250, 16, true),
('hours-100', 'Knowledge Seeker', 'Study for 100 hours', '🎓', 'Study for 100 hours', 'time', 500, 17, true),
('hours-500', 'Learning Legend', 'Study for 500 hours', '🧠', 'Study for 500 hours', 'time', 1000, 18, true),
('phase-1', 'Foundation Complete', 'Complete the Foundation phase', '🏁', 'Complete 1 phase', 'phase', 200, 19, true),
('phase-3', 'Halfway There', 'Complete 3 phases', '🎯', 'Complete 3 phases', 'phase', 500, 20, true),
('phase-6', 'Roadmap Complete', 'Complete all phases', '🏆', 'Complete all phases', 'phase', 1000, 21, true),
('roadmap-complete', 'Roadmap Master', 'Complete the entire development roadmap', '👑', 'Complete all phases, topics, and projects', 'milestone', 2000, 22, true),
('job-ready', 'Job Ready', 'Get your first developer job', '💼', 'Land your first developer job', 'milestone', 5000, 23, true),
('senior-developer', 'Senior Developer', 'Become a senior developer', '👑', 'Achieve senior developer status', 'milestone', 10000, 24, true);

-- Initialize user stats
INSERT INTO dev_roadmap_user_stats (total_hours, total_leetcode_solved, current_streak, longest_streak, total_points, total_achievements_unlocked, total_projects_completed, total_topics_completed, total_phases_completed) VALUES
(0, 0, 0, 0, 0, 0, 0, 0, 0);

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Show complete roadmap structure
SELECT 
    p.title as phase,
    p.order_index as phase_order,
    t.title as topic,
    t.order_index as topic_order,
    pr.title as project,
    pr.order_index as project_order
FROM dev_roadmap_phases p
LEFT JOIN dev_roadmap_topics t ON p.id = t.phase_id
LEFT JOIN dev_roadmap_projects pr ON p.id = pr.phase_id
ORDER BY p.order_index, t.order_index, pr.order_index;

-- Show data counts
SELECT 'Phases' as table_name, COUNT(*) as count FROM dev_roadmap_phases
UNION ALL
SELECT 'Topics' as table_name, COUNT(*) as count FROM dev_roadmap_topics
UNION ALL
SELECT 'Projects' as table_name, COUNT(*) as count FROM dev_roadmap_projects
UNION ALL
SELECT 'Resources' as table_name, COUNT(*) as count FROM dev_roadmap_resources
UNION ALL
SELECT 'Achievements' as table_name, COUNT(*) as count FROM dev_roadmap_achievements
UNION ALL
SELECT 'User Stats' as table_name, COUNT(*) as count FROM dev_roadmap_user_stats;
