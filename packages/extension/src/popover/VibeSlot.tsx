import type { Suggestion } from '@banger/shared';

export function VibeSlot({
  slot,
  suggestion,
  onPick,
}: {
  slot: string;
  suggestion: Suggestion | null;
  onPick: () => void;
}) {
  if (!suggestion) {
    return (
      <div
        className={`banger-slot banger-slot--loading banger-slot--${slot}`}
        aria-label={`${slot} loading`}
      >
        <div className="banger-shimmer" />
        <span className="banger-slot-label">{slot}</span>
      </div>
    );
  }
  return (
    <button
      className={`banger-slot banger-slot--${slot}`}
      onClick={onPick}
      aria-label={`Pick ${slot} reaction`}
    >
      <img
        src={suggestion.candidate.preview_url}
        alt=""
        loading="lazy"
        onMouseEnter={(e) => {
          e.currentTarget.src = suggestion.candidate.url;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.src = suggestion.candidate.preview_url;
        }}
      />
      <span className="banger-slot-label">{slot}</span>
    </button>
  );
}
