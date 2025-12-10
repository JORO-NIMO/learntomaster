-- Learn2Master Database Schema
-- Comprehensive schema for managing users, schools, classes, assignments, and AI interactions

-- Schools table
CREATE TABLE IF NOT EXISTS schools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    district TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    license_type TEXT, -- 'standard', 'premium', 'enterprise'
    max_students INTEGER DEFAULT 500,
    max_teachers INTEGER DEFAULT 50,
    status TEXT DEFAULT 'active', -- 'active', 'pending', 'suspended'
    created_at TEXT NOT NULL,
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lin TEXT UNIQUE, -- Used for Student LIN or Admin ID
    tmis_number TEXT UNIQUE, -- Used for Teachers
    nin TEXT, -- Required for teachers
    name TEXT NOT NULL,
    email TEXT,
    role TEXT NOT NULL, -- 'student', 'teacher', 'admin', 'school_admin'
    school_id INTEGER,
    method TEXT NOT NULL, -- 'pin', 'password'
    password_hash TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0,
    last_login TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (school_id) REFERENCES schools(id)
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, -- e.g., 'S5A', 'S6 Physics Advanced'
    description TEXT,
    school_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    subject TEXT, -- 'Mathematics', 'Physics', etc.
    year TEXT, -- 'S5', 'S6'
    max_students INTEGER DEFAULT 50,
    status TEXT DEFAULT 'active',
    created_at TEXT NOT NULL,
    FOREIGN KEY (school_id) REFERENCES schools(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);

-- Student-Class enrollment
CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    enrolled_at TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- 'active', 'dropped', 'completed'
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    UNIQUE(student_id, class_id)
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    class_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    subject TEXT,
    due_date TEXT,
    max_score INTEGER DEFAULT 100,
    status TEXT DEFAULT 'active', -- 'active', 'graded', 'closed'
    created_at TEXT NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);

-- Assignment submissions
CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    content TEXT,
    file_url TEXT,
    score INTEGER,
    feedback TEXT,
    submitted_at TEXT NOT NULL,
    graded_at TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'graded', 'late'
    FOREIGN KEY (assignment_id) REFERENCES assignments(id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    UNIQUE(assignment_id, student_id)
);

-- Sync queue (enhanced from existing)
CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id TEXT UNIQUE NOT NULL,
    record_type TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL,
    uploaded INTEGER DEFAULT 0
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lin TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    subject TEXT,
    completed INTEGER DEFAULT 0,
    score INTEGER,
    time_spent INTEGER, -- in seconds
    last_accessed TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (lin) REFERENCES users(lin),
    UNIQUE(lin, lesson_id)
);

-- AI conversation history
CREATE TABLE IF NOT EXISTS ai_conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lin TEXT NOT NULL,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL, -- 'user', 'assistant'
    content TEXT NOT NULL,
    context TEXT, -- JSON - current lesson, subject, etc.
    created_at TEXT NOT NULL,
    FOREIGN KEY (lin) REFERENCES users(lin)
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lin TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    section_id TEXT,
    note TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (lin) REFERENCES users(lin),
    UNIQUE(lin, lesson_id, section_id)
);

-- Notes
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lin TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    section_id TEXT,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (lin) REFERENCES users(lin)
);

-- Indexes for performance
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

-- Insert some sample data for testing
INSERT OR IGNORE INTO schools (id, name, district, email, license_type, created_at) VALUES
(1, 'Kampala High School', 'Kampala', 'admin@kampala high.ac.ug', 'premium', datetime('now')),
(2, 'St. Marys Secondary', 'Wakiso', 'info@stmarys.ac.ug', 'standard', datetime('now')),
(3, 'Mengo School', 'Kampala', 'contact@mengo.ac.ug', 'premium', datetime('now'));
