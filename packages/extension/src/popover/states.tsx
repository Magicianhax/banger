export function NoKeyState() {
  return (
    <div className="banger-state">
      <p>Add your LLM key to rip.</p>
      <button
        onClick={() => {
          chrome.runtime.sendMessage({ type: 'open-popup' });
        }}
      >
        Open settings
      </button>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="banger-state banger-state--error">
      <p>Error: {message}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
}

export function SensitiveState({ onProceed, onCancel }: { onProceed: () => void; onCancel: () => void }) {
  return (
    <div className="banger-state">
      <p>This tweet might not want a meme reply.</p>
      <button onClick={onProceed}>Proceed anyway</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="banger-state">
      <p>Banger's stumped. Try rewording or changing vibe.</p>
    </div>
  );
}
