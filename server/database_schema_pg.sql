-- Learn2Master Database Schema (PostgreSQL/Supabase)

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    lin TEXT UNIQUE,
    tmis_number TEXT UNIQUE,
    nin TEXT,
    name TEXT NOT NULL,
    email TEXT,
    role TEXT NOT NULL, -- 'student', 'teacher', 'admin', 'school_admin'
    school_id INTEGER,
    method TEXT NOT NULL, -- 'pin', 'password'
    password_hash TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0,
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    license_type TEXT,
    max_students INTEGER DEFAULT 500,
    max_teachers INTEGER DEFAULT 50,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    teacher_id INTEGER NOT NULL REFERENCES users(id),
    subject TEXT,
    year TEXT,
    max_students INTEGER DEFAULT 50,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Student-Class enrollment
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id),
    class_id INTEGER NOT NULL REFERENCES classes(id),
    enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),
    status TEXT DEFAULT 'active',
    UNIQUE(student_id, class_id)
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    class_id INTEGER NOT NULL REFERENCES classes(id),
    teacher_id INTEGER NOT NULL REFERENCES users(id),
    subject TEXT,
    due_date TIMESTAMP,
    max_score INTEGER DEFAULT 100,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Assignment submissions
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL REFERENCES assignments(id),
    student_id INTEGER NOT NULL REFERENCES users(id),
    content TEXT,
    file_url TEXT,
    score INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    graded_at TIMESTAMP,
    status TEXT DEFAULT 'pending',
    UNIQUE(assignment_id, student_id)
);

-- Sync queue
CREATE TABLE IF NOT EXISTS sync_queue (
    id SERIAL PRIMARY KEY,
    client_id TEXT UNIQUE NOT NULL,
    record_type TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    uploaded INTEGER DEFAULT 0
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS progress (
    id SERIAL PRIMARY KEY,
    lin TEXT NOT NULL REFERENCES users(lin),
    lesson_id TEXT NOT NULL,
    subject TEXT,
    completed INTEGER DEFAULT 0,
    score INTEGER,
    time_spent INTEGER,
    last_accessed TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(lin, lesson_id)
);

-- AI conversation history
CREATE TABLE IF NOT EXISTS ai_conversations (
    id SERIAL PRIMARY KEY,
    lin TEXT NOT NULL REFERENCES users(lin),
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    context TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    lin TEXT NOT NULL REFERENCES users(lin),
    lesson_id TEXT NOT NULL,
    section_id TEXT,
    note TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(lin, lesson_id, section_id)
);

-- Notes
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    lin TEXT NOT NULL REFERENCES users(lin),
    lesson_id TEXT NOT NULL,
    section_id TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_lin ON users(lin);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_school ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class ON enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_lin ON progress(lin);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_session ON ai_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_lin ON bookmarks(lin);
CREATE INDEX IF NOT EXISTS idx_notes_lin ON notes(lin);

-- =============================================
-- CBC & AI ADAPTIVE LEARNING MODULES
-- =============================================

-- Competencies (CBC Learning Outcomes)
CREATE TABLE IF NOT EXISTS competencies (
    id SERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE, -- e.g., 'MTH-ALG-01'
    description TEXT NOT NULL,
    level TEXT NOT NULL, -- 'O-Level', 'A-Level'
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Learner Profiles (AI-generated)
CREATE TABLE IF NOT EXISTS learner_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    mastery_level JSONB DEFAULT '{}', -- { "MTH-ALG-01": 0.75, "PHY-MEC-02": 0.40 }
    learning_style TEXT, -- 'Visual', 'Auditory', 'Kinesthetic'
    strengths TEXT[],
    weaknesses TEXT[],
    last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Assessment Bank (AI-Generated or Teacher-Created)
CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    competency_id INTEGER REFERENCES competencies(id),
    question TEXT NOT NULL,
    type TEXT NOT NULL, -- 'mcq', 'short_answer', 'project'
    options JSONB, -- For MCQs
    correct_answer TEXT,
    difficulty_level INTEGER DEFAULT 1, -- 1-5
    created_by INTEGER REFERENCES users(id), -- Null if AI
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Assessment Results (Tracking Progress)
CREATE TABLE IF NOT EXISTS assessment_results (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id),
    assessment_id INTEGER NOT NULL REFERENCES assessments(id),
    score INTEGER NOT NULL, -- 0-100
    response TEXT,
    feedback TEXT, -- AI generated feedback
    taken_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Recommendations (AI Suggested Content)
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id),
    competency_id INTEGER REFERENCES competencies(id),
    title TEXT NOT NULL,
    content_type TEXT NOT NULL, -- 'video', 'summary', 'exercise', 'project'
    content_url TEXT,
    reason TEXT, -- Why this was recommended
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'dismissed'
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for CBC modules
CREATE INDEX IF NOT EXISTS idx_competencies_subject ON competencies(subject);
CREATE INDEX IF NOT EXISTS idx_learner_profiles_user ON learner_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_student ON assessment_results(student_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_student ON recommendations(student_id);
