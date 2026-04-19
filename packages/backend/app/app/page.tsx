'use client';

import { useEffect, useState } from 'react';

type Health = 'checking' | 'ok' | 'down';

export default function DashboardHome() {
  const [health, setHealth] = useState<Health>('checking');

  useEffect(() => {
    fetch('/api/health')
      .then((r) => setHealth(r.ok ? 'ok' : 'down'))
      .catch(() => setHealth('down'));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1
          className="wordmark"
          style={{ fontSize: 56, margin: 0, display: 'inline-flex', gap: 10 }}
        >
          WELCOME BACK<span className="wordmark-accent">.</span>
        </h1>
        <p
          style={{
            fontSize: 16,
            color: 'var(--banger-muted)',
            marginTop: 4,
            maxWidth: 600,
          }}
        >
          This is your Banger HQ. Tune how the extension picks memes, check
          status, and fire off bangers on X.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}
      >
        <div className="panel">
          <h2 className="panel-title">Backend</h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            <StatusDot kind={health} />
            {health === 'checking' && 'dialing in…'}
            {health === 'ok' && (
              <span style={{ color: 'var(--banger-mint)' }}>locked in</span>
            )}
            {health === 'down' && (
              <span style={{ color: 'var(--banger-pink)' }}>offline</span>
            )}
          </div>
          <p className="panel-body" style={{ marginTop: 8, marginBottom: 0 }}>
            The suggestion pipeline is served from this backend. If down, the
            extension can&apos;t reach it.
          </p>
        </div>

        <div className="panel">
          <h2 className="panel-title">Replies today</h2>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 40,
              color: 'var(--banger-amber)',
              lineHeight: 1,
            }}
          >
            —
          </div>
          <p className="panel-body" style={{ marginTop: 8, marginBottom: 0 }}>
            Reply history logging ships in V2.
          </p>
        </div>

        <div className="panel">
          <h2 className="panel-title">Extension</h2>
          <p className="panel-body" style={{ margin: 0 }}>
            Install Banger for Chrome, click the flaming diamond on any reply
            composer. No keys, no setup.
          </p>
          <a
            className="btn btn--mint"
            href="https://github.com/Magicianhax/banger/releases/latest/download/banger-extension.zip"
            rel="noreferrer"
            style={{ marginTop: 12 }}
          >
            Get extension ↓
          </a>
        </div>
      </div>

      <div className="panel">
        <h2 className="panel-title">How to cook</h2>
        <ol
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 14,
            color: 'var(--banger-muted)',
            lineHeight: 2,
          }}
        >
          <li>Install the Chrome extension.</li>
          <li>Open any reply box on X.</li>
          <li>Click the flaming diamond badge at the top-right of your avatar.</li>
          <li>Pick a vibe — or drag the slider from mild to savage.</li>
          <li>Send it. GIF attaches natively.</li>
        </ol>
      </div>
    </div>
  );
}

function StatusDot({ kind }: { kind: Health }) {
  const color =
    kind === 'ok'
      ? 'var(--banger-mint)'
      : kind === 'down'
        ? 'var(--banger-pink)'
        : 'var(--banger-amber)';
  return (
    <span
      style={{
        display: 'inline-block',
        width: 10,
        height: 10,
        background: color,
        borderRadius: 999,
        border: '1.5px solid var(--banger-border)',
        animation: kind === 'down' ? 'none' : 'pulse 1.6s ease-in-out infinite',
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </span>
  );
}
