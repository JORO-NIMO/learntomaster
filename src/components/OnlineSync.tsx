import React, { useEffect } from 'react';
import { syncQueueToServer } from '@/lib/offline';

const SERVER_BASE = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const OnlineSync: React.FC = () => {
  useEffect(() => {
    const trySync = async () => {
      if (!navigator.onLine) return;
      try {
        const res = await syncQueueToServer(SERVER_BASE);
        console.log('Sync result', res);
      } catch (e) {
        console.warn('Sync failed', e);
      }
    };

    window.addEventListener('online', trySync);
    // try once on mount
    trySync();
    return () => window.removeEventListener('online', trySync);
  }, []);

  return null;
};

export default OnlineSync;
