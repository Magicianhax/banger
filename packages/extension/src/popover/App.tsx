import { useEffect, useRef, useState } from 'react';
import type { Suggestion, TweetContext } from '@banger/shared';
import { VibeSlot } from './VibeSlot.js';
import { VibeSlider } from './VibeSlider.js';
import { ErrorState, SensitiveState, EmptyState } from './states.js';
import { insertIntoReply } from './insert-into-x.js';
import { prefetchGifAsDataUrl } from './prefetch.js';

const VIBES = ['agree', 'mock', 'shocked', 'wholesome', 'savage'] as const;

type Status =
  | { kind: 'loading' }
  | { kind: 'ready'; suggestions: Suggestion[] }
  | { kind: 'sensitive' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string };

export function App({
  tweet,
  textareaEl,
  onClose,
}: {
  tweet: TweetContext;
  textareaEl: HTMLElement;
  onClose: () => void;
}) {
  const [sliderValue, setSliderValue] = useState(50);
  const [status, setStatus] = useState<Status>({ kind: 'loading' });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // CDN URL -> base64 data URL. Prefetching the blob here and passing the
  // data URL to the main-world insert function eliminates the click-time
  // network round-trip, which was the main source of the 4-5s attach lag.
  const gifCacheRef = useRef<Map<string, string>>(new Map());

  const startDrag = (e: React.MouseEvent) => {
    // Don't start a drag if the user clicked the close button (or any button in the header).
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = position;

    const onMove = (ev: MouseEvent) => {
      setPosition({
        x: startPos.x + ev.clientX - startX,
        y: startPos.y + ev.clientY - startY,
      });
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const fetchSuggestions = () => {
    setStatus({ kind: 'loading' });
    chrome.runtime.sendMessage(
      { type: 'suggest', tweet, sliderValue },
      (response: {
        ok: boolean;
        result?: { suggestions: Suggestion[]; sensitive: boolean };
        error?: string;
      }) => {
        if (!response.ok) {
          setStatus({ kind: 'error', message: response.error ?? 'unknown' });
          return;
        }
        if (response.result!.sensitive) {
          setStatus({ kind: 'sensitive' });
        } else if (response.result!.suggestions.length === 0) {
          setStatus({ kind: 'empty' });
        } else {
          setStatus({ kind: 'ready', suggestions: response.result!.suggestions });
        }
      },
    );
  };

  useEffect(fetchSuggestions, [tweet.tweetId]);

  useEffect(() => {
    if (status.kind !== 'ready') return;
    for (const s of status.suggestions) {
      const url = s.candidate.url;
      if (gifCacheRef.current.has(url)) continue;
      void prefetchGifAsDataUrl(url).then((dataUrl) => {
        if (dataUrl) gifCacheRef.current.set(url, dataUrl);
      });
    }
  }, [status]);

  if (status.kind === 'sensitive')
    return <SensitiveState onProceed={fetchSuggestions} onCancel={onClose} />;
  if (status.kind === 'error')
    return <ErrorState message={status.message} onRetry={fetchSuggestions} />;
  if (status.kind === 'empty') return <EmptyState />;

  const headerCopy =
    status.kind === 'loading' ? "cookin' up bangers…" : 'pick your weapon';

  return (
    <div
      className="banger-popover"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <header className="banger-header" onMouseDown={startDrag}>
        <span className="banger-wordmark">
          BAN<span className="banger-wordmark-accent">GER</span>
          <span className="banger-wordmark-chip">🔥 {headerCopy}</span>
        </span>
        <button className="banger-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </header>

      <div className="banger-slots">
        {VIBES.map((slot) => {
          const suggestion =
            status.kind === 'ready'
              ? (status.suggestions.find((s) => s.slot === slot) ?? null)
              : null;
          return (
            <VibeSlot
              key={slot}
              slot={slot}
              suggestion={suggestion}
              onPick={async () => {
                if (!suggestion) return;
                const originalUrl = suggestion.candidate.url;
                const cached = gifCacheRef.current.get(originalUrl);
                await insertIntoReply(textareaEl, cached ?? originalUrl);
                onClose();
              }}
            />
          );
        })}
      </div>

      <VibeSlider value={sliderValue} onChange={setSliderValue} />

      <footer className="banger-footer">
        <span>Powered by </span>
        <a
          className="banger-footer-link banger-footer-link--giphy"
          href="https://giphy.com"
          target="_blank"
          rel="noreferrer noopener"
        >
          GIPHY
        </a>
      </footer>
    </div>
  );
}
