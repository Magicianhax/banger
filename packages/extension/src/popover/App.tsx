import { useEffect, useState } from 'react';
import type { Suggestion, TweetContext } from '@banger/shared';
import { VibeSlot } from './VibeSlot.js';
import { VibeSlider } from './VibeSlider.js';
import { NoKeyState, ErrorState, SensitiveState, EmptyState } from './states.js';
import { insertIntoReply } from './insert-into-x.js';

type Status =
  | { kind: 'loading' }
  | { kind: 'ready'; suggestions: Suggestion[] }
  | { kind: 'no-key' }
  | { kind: 'sensitive' }
  | { kind: 'empty' }
  | { kind: 'error'; message: string };

export function App({ tweet, textareaEl, onClose }: {
  tweet: TweetContext;
  textareaEl: HTMLElement;
  onClose: () => void;
}) {
  const [sliderValue, setSliderValue] = useState(50);
  const [status, setStatus] = useState<Status>({ kind: 'loading' });

  const fetchSuggestions = () => {
    setStatus({ kind: 'loading' });
    chrome.runtime.sendMessage(
      { type: 'suggest', tweet, sliderValue },
      (response: { ok: boolean; result?: { suggestions: Suggestion[]; sensitive: boolean }; error?: string }) => {
        if (!response.ok) {
          if (response.error?.includes('API key')) setStatus({ kind: 'no-key' });
          else setStatus({ kind: 'error', message: response.error ?? 'unknown' });
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

  if (status.kind === 'no-key') return <NoKeyState />;
  if (status.kind === 'sensitive') return <SensitiveState onProceed={fetchSuggestions} onCancel={onClose} />;
  if (status.kind === 'error') return <ErrorState message={status.message} onRetry={fetchSuggestions} />;
  if (status.kind === 'empty') return <EmptyState />;

  return (
    <div className="banger-popover">
      <header className="banger-header">
        <span>Banger</span>
        <button onClick={onClose} aria-label="Close">✕</button>
      </header>
      <div className="banger-slots">
        {['agree', 'mock', 'shocked', 'wholesome', 'savage'].map((slot) => {
          const suggestion = status.kind === 'ready'
            ? status.suggestions.find((s) => s.slot === slot) ?? null
            : null;
          return (
            <VibeSlot
              key={slot}
              slot={slot}
              suggestion={suggestion}
              onPick={() => {
                if (!suggestion) return;
                insertIntoReply(textareaEl, suggestion.candidate.url);
                onClose();
              }}
            />
          );
        })}
      </div>
      <VibeSlider value={sliderValue} onChange={setSliderValue} />
    </div>
  );
}
