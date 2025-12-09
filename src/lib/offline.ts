const DB_NAME = 'learn2master_offline_v1';
const STORE_QUEUE = 'attempt_queue';

export type QueueRecord = {
  client_id: string;
  type: string;
  payload: any;
  created_at: string;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_QUEUE)) {
        db.createObjectStore(STORE_QUEUE, { keyPath: 'client_id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function enqueueAttempt(record: QueueRecord) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_QUEUE, 'readwrite');
    const store = tx.objectStore(STORE_QUEUE);
    store.put(record);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllQueued(): Promise<QueueRecord[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_QUEUE, 'readonly');
    const store = tx.objectStore(STORE_QUEUE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function clearQueueItem(client_id: string) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_QUEUE, 'readwrite');
    tx.objectStore(STORE_QUEUE).delete(client_id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearAllQueue() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_QUEUE, 'readwrite');
    tx.objectStore(STORE_QUEUE).clear();
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function syncQueueToServer(serverUrl: string) {
  const items = await getAllQueued();
  if (!items.length) return { uploaded: 0 };
  const payload = { queue: items };
  const tokenRaw = localStorage.getItem('l2m_server_session_v1');
  let authHeader: Record<string, string> = {};
  if (tokenRaw) {
    try {
      const parsed = JSON.parse(tokenRaw);
      if (parsed?.token) authHeader = { Authorization: `Bearer ${parsed.token}` };
    } catch {}
  }
  const res = await fetch(serverUrl.replace(/\/$/, '') + '/api/v1/sync/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Sync failed: ' + res.status);
  const data = await res.json();
  // clear items on success
  for (const it of items) {
    await clearQueueItem(it.client_id);
  }
  return { uploaded: items.length, serverResponse: data };
}
