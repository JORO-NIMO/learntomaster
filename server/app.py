from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), 'data.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lin TEXT UNIQUE,
        name TEXT,
        method TEXT,
        password_hash TEXT,
        created_at TEXT
    )''')
    cur.execute('''CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id TEXT,
        record_type TEXT,
        payload TEXT,
        created_at TEXT,
        uploaded INTEGER DEFAULT 0
    )''')
    conn.commit()
    conn.close()

app = Flask(__name__)
CORS(app)

@app.before_first_request
def startup():
    init_db()


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
        # _ts is a unix timestamp string; we accept any for prototype
        return lin
    except Exception:
        return None

@app.route('/api/v1/auth/register', methods=['POST'])
def register():
    data = request.json or {}
    lin = data.get('lin')
    name = data.get('name')
    secret = data.get('secret')
    method = data.get('method', 'pin')
    if not lin or not name or not secret:
        return jsonify({'error':'missing fields'}), 400
    conn = get_db()
    cur = conn.cursor()
    try:
        ph = generate_password_hash(secret)
        cur.execute('INSERT INTO users (lin,name,method,password_hash,created_at) VALUES (?,?,?,?,?)',
                    (lin, name, method, ph, datetime.utcnow().isoformat()))
        conn.commit()
        return jsonify({'lin': lin, 'name': name}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    lin = data.get('lin')
    name = data.get('name')
    secret = data.get('secret')
    if not lin or not name or not secret:
        return jsonify({'error':'missing fields'}), 400
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM users WHERE lin=?', (lin,))
    row = cur.fetchone()
    if not row:
        return jsonify({'error':'user not found'}), 404
    if row['name'] != name:
        return jsonify({'error':'name mismatch'}), 401
    if not check_password_hash(row['password_hash'], secret):
        return jsonify({'error':'invalid credentials'}), 401
    # return a simple session token (not JWT) for demo - production should use real tokens
    return jsonify({'lin': row['lin'], 'name': row['name'], 'session_token': f"tok-{row['lin']}-{int(datetime.utcnow().timestamp())}"})

@app.route('/api/v1/sync/upload', methods=['POST'])
def sync_upload():
    # Prototype auth: expect Authorization: Bearer tok-<lin>-<ts>
    auth_lin = parse_bearer_lin(request.headers.get('Authorization', ''))
    if not auth_lin:
        return jsonify({'error': 'unauthorized'}), 401
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
        try:
            rec_lin = None
            if isinstance(payload, dict):
                rec_lin = payload.get('lin')
            if rec_lin and rec_lin != auth_lin:
                return jsonify({'error': 'lin mismatch', 'client_id': client_id}), 403
        except Exception:
            pass
        cur.execute('INSERT INTO sync_queue (client_id,record_type,payload,created_at,uploaded) VALUES (?,?,?,?,1)',
                    (client_id, record_type, json.dumps(payload, ensure_ascii=False), created_at))
        results.append({'client_id': client_id, 'status': 'ok'})
    conn.commit()
    return jsonify({'results': results}), 200

@app.route('/api/v1/recommendations/<lin>', methods=['GET'])
def recommendations(lin):
    # lightweight demo recommendations
    recs = [
        {'type':'lesson','itemId':'lesson-alg-3','reason':'Continue your progress in Algebra','priority':'high','estimatedTime':50},
    ]
    return jsonify({'lin': lin, 'recommendations': recs})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
