import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../env.js';

export function Settings() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'down'>('checking');

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/health`, { method: 'GET' })
      .then((r) => setStatus(r.ok ? 'ok' : 'down'))
      .catch(() => setStatus('down'));
  }, []);

  return (
    <div className="popup">
      <h1>Banger</h1>
      <p style={{ fontSize: 13, color: '#aaa', marginTop: 0 }}>
        AI meme replies for X. No setup needed — open any reply box and click the fire icon.
      </p>

      <div style={{ marginTop: 16, padding: 12, background: '#2a2a30', borderRadius: 6 }}>
        <div style={{ fontSize: 12, color: '#aaa', marginBottom: 4 }}>Backend status</div>
        {status === 'checking' && <div>Checking\u2026</div>}
        {status === 'ok' && <div style={{ color: '#4ade80' }}>\u2713 connected</div>}
        {status === 'down' && <div style={{ color: '#ff6b6b' }}>\u2717 backend unreachable</div>}
      </div>

      <a
        href="https://banger.magician.wtf"
        target="_blank"
        rel="noreferrer"
        style={{ display: 'block', marginTop: 16, fontSize: 12, color: '#1d9bf0', textAlign: 'center' }}
      >
        banger.magician.wtf \u2192
      </a>
    </div>
  );
}
