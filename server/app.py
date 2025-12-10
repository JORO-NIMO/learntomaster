from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import os
import json
from datetime import datetime
from .ai_service import get_ai_service
import asyncio
import jwt
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Supabase Configuration
SUPABASE_URL = os.getenv('SUPABASE_URL', '')
SUPABASE_JWT_SECRET = os.getenv('SUPABASE_JWT_SECRET', '')

def dict_from_row(row, cursor_description=None):
    """Convert SQLAlchemy row or raw cursor row to dict"""
    if hasattr(row, '_mapping'):
        return dict(row._mapping)
    if hasattr(row, 'keys'):
        return dict(zip(row.keys(), row))
    return dict(row)

def verify_supabase_jwt(token: str):
    """Verify Supabase JWT token and extract user data"""
    try:
        if not SUPABASE_JWT_SECRET:
            app.logger.error('SUPABASE_JWT_SECRET not configured')
            return None
        
        # Decode and verify JWT
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=['HS256'],
            options={'verify_aud': False}  # Supabase doesn't always set aud
        )
        
        # Extract user ID from payload
        user_id = payload.get('sub')
        if not user_id:
            app.logger.error('No user ID in JWT payload')
            return None
        
        app.logger.info(f'JWT verified for user: {user_id}')
        return {
            'user_id': user_id,
            'email': payload.get('email'),
            'role': payload.get('role', 'authenticated'),
            'payload': payload
        }
    except jwt.ExpiredSignatureError:
        app.logger.error('JWT token expired')
        return None
    except jwt.InvalidTokenError as e:
        app.logger.error(f'Invalid JWT token: {str(e)}')
        return None
    except Exception as e:
        app.logger.error(f'JWT verification error: {str(e)}')
        return None

def require_auth(f):
    """Decorator to require valid Supabase JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid authorization header'}), 401
        
        token = auth_header.split(' ', 1)[1].strip()
        user_data = verify_supabase_jwt(token)
        
        if not user_data:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Pass user_data to the decorated function
        return f(user_data, *args, **kwargs)
    
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
    
    lin = data.get('lin')
    tmis = data.get('tmis')
    nin = data.get('nin')
    
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
        primary_id = tmis 
    elif role == 'admin' or role == 'school_admin':
         if not email: return jsonify({'error': 'Email required for admins'}), 400
         primary_id = email 
         lin = email 

    try:
        ph = generate_password_hash(secret)
        is_verified = 1 if role == 'student' else 0
        
        if role == 'teacher':
             res = db.session.execute(text('SELECT id FROM users WHERE tmis_number=:tmis OR nin=:nin'), {'tmis': tmis, 'nin': nin}).fetchone()
             if res:
                 return jsonify({'error': 'TMIS or NIN already registered'}), 400
        elif role == 'student':
             res = db.session.execute(text('SELECT id FROM users WHERE lin=:lin'), {'lin': lin}).fetchone()
             if res:
                 return jsonify({'error': 'LIN already registered'}), 400

        db.session.execute(text('''INSERT INTO users 
            (lin, tmis_number, nin, name, email, role, school_id, method, password_hash, is_verified, created_at) 
            VALUES (:lin, :tmis, :nin, :name, :email, :role, :school_id, :method, :ph, :is_verified, :created_at)'''),
            {
                'lin': lin, 'tmis': tmis, 'nin': nin, 'name': name, 'email': email, 'role': role,
                'school_id': school_id, 'method': method, 'ph': ph, 'is_verified': is_verified,
                'created_at': datetime.utcnow()
            })
        db.session.commit()
        
        return jsonify({'id': primary_id, 'name': name, 'role': role}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    role = data.get('role', 'student')
    login_id = data.get('id') 
    secret = data.get('secret')
    
    if not login_id or not secret:
        return jsonify({'error':'missing login id or secret'}), 400
    
    query = ""
    params = {'login_id': login_id, 'role': role}

    if role == 'teacher':
        query = 'SELECT * FROM users WHERE tmis_number=:login_id AND role=:role'
    elif role == 'student':
        query = 'SELECT * FROM users WHERE lin=:login_id AND role=:role'
    else:
        query = 'SELECT * FROM users WHERE (lin=:login_id OR email=:login_id) AND role=:role'
        
    row = db.session.execute(text(query), params).fetchone()
    
    if not row:
        return jsonify({'error':'user not found'}), 404
    
    user_data = dict_from_row(row)
    
    if not check_password_hash(user_data['password_hash'], secret):
        return jsonify({'error':'invalid credentials'}), 401
        
    if not user_data['is_verified']:
        return jsonify({'error':'account pending verification'}), 403
    
    user_key = user_data['lin'] if user_data['lin'] else user_data['tmis_number']
    
    db.session.execute(text('UPDATE users SET last_login=:last_login WHERE id=:id'), 
                {'last_login': datetime.utcnow(), 'id': user_data['id']})
    db.session.commit()
    
    return jsonify({
        'lin': user_data['lin'],
        'tmis': user_data['tmis_number'],
        'userId': user_key,
        'name': user_data['name'],
        'role': user_data['role'],
        'email': user_data['email'],
        'schoolId': user_data['school_id'],
        'session_token': f"tok-{user_key}-{int(datetime.utcnow().timestamp())}"
    })

# ==================== SCHOOL MANAGEMENT ====================

@app.route('/api/v1/schools', methods=['GET'])
@require_auth
def get_schools(auth_lin):
    res = db.session.execute(text('SELECT * FROM schools ORDER BY name'))
    schools = [dict_from_row(row) for row in res.fetchall()]
    return jsonify({'schools': schools})

@app.route('/api/v1/schools', methods=['POST'])
@require_auth
def create_school(auth_lin):
    user_res = db.session.execute(text('SELECT role FROM users WHERE lin=:lin'), {'lin': auth_lin}).fetchone()
    if not user_res or user_res[0] != 'admin':
        return jsonify({'error': 'admin access required'}), 403
    
    data = request.json or {}
    db.session.execute(text('''INSERT INTO schools 
        (name, district, address, phone, email, license_type, max_students, max_teachers, created_at) 
        VALUES (:name, :district, :address, :phone, :email, :license_type, :max_students, :max_teachers, :created_at)'''),
        {
            'name': data.get('name'), 'district': data.get('district'), 'address': data.get('address'),
            'phone': data.get('phone'), 'email': data.get('email'), 
            'license_type': data.get('license_type', 'standard'),
            'max_students': data.get('max_students', 500), 
            'max_teachers': data.get('max_teachers', 50),
            'created_at': datetime.utcnow()
        })
    db.session.commit()
    school_id = db.session.execute(text("SELECT MAX(id) FROM schools")).scalar()
    return jsonify({'id': school_id, 'message': 'school created'}), 201

@app.route('/api/v1/schools/<int:school_id>', methods=['PUT'])
@require_auth
def update_school(auth_lin, school_id):
    user_res = db.session.execute(text('SELECT role FROM users WHERE lin=:lin'), {'lin': auth_lin}).fetchone()
    if not user_res or user_res[0] not in ['admin', 'school_admin']:
        return jsonify({'error': 'insufficient permissions'}), 403
    
    data = request.json or {}
    updates = []
    values = {'id': school_id, 'updated_at': datetime.utcnow()}
    
    for field in ['name', 'district', 'address', 'phone', 'email', 'license_type', 'status']:
        if field in data:
            updates.append(f"{field}=:{field}")
            values[field] = data[field]
    
    if updates:
        db.session.execute(text(f"UPDATE schools SET {', '.join(updates)}, updated_at=:updated_at WHERE id=:id"), values)
        db.session.commit()
    
    return jsonify({'message': 'school updated'})

@app.route('/api/v1/schools/<int:school_id>', methods=['DELETE'])
@require_auth
def delete_school(auth_lin, school_id):
    user_res = db.session.execute(text('SELECT role FROM users WHERE lin=:lin'), {'lin': auth_lin}).fetchone()
    if not user_res or user_res[0] != 'admin':
        return jsonify({'error': 'admin access required'}), 403
    
    db.session.execute(text("UPDATE schools SET status='deleted' WHERE id=:id"), {'id': school_id})
    db.session.commit()
    return jsonify({'message': 'school deleted'})

# ==================== CLASS MANAGEMENT ====================

@app.route('/api/v1/classes', methods=['GET'])
@require_auth
def get_classes(auth_lin):
    school_id = request.args.get('school_id')
    if school_id:
        res = db.session.execute(text('SELECT * FROM classes WHERE school_id=:sid ORDER BY name'), {'sid': school_id})
    else:
        res = db.session.execute(text('SELECT * FROM classes ORDER BY name'))
    classes = [dict_from_row(row) for row in res.fetchall()]
    return jsonify({'classes': classes})

@app.route('/api/v1/classes', methods=['POST'])
@require_auth
def create_class(auth_lin):
    data = request.json or {}
    db.session.execute(text('''INSERT INTO classes 
        (name, description, school_id, teacher_id, subject, year, max_students, created_at) 
        VALUES (:name, :desc, :sid, :tid, :subj, :year, :max_stud, :created_at)'''),
        {
            'name': data.get('name'), 'desc': data.get('description'), 
            'sid': data.get('school_id'), 'tid': data.get('teacher_id'),
            'subj': data.get('subject'), 'year': data.get('year'),
            'max_stud': data.get('max_students', 50),
            'created_at': datetime.utcnow()
        })
    db.session.commit()
    class_id = db.session.execute(text("SELECT MAX(id) FROM classes")).scalar()
    return jsonify({'id': class_id, 'message': 'class created'}), 201

# ==================== ASSIGNMENTS ====================

@app.route('/api/v1/assignments', methods=['GET'])
@require_auth
def get_assignments(auth_lin):
    class_id = request.args.get('class_id')
    if class_id:
        res = db.session.execute(text('SELECT * FROM assignments WHERE class_id=:cid ORDER BY created_at DESC'), {'cid': class_id})
    else:
        res = db.session.execute(text('''SELECT a.* FROM assignments a 
            JOIN classes c ON a.class_id = c.id 
            WHERE c.teacher_id = (SELECT id FROM users WHERE lin=:lin)
            ORDER BY a.created_at DESC'''), {'lin': auth_lin})
    
    assignments = [dict_from_row(row) for row in res.fetchall()]
    return jsonify({'assignments': assignments})

@app.route('/api/v1/assignments', methods=['POST'])
@require_auth
def create_assignment(auth_lin):
    data = request.json or {}
    user_res = db.session.execute(text('SELECT id FROM users WHERE lin=:lin'), {'lin': auth_lin}).fetchone()
    user_id = user_res[0] if user_res else None
    
    db.session.execute(text('''INSERT INTO assignments 
        (title, description, class_id, teacher_id, subject, due_date, max_score, created_at) 
        VALUES (:title, :desc, :cid, :tid, :subj, :due, :max, :created_at)'''),
        {
            'title': data.get('title'), 'desc': data.get('description'), 
            'cid': data.get('class_id'), 'tid': user_id,
            'subj': data.get('subject'), 'due': data.get('due_date'),
            'max': data.get('max_score', 100), 'created_at': datetime.utcnow()
        })
    db.session.commit()
    assignment_id = db.session.execute(text("SELECT MAX(id) FROM assignments")).scalar()
    return jsonify({'id': assignment_id, 'message': 'assignment created'}), 201

# ==================== PROGRESS TRACKING ====================

@app.route('/api/v1/progress', methods=['GET'])
@require_auth
def get_progress(auth_lin):
    res = db.session.execute(text('SELECT * FROM progress WHERE lin=:lin ORDER BY last_accessed DESC'), {'lin': auth_lin})
    progress = [dict_from_row(row) for row in res.fetchall()]
    return jsonify({'progress': progress})

@app.route('/api/v1/progress', methods=['POST'])
@require_auth
def update_progress(auth_lin):
    data = request.json or {}
    lesson_id = data.get('lesson_id')
    if not lesson_id:
        return jsonify({'error': 'lesson_id required'}), 400
    
    # Postgres ON CONFLICT syntax vs SQLite ON CONFLICT
    # SQLAlchemy abstracting this with 'merge' or 'upsert' can be tricky with raw SQL.
    # However, standard ON CONFLICT (col) DO UPDATE works in both SQLite (recent) and Postgres.
    # We must ensure the unique constraint exists. Schema has UNIQUE(lin, lesson_id).
    
    db.session.execute(text('''INSERT INTO progress (lin, lesson_id, subject, completed, score, time_spent, last_accessed, created_at)
        VALUES (:lin, :lid, :subj, :comp, :score, :time, :last, :curr)
        ON CONFLICT(lin, lesson_id) DO UPDATE SET
        completed=excluded.completed,
        score=excluded.score,
        time_spent=progress.time_spent + excluded.time_spent,
        last_accessed=excluded.last_accessed'''),
        {
            'lin': auth_lin, 'lid': lesson_id, 'subj': data.get('subject'),
            'comp': data.get('completed', 0), 'score': data.get('score'),
            'time': data.get('time_spent', 0), 'last': datetime.utcnow(),
            'curr': datetime.utcnow()
        })
    db.session.commit()
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
    
    ai_service = get_ai_service()
    
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    response = loop.run_until_complete(ai_service.chat(messages, context))
    loop.close()
    
    last_user_msg = messages[-1] if messages else {}
    common_params = {'lin': auth_lin, 'sid': session_id, 'ctx': json.dumps(context), 'created_at': datetime.utcnow()}
    
    db.session.execute(text('''INSERT INTO ai_conversations (lin, session_id, role, content, context, created_at)
        VALUES (:lin, :sid, 'user', :content, :ctx, :created_at)'''),
        {**common_params, 'content': last_user_msg.get('content', '')})
        
    db.session.execute(text('''INSERT INTO ai_conversations (lin, session_id, role, content, context, created_at)
        VALUES (:lin, :sid, 'assistant', :content, :ctx, :created_at)'''),
        {**common_params, 'content': response})
    
    db.session.commit()
    return jsonify({'response': response, 'session_id': session_id})

@app.route('/api/v1/ai/history/<session_id>', methods=['GET'])
@require_auth
def ai_history(auth_lin, session_id):
    res = db.session.execute(text('SELECT role, content, created_at FROM ai_conversations WHERE lin=:lin AND session_id=:sid ORDER BY created_at'),
        {'lin': auth_lin, 'sid': session_id})
    history = [dict_from_row(row) for row in res.fetchall()]
    return jsonify({'history': history})

# ==================== BOOKMARKS & NOTES ====================

@app.route('/api/v1/bookmarks', methods=['GET'])
@require_auth
def get_bookmarks(auth_lin):
    res = db.session.execute(text('SELECT * FROM bookmarks WHERE lin=:lin ORDER BY created_at DESC'), {'lin': auth_lin})
    bookmarks = [dict_from_row(row) for row in res.fetchall()]
    return jsonify({'bookmarks': bookmarks})

@app.route('/api/v1/bookmarks', methods=['POST'])
@require_auth
def create_bookmark(auth_lin):
    data = request.json or {}
    db.session.execute(text('''INSERT INTO bookmarks (lin, lesson_id, section_id, note, created_at)
        VALUES (:lin, :lid, :sid, :note, :created_at)
        ON CONFLICT(lin, lesson_id, section_id) DO UPDATE SET note=excluded.note'''),
        {
            'lin': auth_lin, 'lid': data.get('lesson_id'),
            'sid': data.get('section_id'), 'note': data.get('note'),
            'created_at': datetime.utcnow()
        })
    db.session.commit()
    return jsonify({'message': 'bookmark saved'})

@app.route('/api/v1/notes', methods=['GET'])
@require_auth
def get_notes(auth_lin):
    lesson_id = request.args.get('lesson_id')
    if lesson_id:
        res = db.session.execute(text('SELECT * FROM notes WHERE lin=:lin AND lesson_id=:lid ORDER BY created_at DESC'),
            {'lin': auth_lin, 'lid': lesson_id})
    else:
        res = db.session.execute(text('SELECT * FROM notes WHERE lin=:lin ORDER BY created_at DESC'), {'lin': auth_lin})
    
    notes = [dict_from_row(row) for row in res.fetchall()]
    return jsonify({'notes': notes})

@app.route('/api/v1/notes', methods=['POST'])
@require_auth
def create_note(auth_lin):
    data = request.json or {}
    db.session.execute(text('''INSERT INTO notes (lin, lesson_id, section_id, content, created_at)
        VALUES (:lin, :lid, :sid, :content, :created_at)'''),
        {
            'lin': auth_lin, 'lid': data.get('lesson_id'),
            'sid': data.get('section_id'), 'content': data.get('content'),
            'created_at': datetime.utcnow()
        })
    db.session.commit()
    note_id = db.session.execute(text("SELECT MAX(id) FROM notes")).scalar()
    return jsonify({'id': note_id, 'message': 'note created'})

# ==================== SYNC ====================

@app.route('/api/v1/sync/upload', methods=['POST'])
@require_auth
def sync_upload(auth_lin):
    data = request.json or {}
    queue = data.get('queue', [])
    if not isinstance(queue, list):
        return jsonify({'error':'queue must be a list'}), 400
    
    results = []
    
    for item in queue:
        client_id = item.get('client_id')
        record_type = item.get('type')
        payload = item.get('payload')
        created_at = item.get('created_at') or datetime.utcnow().isoformat() # Keep as string for now if payload is JSON
        
        # Validation
        try:
            if isinstance(payload, dict):
                rec_lin = payload.get('lin')
                if rec_lin and rec_lin != auth_lin:
                    return jsonify({'error': 'lin mismatch', 'client_id': client_id}), 403
        except:
            pass
            
        # JSON dumps for payload
        payload_json = json.dumps(payload, ensure_ascii=False)
        
        db.session.execute(text('''INSERT INTO sync_queue 
            (client_id, record_type, payload, created_at, uploaded) 
            VALUES (:cid, :rtype, :pay, :created_at, 1)'''),
            {
                'cid': client_id, 'rtype': record_type, 'pay': payload_json,
                'created_at': created_at
            })
        results.append({'client_id': client_id, 'status': 'ok'})
        
    db.session.commit()
    return jsonify({'results': results}), 200

# ==================== RECOMMENDATIONS ====================

@app.route('/api/v1/recommendations/<lin>', methods=['GET'])
def recommendations(lin):
    res = db.session.execute(text('SELECT * FROM progress WHERE lin=:lin ORDER BY last_accessed DESC LIMIT 5'), {'lin': lin})
    recent = [dict_from_row(row) for row in res.fetchall()]
    
    recs = []
    if recent and recent[0]['completed'] < 100:
        last = recent[0]
        recs.append({
            'type': 'lesson',
            'itemId': last['lesson_id'],
            'reason': f"Continue {last['subject']} where you left off",
            'priority': 'high',
            'estimatedTime': 15
        })
    
    recs.append({
        'type': 'practice',
        'itemId': 'quiz-daily',
        'reason': 'Daily practice to keep your streak',
        'priority': 'medium',
        'estimatedTime': 10
    })
    
    return jsonify({'lin': lin, 'recommendations': recs})

if __name__ == '__main__':
    # Initialize database if using SQLite and file doesn't exist
    if 'sqlite' in app.config['SQLALCHEMY_DATABASE_URI']:
        start_init = False
        if not os.path.exists(os.path.join(os.path.dirname(__file__), 'data.db')):
            start_init = True
            
        with app.app_context():
            if start_init:
                from scripts.init_db import init_database
                init_database()
                
    app.run(host='0.0.0.0', port=5000, debug=True)
