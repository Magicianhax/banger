import { useEffect, useState } from 'react';
import type { Suggestion, TweetContext } from '@banger/shared';
import { VibeSlot } from './VibeSlot.js';
import { VibeSlider } from './VibeSlider.js';
import { ErrorState, SensitiveState, EmptyState } from './states.js';
import { insertIntoReply } from './insert-into-x.js';

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
                const url = suggestion.candidate.url;
                // Close popover FIRST so its shadow-DOM host stops holding
                // focus. X's Draft.js won't accept a paste while focus is on
                // our popover button — it queues the paste until focus moves
                // (which only happened when the user switched tabs).
                onClose();
                // Wait one frame so React unmounts the host and focus falls
                // back to the document, then insert. The caller has already
                // closed so we don't need the ok/fallback split — the paste
                // either lands in Draft.js or the clipboard fallback fires
                // silently (URL still on clipboard for a manual Ctrl+V).
                await new Promise((r) => requestAnimationFrame(() => r(undefined)));
                await insertIntoReply(textareaEl, url);
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
