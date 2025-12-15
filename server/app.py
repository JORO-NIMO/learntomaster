from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import os
import sys
# Ensure server directory is in python path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import json
from datetime import datetime
from ai_service import get_ai_service
from adaptive_engine import AdaptiveLearningEngine
import asyncio
import jwt
import jwt
from functools import wraps
import pypdf
import io

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

# Explicit CORS allowlist for frontend origins (Render + local dev)
frontend_origins = [
    "https://learn2master.onrender.com",
    "https://learn2master-frontend.onrender.com",
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:8081",
    "http://localhost:3000",
]
# Allow auth headers for Supabase JWT and JSON payloads
CORS(
    app,
    resources={r"/*": {"origins": frontend_origins}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
)

# Explicit CORS headers to be safe across environments/proxies
@app.after_request
def add_cors_headers(response):
    origin = request.headers.get('Origin')
    if origin in frontend_origins:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Vary'] = 'Origin'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
    return response

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'status': 'online',
        'message': 'Learn2Master API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/v1/health',
            'auth': '/api/v1/auth',
            'ai': '/api/v1/ai'
        }
    })

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

def get_or_create_local_user(user_data):
    """Ensure Supabase user exists in local database for FK constraints"""
    user_id = user_data.get('user_id')
    if not user_id:
        return None
        
    try:
        # Check if user exists (using lin as the Supabase UUID)
        res = db.session.execute(text('SELECT id FROM users WHERE lin=:uid'), {'uid': user_id}).fetchone()
        if res:
            return res.id
            
        # Create user if not exists
        app.logger.info(f"Creating local shadow user for {user_id}")
        db.session.execute(text('''INSERT INTO users 
            (lin, name, email, role, method, password_hash, created_at) 
            VALUES (:lin, :name, :email, :role, 'supabase', 'managed_by_supabase', :now)'''),
            {
                'lin': user_id,
                'name': user_data.get('email', 'User').split('@')[0], # Fallback name
                'email': user_data.get('email'),
                'role': user_data.get('role', 'student'),
                'now': datetime.utcnow()
            })
        db.session.commit()
        
        # Get the new ID
        res = db.session.execute(text('SELECT id FROM users WHERE lin=:uid'), {'uid': user_id}).fetchone()
        return res.id if res else None
    except Exception as e:
        app.logger.error(f"Error syncing local user: {e}")
        db.session.rollback()
        return None

def require_auth(f):
    """Decorator to require valid Supabase JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        # Let CORS preflight pass without auth - return proper Response
        if request.method == 'OPTIONS':
            from flask import make_response
            response = make_response('', 204)
            origin = request.headers.get('Origin')
            if origin in frontend_origins:
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
                response.headers['Access-Control-Allow-Credentials'] = 'true'
            return response
        auth_header = request.headers.get('Authorization', '')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid authorization header'}), 401
        
        token = auth_header.split(' ', 1)[1].strip()
        user_data = verify_supabase_jwt(token)
        
        if not user_data:
            return jsonify({'error': 'Invalid or expired token'}), 401
            
        # Ensure user exists in local DB
        get_or_create_local_user(user_data)
        
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

@app.route('/api/v1/users/profile', methods=['PUT'])
@require_auth
def update_user_profile(user_data):
    """Update user profile details"""
    user_id = user_data.get('user_id')
    data = request.json or {}
    
    updates = []
    values = {'uid': user_id, 'now': datetime.utcnow()}
    
    # Allowed fields
    for field in ['name', 'email', 'phone', 'bio']:
        if field in data:
            updates.append(f"{field}=:{field}")
            values[field] = data[field]
            
    if not updates:
        return jsonify({'message': 'No changes provided'})
        
    # Add updated_at
    updates.append("updated_at=:now")
    
    try:
        # Check if columns exist (bio/phone might not be in schema yet, let's check schema)
        # Schema has: name, email. No phone or bio.
        # We should only update name and email for now.
        # Wait, let's check schema again.
        # users: id, lin, tmis, nin, name, email, role, school_id, method, password_hash, is_verified, last_login, created_at, updated_at
        
        valid_updates = []
        for field in ['name', 'email']:
            if field in data:
                valid_updates.append(f"{field}=:{field}")
                values[field] = data[field]
        
        if valid_updates:
            db.session.execute(text(f"UPDATE users SET {', '.join(valid_updates)}, updated_at=:now WHERE id=:uid"), values)
            db.session.commit()
            return jsonify({'message': 'Profile updated successfully'})
        else:
             return jsonify({'message': 'No valid fields to update'})
             
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
def get_progress(user_data):
    user_id = user_data.get('user_id')
    res = db.session.execute(text('SELECT * FROM progress WHERE lin=:lin ORDER BY last_accessed DESC'), {'lin': user_id})
    progress = [dict_from_row(row) for row in res.fetchall()]
    return jsonify({'progress': progress})

@app.route('/api/v1/progress', methods=['POST'])
@require_auth
def update_progress(user_data):
    user_id = user_data.get('user_id')
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
            'lin': user_id, 'lid': lesson_id, 'subj': data.get('subject'),
            'comp': data.get('completed', 0), 'score': data.get('score'),
            'time': data.get('time_spent', 0), 'last': datetime.utcnow(),
            'curr': datetime.utcnow()
        })
    db.session.commit()
    return jsonify({'message': 'progress updated'})

# ==================== AI CHAT ====================

@app.route('/api/v1/ai/chat', methods=['POST'])
@require_auth
def ai_chat(user_data):
    data = request.json or {}
    messages = data.get('messages', [])
    context = data.get('context', {})
    user_id = user_data.get('user_id')
    session_id = data.get('session_id', f"session-{user_id}-{int(datetime.utcnow().timestamp())}")
    
    if not messages:
        return jsonify({'error': 'messages required'}), 400
    
    ai_service = get_ai_service()
    
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    response = loop.run_until_complete(ai_service.chat(messages, context))
    loop.close()
    
    last_user_msg = messages[-1] if messages else {}
    common_params = {'lin': user_id, 'sid': session_id, 'ctx': json.dumps(context), 'created_at': datetime.utcnow()}
    
    try:
        db.session.execute(text('''INSERT INTO ai_conversations (lin, session_id, role, content, context, created_at)
            VALUES (:lin, :sid, 'user', :content, :ctx, :created_at)'''),
            {**common_params, 'content': last_user_msg.get('content', '')})
            
        db.session.execute(text('''INSERT INTO ai_conversations (lin, session_id, role, content, context, created_at)
            VALUES (:lin, :sid, 'assistant', :content, :ctx, :created_at)'''),
            {**common_params, 'content': response})
            
        db.session.commit()
    except Exception as e:
        app.logger.error(f"Failed to save conversation: {e}")
        db.session.rollback()
        # Don't fail the request if logging fails
    
    return jsonify({
        'response': response,
        'session_id': session_id
    })

@app.route('/api/v1/ai/history/<session_id>', methods=['GET'])
@require_auth
def ai_history(user_data, session_id):
    user_id = user_data.get('user_id')
    res = db.session.execute(text('SELECT role, content, created_at FROM ai_conversations WHERE lin=:lin AND session_id=:sid ORDER BY created_at'),
        {'lin': user_id, 'sid': session_id})
    history = [dict_from_row(row) for row in res.fetchall()]
    return jsonify({'history': history})

# ==================== BOOKMARKS & NOTES ====================

@app.route('/api/v1/bookmarks', methods=['GET'])
@require_auth
def get_bookmarks(user_data):
    user_id = user_data.get('user_id')
    res = db.session.execute(text('SELECT * FROM bookmarks WHERE lin=:lin ORDER BY created_at DESC'), {'lin': user_id})
    bookmarks = [dict_from_row(row) for row in res.fetchall()]
    return jsonify({'bookmarks': bookmarks})

@app.route('/api/v1/bookmarks', methods=['POST'])
@require_auth
def create_bookmark(user_data):
    user_id = user_data.get('user_id')
    data = request.json or {}
    db.session.execute(text('''INSERT INTO bookmarks (lin, lesson_id, section_id, note, created_at)
        VALUES (:lin, :lid, :sid, :note, :created_at)
        ON CONFLICT(lin, lesson_id, section_id) DO UPDATE SET note=excluded.note'''),
        {
            'lin': user_id, 'lid': data.get('lesson_id'),
            'sid': data.get('section_id'), 'note': data.get('note'),
            'created_at': datetime.utcnow()
        })
    db.session.commit()
    return jsonify({'message': 'bookmark saved'})

@app.route('/api/v1/notes', methods=['GET'])
@require_auth
def get_notes(user_data):
    user_id = user_data.get('user_id')
    lesson_id = request.args.get('lesson_id')
    if lesson_id:
        res = db.session.execute(text('SELECT * FROM notes WHERE lin=:lin AND lesson_id=:lid ORDER BY created_at DESC'),
            {'lin': user_id, 'lid': lesson_id})
    else:
        res = db.session.execute(text('SELECT * FROM notes WHERE lin=:lin ORDER BY created_at DESC'), {'lin': user_id})
    
    notes = [dict_from_row(row) for row in res.fetchall()]
    return jsonify({'notes': notes})

@app.route('/api/v1/notes', methods=['POST'])
@require_auth
def create_note(user_data):
    user_id = user_data.get('user_id')
    data = request.json or {}
    db.session.execute(text('''INSERT INTO notes (lin, lesson_id, section_id, content, created_at)
        VALUES (:lin, :lid, :sid, :content, :created_at)'''),
        {
            'lin': user_id, 'lid': data.get('lesson_id'),
            'sid': data.get('section_id'), 'content': data.get('content'),
            'created_at': datetime.utcnow()
        })
    db.session.commit()
    note_id = db.session.execute(text("SELECT MAX(id) FROM notes")).scalar()
    return jsonify({'id': note_id, 'message': 'note created'})

# ==================== SYNC ====================

@app.route('/api/v1/sync/upload', methods=['POST'])
@require_auth
def sync_upload(user_data):
    user_id = user_data.get('user_id')
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
                if rec_lin and rec_lin != user_id:
                    # Allow if rec_lin is missing or matches
                    pass
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

# ==================== AI ADAPTIVE LEARNING ====================

@app.route('/api/v1/ai/profile', methods=['POST'])
@require_auth
async def ai_generate_profile(user_data):
    """Generate or update learner profile"""
    user_id = user_data.get('user_id')
    ai = get_ai_service()
    
    # Fetch recent assessment results
    res = db.session.execute(text('''
        SELECT ar.score, a.type, c.code as competency
        FROM assessment_results ar
        JOIN assessments a ON ar.assessment_id = a.id
        JOIN competencies c ON a.competency_id = c.id
        WHERE ar.student_id = :uid
        ORDER BY ar.taken_at DESC LIMIT 20
    '''), {'uid': user_id})
    assessments = [dict_from_row(row) for row in res.fetchall()]
    
    profile = await ai.generate_learner_profile({
        'assessments': assessments,
        'recent_activity': [] # Add activity logs if available
    })
    
    # Save to database
    db.session.execute(text('''
        INSERT INTO learner_profiles (user_id, mastery_level, learning_style, strengths, weaknesses, last_updated)
        VALUES (:uid, :mastery, :style, :str, :weak, :now)
        ON CONFLICT(user_id) DO UPDATE SET
            mastery_level = excluded.mastery_level,
            learning_style = excluded.learning_style,
            strengths = excluded.strengths,
            weaknesses = excluded.weaknesses,
            last_updated = excluded.last_updated
    '''), {
        'uid': user_id,
        'mastery': json.dumps(profile.get('mastery_level', {})),
        'style': profile.get('learning_style'),
        'str': profile.get('strengths', []),
        'weak': profile.get('weaknesses', []),
        'now': datetime.utcnow()
    })
    db.session.commit()
    
    return jsonify(profile)

@app.route('/api/v1/ai/pathway', methods=['POST'])
@require_auth
async def ai_get_pathway(user_data):
    """Get or Generate Adaptive Learning Pathway"""
    user_id = user_data.get('user_id')
    
    # Fetch profile
    res = db.session.execute(text('SELECT * FROM learner_profiles WHERE user_id=:uid'), {'uid': user_id})
    row = res.fetchone()
    if not row:
        return jsonify({'error': 'Profile not found. Generate profile first.'}), 404
    
    profile = dict_from_row(row)
    
    # Initialize Engine
    ai = get_ai_service()
    engine = AdaptiveLearningEngine(ai)
    
    # Generate Pathway
    pathway = await engine.generate_pathway(profile)
    
    return jsonify(pathway)

@app.route('/api/v1/ai/mastery/update', methods=['POST'])
@require_auth
def update_mastery(user_data):
    """Update mastery score based on activity result"""
    user_id = user_data.get('user_id')
    data = request.json or {}
    competency_code = data.get('competency_code')
    score = data.get('score') # 0-100
    difficulty = data.get('difficulty', 1)
    
    if not competency_code or score is None:
        return jsonify({'error': 'Missing data'}), 400
        
    # Fetch current profile
    res = db.session.execute(text('SELECT mastery_level FROM learner_profiles WHERE user_id=:uid'), {'uid': user_id})
    row = res.fetchone()
    if not row:
        return jsonify({'error': 'Profile not found'}), 404
        
    mastery_map = row[0] or {} # JSONB comes as dict
    current_val = mastery_map.get(competency_code, 0.5)
    
    # Calculate new score
    ai = get_ai_service()
    engine = AdaptiveLearningEngine(ai)
    new_val = engine.calculate_mastery_update(float(current_val), float(score)/100.0, int(difficulty))
    
    # Update DB
    mastery_map[competency_code] = round(new_val, 2)
    
    db.session.execute(text('''
        UPDATE learner_profiles 
        SET mastery_level = :map, last_updated = :now 
        WHERE user_id = :uid
    '''), {
        'map': json.dumps(mastery_map),
        'now': datetime.utcnow(),
        'uid': user_id
    })
    db.session.commit()
    
    return jsonify({'competency': competency_code, 'old_score': current_val, 'new_score': new_val})

@app.route('/api/v1/ai/adapt', methods=['POST'])
@require_auth
async def ai_adapt_content(user_data):
    """Adapt specific content for the user"""
    user_id = user_data.get('user_id')
    data = request.json or {}
    content = data.get('content')
    competency_code = data.get('competency_code')
    
    if not content or not competency_code:
        return jsonify({'error': 'Missing content or competency_code'}), 400
        
    # Get user profile
    res = db.session.execute(text('SELECT mastery_level, learning_style FROM learner_profiles WHERE user_id=:uid'), {'uid': user_id})
    row = res.fetchone()
    if not row:
        profile = {}
    else:
        profile = dict_from_row(row)
        
    ai = get_ai_service()
    adapted = await ai.adapt_content(content, profile, competency_code)
    
    return jsonify(adapted)

@app.route('/api/v1/ai/assess', methods=['POST'])
@require_auth
async def ai_generate_assessment(user_data):
    """Generate a quick formative assessment"""
    data = request.json or {}
    topic = data.get('topic')
    competency = data.get('competency') # code
    difficulty = data.get('difficulty', 3)
    
    if not topic or not competency:
        return jsonify({'error': 'Missing topic or competency'}), 400
        
    ai = get_ai_service()
    assessment = await ai.generate_assessment(topic, competency, difficulty)
    
    return jsonify(assessment)



@app.route('/api/v1/ai/mark', methods=['POST'])
@require_auth
async def ai_mark_submission(user_data):
    """Mark a student's activity submission"""
    data = request.json or {}
    activity = data.get('activity') # The original AOI object
    response_text = data.get('response')
    
    if not activity or not response_text:
        return jsonify({'error': 'Missing activity or response'}), 400
        
    ai = get_ai_service()
    result = await ai.evaluate_submission(activity, response_text)
    
    # Optionally save result to DB here
    return jsonify(result)

@app.route('/api/v1/ai/simplify', methods=['POST'])
@require_auth
async def ai_simplify_content(user_data):
    """Simplify uploaded content or text"""
    text_content = request.form.get('text', '')
    level = request.form.get('level', 'Senior 1')
    
    # Handle file upload
    if 'file' in request.files:
        file = request.files['file']
        if file.filename.endswith('.pdf'):
            try:
                # Read PDF from memory
                pdf_bytes = file.read()
                pdf_file = io.BytesIO(pdf_bytes)
                reader = pypdf.PdfReader(pdf_file)
                extracted = []
                for page in reader.pages:
                    extracted.append(page.extract_text())
                text_content = "\n".join(extracted)
            except Exception as e:
                return jsonify({'error': f'Failed to process PDF: {str(e)}'}), 400
    
    if not text_content:
        return jsonify({'error': 'No content provided'}), 400
        
    ai = get_ai_service()
    result = await ai.simplify_content(text_content, level)
    return jsonify(result)

@app.route('/api/v1/ai/plan/lesson', methods=['POST'])
@require_auth
async def ai_plan_lesson(user_data):
    """Generate Lesson Plan"""
    data = request.json or {}
    topic = data.get('topic')
    duration = data.get('duration', '60')
    level = data.get('class_level', 'Senior 1')
    objectives = data.get('objectives', '')
    
    if not topic:
        return jsonify({'error': 'Missing topic'}), 400
        
    ai = get_ai_service()
    # Updated signature: topic, grade_level, duration, objectives
    plan = await ai.generate_lesson_plan(topic, level, duration, objectives)
    return jsonify(plan)

@app.route('/api/v1/ai/quiz', methods=['POST'])
@require_auth
async def ai_generate_quiz(user_data):
    """Generate Quiz"""
    data = request.json or {}
    content = data.get('content')
    num_questions = int(data.get('num_questions', 5))
    difficulty = data.get('difficulty', 'medium')
    
    if not content:
        return jsonify({'error': 'Missing content'}), 400
        
    ai = get_ai_service()
    quiz = await ai.generate_quiz(content, num_questions, difficulty)
    return jsonify(quiz)

@app.route('/api/v1/ai/summarize', methods=['POST'])
@require_auth
async def ai_summarize(user_data):
    """Summarize Content"""
    data = request.json or {}
    content = data.get('content')
    format_type = data.get('format', 'bullet_points')
    
    if not content:
        return jsonify({'error': 'Missing content'}), 400
        
    ai = get_ai_service()
    summary = await ai.summarize_content(content, format_type)
    return jsonify({'summary': summary})

@app.route('/api/v1/ai/plan/career', methods=['POST'])
@require_auth
async def ai_career_guidance(user_data):
    """Get Career Guidance based on profile"""
    user_id = user_data.get('user_id')
    
    # Fetch profile from DB
    res = db.session.execute(text('SELECT * FROM learner_profiles WHERE user_id=:uid'), {'uid': user_id})
    row = res.fetchone()
    if not row:
        return jsonify({'error': 'Profile not found'}), 404
    
    profile = dict_from_row(row)
    
    ai = get_ai_service()
    guidance = await ai.get_career_guidance(profile)
    return jsonify(guidance)

@app.route('/api/v1/rag/upload', methods=['POST'])
@require_auth
async def rag_upload(user_data):
    """Upload PDF for RAG"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name
        
        try:
            ai = get_ai_service()
            chunks_count = await ai.process_pdf(tmp_path, file.filename)
            os.unlink(tmp_path) # Clean up
            return jsonify({'status': 'processed', 'chunks': chunks_count})
        except Exception as e:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
            return jsonify({'error': str(e)}), 500

@app.route('/api/v1/rag/chat', methods=['POST'])
@require_auth
async def rag_chat(user_data):
    """Chat with RAG context"""
    data = request.json or {}
    question = data.get('question')
    
    if not question:
        return jsonify({'error': 'Missing question'}), 400
        
    ai = get_ai_service()
    answer = await ai.answer_with_rag(question)
    return jsonify({'answer': answer})

@app.route('/api/v1/system/migrate', methods=['POST'])
def system_migrate():
    """Run database migration script (Admin only - protected by secret)"""
    secret = request.headers.get('X-Admin-Secret')
    if secret != os.getenv('SECRET_KEY'):
        return jsonify({'error': 'Unauthorized'}), 401
        
    try:
        sql_path = os.path.join(os.path.dirname(__file__), 'database_schema_pg.sql')
        with open(sql_path, 'r') as f:
            sql_script = f.read()
            
        # Execute line by line or statement by statement?
        # Supabase/Postgres via SQLAlchemy can execute chunks
        # But split by ';' is risky if procedures have embedded semicolons
        # For simple schema, usually okay.
        
        with db.engine.connect() as conn:
            # We assume the file is standard SQL statements
            # Just execute the whole thing? SQLAlchemy might not like multiple statements in one call
            # Let's try executing it as a block if supported, or split purely.
            
            # Simple split for schema file
            statements = sql_script.split(';')
            for stmt in statements:
                if stmt.strip():
                    conn.execute(text(stmt))
            conn.commit()
            
        return jsonify({'message': 'Migration executed successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Initialize database if using SQLite and file doesn't exist
    if 'sqlite' in app.config['SQLALCHEMY_DATABASE_URI']:
        start_init = False
        if not os.path.exists(os.path.join(os.path.dirname(__file__), 'data.db')):
            start_init = True
            
        with app.app_context():
            if start_init:
                from .scripts.init_db import init_database
                init_database()
                
    app.run(host='0.0.0.0', port=5000, debug=True)
