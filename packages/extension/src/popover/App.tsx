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
  const [copiedHint, setCopiedHint] = useState(false);

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
    <div className="banger-popover">
      <header className="banger-header">
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
                const ok = await insertIntoReply(textareaEl, suggestion.candidate.url);
                if (ok) {
                  onClose();
                } else {
                  setCopiedHint(true);
                  setTimeout(onClose, 2500);
                }
              }}
            />
          );
        })}
      </div>

      <VibeSlider value={sliderValue} onChange={setSliderValue} />

      {copiedHint && (
        <div className="banger-toast">
          copied — hit <kbd>Ctrl</kbd>+<kbd>V</kbd> to paste
        </div>
      )}

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
