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
