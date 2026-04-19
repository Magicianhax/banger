'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [cleared, setCleared] = useState(false);

  const clearLocalData = () => {
    try {
      localStorage.removeItem('banger:profile:v1');
      setCleared(true);
      setTimeout(() => setCleared(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 className="wordmark" style={{ fontSize: 48, margin: 0 }}>
        SETTINGS<span className="wordmark-accent">.</span>
      </h1>

      <section className="panel">
        <h2 className="panel-title">Privacy</h2>
        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            fontSize: 14,
            color: 'var(--banger-muted)',
            lineHeight: 1.8,
          }}
        >
          <li>Banger never stores your tweets or reply history on its servers.</li>
          <li>
            Tweet context is sent to OpenAI GPT-5 Nano only for suggestion
            generation — not logged.
          </li>
          <li>
            Humor profile settings save to your browser&apos;s localStorage for
            this dashboard. Extension settings live in{' '}
            <code
              style={{
                background: 'var(--banger-panel-2)',
                padding: '1px 6px',
                borderRadius: 4,
                fontSize: 12,
              }}
            >
              chrome.storage.local
            </code>
            .
          </li>
          <li>No analytics, no telemetry, no tracking.</li>
        </ul>
      </section>

      <section className="panel">
        <h2 className="panel-title">Data</h2>
        <p className="panel-body" style={{ marginTop: 0 }}>
          Wipe your dashboard preferences for this browser. Does not touch the
          extension.
        </p>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 12 }}>
          <button className="btn btn--pink" onClick={clearLocalData}>
            Clear local data
          </button>
          {cleared && (
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 12,
                color: 'var(--banger-mint)',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              ✓ wiped
            </span>
          )}
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">About</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '8px 24px',
            fontSize: 14,
          }}
        >
          <span style={{ color: 'var(--banger-muted)' }}>Version</span>
          <span>0.0.1</span>
          <span style={{ color: 'var(--banger-muted)' }}>Model</span>
          <span>OpenAI GPT-5 Nano</span>
          <span style={{ color: 'var(--banger-muted)' }}>Source</span>
          <span>GIPHY Search API</span>
          <span style={{ color: 'var(--banger-muted)' }}>License</span>
          <span>MIT</span>
        </div>
      </section>

      <footer
        style={{
          marginTop: 12,
          paddingTop: 16,
          borderTop: '1.5px dashed rgba(255,255,255,0.1)',
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: 'var(--banger-muted)',
          textAlign: 'center',
        }}
      >
        Powered by{' '}
        <a
          href="https://giphy.com"
          target="_blank"
          rel="noreferrer"
          style={{ color: '#00ff99', fontWeight: 700 }}
        >
          GIPHY
        </a>
      </footer>
    </div>
  );
}
