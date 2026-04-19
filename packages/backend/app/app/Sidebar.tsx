'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = { href: string; label: string; emoji: string; soon?: boolean };

const MAIN: NavItem[] = [
  { href: '/app', label: 'Home', emoji: '🏠' },
  { href: '/app/profile', label: 'Humor', emoji: '🎭' },
  { href: '/app/settings', label: 'Settings', emoji: '⚙️' },
];

const SOON: NavItem[] = [
  { href: '#', label: 'History', emoji: '🧾', soon: true },
  { href: '#', label: 'Collection', emoji: '⭐', soon: true },
  { href: '#', label: 'Stats', emoji: '📊', soon: true },
  { href: '#', label: 'Packs', emoji: '📦', soon: true },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        background: 'var(--banger-panel)',
        border: '2.5px solid var(--banger-border)',
        borderRadius: 14,
        boxShadow: 'var(--banger-shadow-md)',
        padding: 20,
        height: 'fit-content',
        position: 'sticky',
        top: 24,
      }}
    >
      <Link
        href="/app"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'var(--font-display)',
          fontSize: 30,
          letterSpacing: 1,
          textTransform: 'uppercase',
          lineHeight: 1,
          marginBottom: 20,
        }}
      >
        BAN<span className="wordmark-accent">GER</span>
        <span className="chip" style={{ fontSize: 9 }}>🔥</span>
      </Link>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {MAIN.map((item) => {
          const active =
            item.href === '/app'
              ? pathname === '/app'
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="side-link"
              data-active={active ? 'true' : undefined}
            >
              <span aria-hidden="true">{item.emoji}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1.5px dashed rgba(255,255,255,0.1)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 10,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: 'var(--banger-muted)',
            marginBottom: 8,
          }}
        >
          Coming soon
        </div>
        {SOON.map((item) => (
          <div key={item.label} className="side-link side-link--soon">
            <span aria-hidden="true">{item.emoji}</span>
            <span>{item.label}</span>
            <span className="side-soon-badge">soon</span>
          </div>
        ))}
      </div>

      <style>{`
        .side-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 14px;
          color: var(--banger-fg);
          cursor: pointer;
          transition: background 0.1s, transform 0.1s;
        }
        .side-link:hover {
          background: var(--banger-panel-2);
          transform: translateX(2px);
        }
        .side-link[data-active="true"] {
          background: var(--banger-pink);
          color: #fff;
          border: 2px solid var(--banger-border);
          box-shadow: var(--banger-shadow-sm);
        }
        .side-link--soon {
          color: var(--banger-muted);
          opacity: 0.5;
          cursor: default;
          font-size: 13px;
        }
        .side-link--soon:hover {
          background: transparent;
          transform: none;
        }
        .side-soon-badge {
          margin-left: auto;
          font-family: var(--font-display);
          font-size: 9px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          background: var(--banger-panel-2);
          color: var(--banger-amber);
          padding: 1px 6px;
          border-radius: 4px;
          border: 1.5px solid var(--banger-border);
        }
      `}</style>
    </aside>
  );
}
