/**
 * Insert a URL into X's Draft.js-powered reply textarea.
 *
 * X's editor ignores `document.execCommand('insertText')` and plain InputEvent
 * dispatches — it only responds to real paste events. We simulate one with a
 * synthetic ClipboardEvent + DataTransfer.
 *
 * Falls back to writing the URL to the system clipboard and returns `false`
 * so the caller can surface a "press Ctrl+V" hint if the simulated paste is
 * rejected (e.g., in non-Draft.js editors).
 */
export function insertIntoReply(textareaEl: HTMLElement, url: string): boolean {
  const payload = ` ${url} `;

  textareaEl.focus();
  moveCaretToEnd(textareaEl);

  try {
    const dataTransfer = new DataTransfer();
    dataTransfer.setData('text/plain', payload);
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true,
    });
    textareaEl.dispatchEvent(pasteEvent);
    // Draft.js / Slate / ProseMirror call preventDefault on handled paste.
    if (pasteEvent.defaultPrevented) return true;
  } catch {
    // DataTransfer/ClipboardEvent unsupported — fall through.
  }

  // Fallback: copy to clipboard, return false so the caller can show a toast.
  void navigator.clipboard.writeText(payload).catch(() => {});
  return false;
}

function moveCaretToEnd(el: HTMLElement): void {
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}
