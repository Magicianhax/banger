import Link from 'next/link';

export default function Landing() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '40px 20px',
      }}
    >
      <div style={{ maxWidth: 640, width: '100%', textAlign: 'center' }}>
        <h1
          className="wordmark"
          style={{
            fontSize: 96,
            margin: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          BAN<span className="wordmark-accent">GER</span>
          <span className="chip" style={{ fontSize: 12 }}>🔥 V1</span>
        </h1>

        <p
          style={{
            fontSize: 20,
            color: 'var(--banger-muted)',
            margin: '12px 0 32px',
            lineHeight: 1.4,
          }}
        >
          AI meme replies for X. Hit the flaming diamond on any reply, pick a
          vibe, send the banger.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <Link className="btn btn--pink" href="/app">
            Open Dashboard →
          </Link>
          <a
            className="btn btn--white"
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noreferrer"
          >
            Install for Chrome
          </a>
        </div>

        <footer
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: '1.5px dashed rgba(255,255,255,0.12)',
            fontFamily: 'var(--font-display)',
            fontSize: 11,
            letterSpacing: 1,
            textTransform: 'uppercase',
            color: 'var(--banger-muted)',
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
    </main>
  );
}
