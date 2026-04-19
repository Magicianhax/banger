import Link from 'next/link';
import { Sidebar } from './Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        gap: 24,
        padding: 24,
      }}
    >
      <Sidebar />
      <main style={{ minWidth: 0 }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 11,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: 'var(--banger-muted)',
            }}
          >
            ← marketing
          </Link>
        </header>
        {children}
      </main>
    </div>
  );
}
