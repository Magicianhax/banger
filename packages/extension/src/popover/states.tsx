export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="banger-state banger-state--error">
      <span className="banger-state-emoji" aria-hidden="true">💀</span>
      <h2 className="banger-state-title banger-state-title--error">we cooked</h2>
      <p className="banger-state-body">{message}</p>
      <button onClick={onRetry}>Try again</button>
    </div>
  );
}

export function SensitiveState({
  onProceed,
  onCancel,
}: {
  onProceed: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="banger-state">
      <span className="banger-state-emoji" aria-hidden="true">🫡</span>
      <h2 className="banger-state-title">read the room</h2>
      <p className="banger-state-body">
        This tweet might not want a meme reply. You sure?
      </p>
      <button className="banger-btn--secondary" onClick={onCancel}>
        Back off
      </button>
      <button className="banger-btn--danger" onClick={onProceed}>
        Send it
      </button>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="banger-state">
      <span className="banger-state-emoji" aria-hidden="true">🫠</span>
      <h2 className="banger-state-title">nothin' hit</h2>
      <p className="banger-state-body">Banger's stumped. Try rewording or nudge the vibe.</p>
    </div>
  );
}
