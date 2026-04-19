'use client';

import { useEffect, useState } from 'react';
import { SUBCULTURES, type Subculture } from '@banger/shared';

type Styles = {
  darkVsWholesome: number;
  absurdistVsObservational: number;
  dryVsHyper: number;
  politicalVsApolitical: number;
};

type Profile = {
  styles: Styles;
  enabledSubcultures: Subculture[];
  blocklist: string[];
};

const DEFAULT_PROFILE: Profile = {
  styles: {
    darkVsWholesome: 0,
    absurdistVsObservational: 0,
    dryVsHyper: 0,
    politicalVsApolitical: 0,
  },
  enabledSubcultures: [],
  blocklist: [],
};

const STORAGE_KEY = 'banger:profile:v1';

const SLIDERS: Array<{ key: keyof Styles; left: string; right: string }> = [
  { key: 'darkVsWholesome', left: 'dark', right: 'wholesome' },
  { key: 'absurdistVsObservational', left: 'absurdist', right: 'observational' },
  { key: 'dryVsHyper', left: 'dry', right: 'hyper' },
  { key: 'politicalVsApolitical', left: 'political', right: 'apolitical' },
];

export default function HumorProfile() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [blocklistInput, setBlocklistInput] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch {
      /* ignore — fallback to defaults */
    }
  }, []);

  const persist = (next: Profile) => {
    setProfile(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1200);
    } catch {
      /* storage quota or privacy mode — silently ignore */
    }
  };

  const toggleSubculture = (sub: Subculture) => {
    const isOn = profile.enabledSubcultures.includes(sub);
    const next = {
      ...profile,
      enabledSubcultures: isOn
        ? profile.enabledSubcultures.filter((s) => s !== sub)
        : [...profile.enabledSubcultures, sub],
    };
    persist(next);
  };

  const addBlock = () => {
    const val = blocklistInput.trim();
    if (!val || profile.blocklist.includes(val)) return;
    persist({ ...profile, blocklist: [...profile.blocklist, val] });
    setBlocklistInput('');
  };

  const removeBlock = (val: string) => {
    persist({
      ...profile,
      blocklist: profile.blocklist.filter((b) => b !== val),
    });
  };

  const updateSlider = (key: keyof Styles, value: number) => {
    persist({ ...profile, styles: { ...profile.styles, [key]: value } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <h1
          className="wordmark"
          style={{ fontSize: 48, margin: 0 }}
        >
          HUMOR<span className="wordmark-accent"> PROFILE</span>
        </h1>
        {savedFlash && (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 12,
              color: 'var(--banger-mint)',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            ✓ saved
          </span>
        )}
      </div>

      <div
        className="panel"
        style={{
          background: 'var(--banger-panel-2)',
          border: '2px dashed rgba(255,255,255,0.18)',
          boxShadow: 'none',
        }}
      >
        <p className="panel-body" style={{ margin: 0 }}>
          <span style={{ color: 'var(--banger-amber)', fontWeight: 700 }}>
            Heads up:
          </span>{' '}
          settings save to this browser only. Extension sync lands in V2 — for
          now, configure from the extension popup too.
        </p>
      </div>

      <section className="panel">
        <h2 className="panel-title">Style</h2>
        <p className="panel-body" style={{ marginTop: 0 }}>
          Nudge the vibe. Center = no preference.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 16 }}>
          {SLIDERS.map(({ key, left, right }) => (
            <div key={key}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-display)',
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: 'var(--banger-muted)',
                  marginBottom: 6,
                }}
              >
                <span>{left}</span>
                <span>{right}</span>
              </div>
              <input
                type="range"
                min={-100}
                max={100}
                value={profile.styles[key]}
                onChange={(e) => updateSlider(key, Number(e.currentTarget.value))}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Subcultures</h2>
        <p className="panel-body" style={{ marginTop: 0 }}>
          Tap to boost memes from these corners of the internet.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {SUBCULTURES.map((sub) => {
            const active = profile.enabledSubcultures.includes(sub);
            return (
              <button
                key={sub}
                onClick={() => toggleSubculture(sub)}
                className={`tag${active ? ' tag--active' : ''}`}
                style={{ border: 'none' }}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <h2 className="panel-title">Blocklist</h2>
        <p className="panel-body" style={{ marginTop: 0 }}>
          Any candidate whose URL, title, or tags contains one of these strings
          gets filtered. Case-insensitive.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 12,
            flexWrap: 'wrap',
          }}
        >
          <input
            type="text"
            value={blocklistInput}
            onChange={(e) => setBlocklistInput(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addBlock();
            }}
            placeholder="e.g. spongebob"
            style={{ flex: 1, minWidth: 200 }}
          />
          <button className="btn" onClick={addBlock} disabled={!blocklistInput.trim()}>
            Block
          </button>
        </div>
        {profile.blocklist.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginTop: 14,
            }}
          >
            {profile.blocklist.map((val) => (
              <button
                key={val}
                onClick={() => removeBlock(val)}
                className="tag tag--remove"
                style={{ border: 'none' }}
                title={`Remove "${val}"`}
              >
                {val}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
