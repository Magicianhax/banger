import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../env.js';

type Status = 'checking' | 'ok' | 'down';

const STATUS_COPY: Record<Status, { label: string; text: string }> = {
  checking: { label: 'Status', text: 'dialing in…' },
  ok: { label: 'Status', text: 'locked in' },
  down: { label: 'Status', text: 'backend offline' },
};

export function Settings() {
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/health`, { method: 'GET' })
      .then((r) => setStatus(r.ok ? 'ok' : 'down'))
      .catch(() => setStatus('down'));
  }, []);

  const copy = STATUS_COPY[status];

  return (
    <div className="popup">
      <h1 className="popup-wordmark">
        BAN<span className="accent">GER</span>
        <span className="chip">🔥</span>
      </h1>
      <p className="popup-tagline">
        AI meme replies for X. No setup needed — just hit the diamond in any reply box.
      </p>

      <div className="popup-status">
        <span className="popup-status-label">{copy.label}</span>
        <span className={`popup-status-value ${status}`}>
          <span className={`popup-dot ${status}`} />
          {copy.text}
        </span>
      </div>

      <div className="popup-how">
        <h2 className="popup-how-title">how to cook</h2>
        <ul className="popup-how-list">
          <li>Open any reply box on X</li>
          <li>Tap the flaming diamond</li>
          <li>Pick a vibe, send the banger</li>
        </ul>
      </div>

      <a
        className="popup-link"
        href="https://banger.magician.wtf"
        target="_blank"
        rel="noreferrer"
      >
        banger.magician.wtf →
      </a>
    </div>
  );
}
