from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
import json
from datetime import datetime
from ai_service import get_ai_service
import asyncio

DB_PATH = os.path.join(os.path.dirname(__file__), 'data.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def dict_from_row(row):
    """Convert sqlite3.Row to dict"""
    return dict(zip(row.keys(), row)) if row else None

app = Flask(__name__)
CORS(app)

def parse_bearer_lin(auth_header: str):
    """Parse Authorization: Bearer tok-<lin>-<timestamp> and return lin if valid."""
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ', 1)[1].strip()
    if not token.startswith('tok-'):
        return None
    try:
        payload = token[4:]
        lin, _ts = payload.rsplit('-', 1)
        return lin
    except Exception:
        return None

def require_auth(f):
    """Decorator to require authentication"""
    def decorated(*args, **kwargs):
        auth_lin = parse_bearer_lin(request.headers.get('Authorization', ''))
        if not auth_lin:
            return jsonify({'error': 'unauthorized'}), 401
        return f(auth_lin, *args, **kwargs)
    decorated.__name__ = f.__name__
    return decorated

# ==================== AUTH ENDPOINTS ====================

@app.route('/api/v1/auth/register', methods=['POST'])
def register():
    data = request.json or {}
    role = data.get('role', 'student')
    name = data.get('name')
    secret = data.get('secret')
    method = data.get('method', 'pin')
    email = data.get('email')
    school_id = data.get('schoolId')
    
    # Role specific IDs
    lin = data.get('lin') # For students
    tmis = data.get('tmis') # For teachers
    nin = data.get('nin') # For teachers
    
    if not name or not secret:
        return jsonify({'error':'missing name or secret'}), 400

    primary_id = None
    if role == 'student':
        if not lin: return jsonify({'error': 'LIN required for students'}), 400
        primary_id = lin
    elif role == 'teacher':
        if not tmis: return jsonify({'error': 'TMIS number required for teachers'}), 400
        if not nin: return jsonify({'error': 'NIN required for teachers'}), 400
        if not school_id: return jsonify({'error': 'School required for teachers'}), 400
        # In a real app, verify NIN matches TMIS here via external API
        primary_id = tmis # Use TMIS as the local ID reference 
    elif role == 'admin' or role == 'school_admin':
         # Admins use email or a specific ID
         if not email: return jsonify({'error': 'Email required for admins'}), 400
         primary_id = email 
         # Reuse LIN column for email/admin-id storage if consistent with schema, 
         # OR ensure we insert into the right column. 
         # For simplicity in this schema: LIN column holds the detailed "Login ID"
         lin = email 

    
    conn = get_db()
    cur = conn.cursor()
    try:
        ph = generate_password_hash(secret)
        is_verified = 1 if role == 'student' else 0  # Students auto-verify? Or maybe not. Let's keep existing logic.
        
        # Check duplicates
        if role == 'teacher':
             cur.execute('SELECT id FROM users WHERE tmis_number=? OR nin=?', (tmis, nin))
             if cur.fetchone():
                 return jsonify({'error': 'TMIS or NIN already registered'}), 400
        elif role == 'student':
             cur.execute('SELECT id FROM users WHERE lin=?', (lin,))
             if cur.fetchone():
                 return jsonify({'error': 'LIN already registered'}), 400

        cur.execute('''INSERT INTO users 
            (lin, tmis_number, nin, name, email, role, school_id, method, password_hash, is_verified, created_at) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?)''',
            (lin, tmis, nin, name, email, role, school_id, method, ph, is_verified, datetime.utcnow().isoformat()))
        conn.commit()
        
        return jsonify({'id': primary_id, 'name': name, 'role': role}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    role = data.get('role', 'student') # Login should specify intent/role to derive ID type
    
    # We expect 'id' field which could be lin, tmis, or email depending on role
    login_id = data.get('id') 
    secret = data.get('secret')
    
    if not login_id or not secret:
        return jsonify({'error':'missing login id or secret'}), 400
    
    conn = get_db()
    cur = conn.cursor()
    
    if role == 'teacher':
        cur.execute('SELECT * FROM users WHERE tmis_number=? AND role=?', (login_id, role))
    elif role == 'student':
        cur.execute('SELECT * FROM users WHERE lin=? AND role=?', (login_id, role))
    else:
        # Admins
        cur.execute('SELECT * FROM users WHERE (lin=? OR email=?) AND role=?', (login_id, login_id, role))

    row = cur.fetchone()
    
    if not row:
        conn.close()
        return jsonify({'error':'user not found'}), 404
    
    if not check_password_hash(row['password_hash'], secret):
        conn.close()
        return jsonify({'error':'invalid credentials'}), 401
        
    if not row['is_verified']:
        conn.close()
        return jsonify({'error':'account pending verification'}), 403
    
    # Update last login
    user_key = row['lin'] if row['lin'] else row['tmis_number'] # Unique key for session
    
    cur.execute('UPDATE users SET last_login=? WHERE id=?', 
                (datetime.utcnow().isoformat(), row['id']))
    conn.commit()
    conn.close()
    
    return jsonify({
        'lin': row['lin'], # Legacy field name for client compatibility or update client
        'tmis': row['tmis_number'],
        'userId': user_key, # Generic ID for client
        'name': row['name'],
        'role': row['role'],
        'email': row['email'],
        'schoolId': row['school_id'],
        'session_token': f"tok-{user_key}-{int(datetime.utcnow().timestamp())}"
    })

# ==================== SCHOOL MANAGEMENT ====================

@app.route('/api/v1/schools', methods=['GET'])
@require_auth
def get_schools(auth_lin):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM schools ORDER BY name')
    schools = [dict_from_row(row) for row in cur.fetchall()]
    conn.close()
    return jsonify({'schools': schools})

@app.route('/api/v1/schools', methods=['POST'])
@require_auth
def create_school(auth_lin):
    # Check if user is admin
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT role FROM users WHERE lin=?', (auth_lin,))
    user = cur.fetchone()
    
    if not user or user['role'] != 'admin':
        conn.close()
        return jsonify({'error': 'admin access required'}), 403
    
    data = request.json or {}
    cur.execute('''INSERT INTO schools 
        (name, district, address, phone, email, license_type, max_students, max_teachers, created_at) 
        VALUES (?,?,?,?,?,?,?,?,?)''',
        (data.get('name'), data.get('district'), data.get('address'), 
         data.get('phone'), data.get('email'), data.get('license_type', 'standard'),
         data.get('max_students', 500), data.get('max_teachers', 50),
         datetime.utcnow().isoformat()))
    conn.commit()
    school_id = cur.lastrowid
    conn.close()
    
    return jsonify({'id': school_id, 'message': 'school created'}), 201

@app.route('/api/v1/schools/<int:school_id>', methods=['PUT'])
@require_auth
def update_school(auth_lin, school_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT role FROM users WHERE lin=?', (auth_lin,))
    user = cur.fetchone()
    
    if not user or user['role'] not in ['admin', 'school_admin']:
        conn.close()
        return jsonify({'error': 'insufficient permissions'}), 403
    
    data = request.json or {}
    updates = []
    values = []
    
    for field in ['name', 'district', 'address', 'phone', 'email', 'license_type', 'status']:
        if field in data:
            updates.append(f"{field}=?")
            values.append(data[field])
    
    if updates:
        values.append(datetime.utcnow().isoformat())
        values.append(school_id)
        cur.execute(f"UPDATE schools SET {', '.join(updates)}, updated_at=? WHERE id=?", values)
        conn.commit()
    
    conn.close()
    return jsonify({'message': 'school updated'})

@app.route('/api/v1/schools/<int:school_id>', methods=['DELETE'])
@require_auth
def delete_school(auth_lin, school_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT role FROM users WHERE lin=?', (auth_lin,))
    user = cur.fetchone()
    
    if not user or user['role'] != 'admin':
        conn.close()
        return jsonify({'error': 'admin access required'}), 403
    
    cur.execute('UPDATE schools SET status=? WHERE id=?', ('deleted', school_id))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'school deleted'})

# ==================== CLASS MANAGEMENT ====================

@app.route('/api/v1/classes', methods=['GET'])
@require_auth
def get_classes(auth_lin):
    school_id = request.args.get('school_id')
    
    conn = get_db()
    cur = conn.cursor()
    
    if school_id:
        cur.execute('SELECT * FROM classes WHERE school_id=? ORDER BY name', (school_id,))
    else:
        cur.execute('SELECT * FROM classes ORDER BY name')
    
    classes = [dict_from_row(row) for row in cur.fetchall()]
    conn.close()
    return jsonify({'classes': classes})

@app.route('/api/v1/classes', methods=['POST'])
@require_auth
def create_class(auth_lin):
    data = request.json or {}
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''INSERT INTO classes 
        (name, description, school_id, teacher_id, subject, year, max_students, created_at) 
        VALUES (?,?,?,?,?,?,?,?)''',
        (data.get('name'), data.get('description'), data.get('school_id'),
         data.get('teacher_id'), data.get('subject'), data.get('year'),
         data.get('max_students', 50), datetime.utcnow().isoformat()))
    conn.commit()
    class_id = cur.lastrowid
    conn.close()
    
    return jsonify({'id': class_id, 'message': 'class created'}), 201

# ==================== ASSIGNMENTS ====================

@app.route('/api/v1/assignments', methods=['GET'])
@require_auth
def get_assignments(auth_lin):
    class_id = request.args.get('class_id')
    
    conn = get_db()
    cur = conn.cursor()
    
    if class_id:
        cur.execute('SELECT * FROM assignments WHERE class_id=? ORDER BY created_at DESC', (class_id,))
    else:
        # Get assignments for teacher's classes
        cur.execute('''SELECT a.* FROM assignments a 
            JOIN classes c ON a.class_id = c.id 
            WHERE c.teacher_id = (SELECT id FROM users WHERE lin=?)
            ORDER BY a.created_at DESC''', (auth_lin,))
    
    assignments = [dict_from_row(row) for row in cur.fetchall()]
    conn.close()
    return jsonify({'assignments': assignments})

@app.route('/api/v1/assignments', methods=['POST'])
@require_auth
def create_assignment(auth_lin):
    data = request.json or {}
    
    conn = get_db()
    cur = conn.cursor()
    
    # Get teacher ID
    cur.execute('SELECT id FROM users WHERE lin=?', (auth_lin,))
    user = cur.fetchone()
    
    cur.execute('''INSERT INTO assignments 
        (title, description, class_id, teacher_id, subject, due_date, max_score, created_at) 
        VALUES (?,?,?,?,?,?,?,?)''',
        (data.get('title'), data.get('description'), data.get('class_id'),
         user['id'], data.get('subject'), data.get('due_date'),
         data.get('max_score', 100), datetime.utcnow().isoformat()))
    conn.commit()
    assignment_id = cur.lastrowid
    conn.close()
    
    return jsonify({'id': assignment_id, 'message': 'assignment created'}), 201

# ==================== PROGRESS TRACKING ====================

@app.route('/api/v1/progress', methods=['GET'])
@require_auth
def get_progress(auth_lin):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM progress WHERE lin=? ORDER BY last_accessed DESC', (auth_lin,))
    progress = [dict_from_row(row) for row in cur.fetchall()]
    conn.close()
    return jsonify({'progress': progress})

@app.route('/api/v1/progress', methods=['POST'])
@require_auth
def update_progress(auth_lin):
    data = request.json or {}
    lesson_id = data.get('lesson_id')
    
    if not lesson_id:
        return jsonify({'error': 'lesson_id required'}), 400
    
    conn = get_db()
    cur = conn.cursor()
    
    # Upsert progress
    cur.execute('''INSERT INTO progress (lin, lesson_id, subject, completed, score, time_spent, last_accessed, created_at)
        VALUES (?,?,?,?,?,?,?,?)
        ON CONFLICT(lin, lesson_id) DO UPDATE SET
        completed=excluded.completed,
        score=excluded.score,
        time_spent=time_spent + excluded.time_spent,
        last_accessed=excluded.last_accessed''',
        (auth_lin, lesson_id, data.get('subject'), data.get('completed', 0),
         data.get('score'), data.get('time_spent', 0),
         datetime.utcnow().isoformat(), datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'progress updated'})

# ==================== AI CHAT ====================

@app.route('/api/v1/ai/chat', methods=['POST'])
@require_auth
def ai_chat(auth_lin):
    data = request.json or {}
    messages = data.get('messages', [])
    context = data.get('context', {})
    session_id = data.get('session_id', f"session-{auth_lin}-{int(datetime.utcnow().timestamp())}")
    
    if not messages:
        return jsonify({'error': 'messages required'}), 400
    
    # Get AI response
    ai_service = get_ai_service()
    
    # Run async function in sync context
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    response = loop.run_until_complete(ai_service.chat(messages, context))
    loop.close()
    
    # Save conversation
    conn = get_db()
    cur = conn.cursor()
    
    # Save user message
    last_user_msg = messages[-1] if messages else {}
    cur.execute('''INSERT INTO ai_conversations (lin, session_id, role, content, context, created_at)
        VALUES (?,?,?,?,?,?)''',
        (auth_lin, session_id, 'user', last_user_msg.get('content', ''),
         json.dumps(context), datetime.utcnow().isoformat()))
    
    # Save assistant response
    cur.execute('''INSERT INTO ai_conversations (lin, session_id, role, content, context, created_at)
        VALUES (?,?,?,?,?,?)''',
        (auth_lin, session_id, 'assistant', response,
         json.dumps(context), datetime.utcnow().isoformat()))
    
    conn.commit()
    conn.close()
    
    return jsonify({'response': response, 'session_id': session_id})

@app.route('/api/v1/ai/history/<session_id>', methods=['GET'])
@require_auth
def ai_history(auth_lin, session_id):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''SELECT role, content, created_at FROM ai_conversations 
        WHERE lin=? AND session_id=? ORDER BY created_at''', 
        (auth_lin, session_id))
    history = [dict_from_row(row) for row in cur.fetchall()]
    conn.close()
    return jsonify({'history': history})

# ==================== BOOKMARKS & NOTES ====================

@app.route('/api/v1/bookmarks', methods=['GET'])
@require_auth
def get_bookmarks(auth_lin):
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM bookmarks WHERE lin=? ORDER BY created_at DESC', (auth_lin,))
    bookmarks = [dict_from_row(row) for row in cur.fetchall()]
    conn.close()
    return jsonify({'bookmarks': bookmarks})

@app.route('/api/v1/bookmarks', methods=['POST'])
@require_auth
def create_bookmark(auth_lin):
    data = request.json or {}
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''INSERT INTO bookmarks (lin, lesson_id, section_id, note, created_at)
        VALUES (?,?,?,?,?)
        ON CONFLICT(lin, lesson_id, section_id) DO UPDATE SET note=excluded.note''',
        (auth_lin, data.get('lesson_id'), data.get('section_id'),
         data.get('note'), datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'bookmark saved'})

@app.route('/api/v1/notes', methods=['GET'])
@require_auth
def get_notes(auth_lin):
    lesson_id = request.args.get('lesson_id')
    
    conn = get_db()
    cur = conn.cursor()
    
    if lesson_id:
        cur.execute('SELECT * FROM notes WHERE lin=? AND lesson_id=? ORDER BY created_at DESC', 
                   (auth_lin, lesson_id))
    else:
        cur.execute('SELECT * FROM notes WHERE lin=? ORDER BY created_at DESC', (auth_lin,))
    
    notes = [dict_from_row(row) for row in cur.fetchall()]
    conn.close()
    return jsonify({'notes': notes})

@app.route('/api/v1/notes', methods=['POST'])
@require_auth
def create_note(auth_lin):
    data = request.json or {}
    
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''INSERT INTO notes (lin, lesson_id, section_id, content, created_at)
        VALUES (?,?,?,?,?)''',
        (auth_lin, data.get('lesson_id'), data.get('section_id'),
         data.get('content'), datetime.utcnow().isoformat()))
    conn.commit()
    note_id = cur.lastrowid
    conn.close()
    
    return jsonify({'id': note_id, 'message': 'note created'})

# ==================== SYNC ====================

@app.route('/api/v1/sync/upload', methods=['POST'])
@require_auth
def sync_upload(auth_lin):
    data = request.json or {}
    queue = data.get('queue', [])
    
    if not isinstance(queue, list):
        return jsonify({'error':'queue must be a list'}), 400
    
    conn = get_db()
    cur = conn.cursor()
    results = []
    
    for item in queue:
        client_id = item.get('client_id')
        record_type = item.get('type')
        payload = item.get('payload')
        created_at = item.get('created_at') or datetime.utcnow().isoformat()
        
        # Verify LIN matches
        try:
            if isinstance(payload, dict):
                rec_lin = payload.get('lin')
                if rec_lin and rec_lin != auth_lin:
                    conn.close()
                    return jsonify({'error': 'lin mismatch', 'client_id': client_id}), 403
        except Exception:
            pass
        
        cur.execute('''INSERT INTO sync_queue 
            (client_id, record_type, payload, created_at, uploaded) 
            VALUES (?,?,?,?,1)''',
            (client_id, record_type, json.dumps(payload, ensure_ascii=False), created_at))
        results.append({'client_id': client_id, 'status': 'ok'})
    
    conn.commit()
    conn.close()
    
    return jsonify({'results': results}), 200

# ==================== RECOMMENDATIONS ====================

@app.route('/api/v1/recommendations/<lin>', methods=['GET'])
def recommendations(lin):
    conn = get_db()
    cur = conn.cursor()
    
    # 1. Get recent activity
    cur.execute('SELECT * FROM progress WHERE lin=? ORDER BY last_accessed DESC LIMIT 5', (lin,))
    recent = cur.fetchall()
    
    recs = []
    
    # Logic: if last lesson not completed, suggest finishing it
    if recent and recent[0]['completed'] < 100:
        last = recent[0]
        recs.append({
            'type': 'lesson',
            'itemId': last['lesson_id'],
            'reason': f"Continue {last['subject']} where you left off",
            'priority': 'high',
            'estimatedTime': 15
        })
    
    # Logic: Suggest next lesson in sequence (Mock sequence for now)
    # In a real app, we'd look up the curriculum order
    recs.append({
        'type': 'practice',
        'itemId': 'quiz-daily',
        'reason': 'Daily practice to keep your streak',
        'priority': 'medium',
        'estimatedTime': 10
    })
    
    conn.close()
    
    return jsonify({'lin': lin, 'recommendations': recs})

if __name__ == '__main__':
    # Initialize database before starting
    from scripts.init_db import init_database
    init_database()
    
    app.run(host='0.0.0.0', port=5000, debug=True)
