/**
 * Attach a GIF to X's reply composer as a real file (same code path X uses
 * for its native GIF picker). Strategy order:
 *
 *   1. Fetch GIF bytes → dispatch a ClipboardEvent/DragEvent carrying a
 *      `File` in the DataTransfer. X's editor listens for file paste/drop
 *      and runs its media upload pipeline automatically → the GIF embeds
 *      in the tweet card, not as a raw link.
 *   2. Fall back to pasting the URL as text if the file path fails
 *      (network, CORS, or editor rejects the file).
 *   3. Last resort: copy the URL to clipboard and return false so the
 *      caller can show a "press Ctrl+V" toast.
 */
export async function insertIntoReply(
  textareaEl: HTMLElement,
  url: string,
): Promise<boolean> {
  textareaEl.focus();
  moveCaretToEnd(textareaEl);

  // Strategy 1 — file attachment (this is what makes the GIF actually embed).
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (res.ok) {
      const blob = await res.blob();
      const mime = blob.type || 'image/gif';
      const ext = mime === 'image/gif' ? 'gif' : mime.split('/')[1] ?? 'bin';
      const file = new File([blob], `banger.${ext}`, { type: mime });

      const dt = new DataTransfer();
      dt.items.add(file);

      // Paste path first — covers Draft.js-based composers.
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: dt,
        bubbles: true,
        cancelable: true,
      });
      textareaEl.dispatchEvent(pasteEvent);
      if (pasteEvent.defaultPrevented) return true;

      // Drop path — some rich editors only listen for drops.
      const dropTarget = textareaEl.closest('[role="textbox"]') ?? textareaEl;
      const dropEvent = new DragEvent('drop', {
        dataTransfer: dt,
        bubbles: true,
        cancelable: true,
      });
      dropTarget.dispatchEvent(dropEvent);
      if (dropEvent.defaultPrevented) return true;
    }
  } catch {
    // Fetch or event construction failed — continue to fallbacks.
  }

  // Strategy 2 — URL-as-text paste.
  try {
    const dt = new DataTransfer();
    dt.setData('text/plain', ` ${url} `);
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: dt,
      bubbles: true,
      cancelable: true,
    });
    textareaEl.dispatchEvent(pasteEvent);
    if (pasteEvent.defaultPrevented) return true;
  } catch {
    // Fall through to clipboard fallback.
  }

  // Strategy 3 — clipboard copy + manual paste hint.
  void navigator.clipboard.writeText(` ${url} `).catch(() => {});
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
