/**
 * Attach a GIF to X's reply composer as a real file, so X runs its native
 * media-upload pipeline (same code path X's own GIF picker uses).
 *
 * The actual fetch + paste dispatch happens in the page's MAIN world via
 * chrome.scripting.executeScript (called from the service worker). We can't
 * do it here because:
 *
 * 1. X's CSP blocks inline <script> injection.
 * 2. ClipboardEvents constructed in the content script's isolated world are
 *    treated as untrusted by Draft.js and often ignored.
 * 3. The popover's shadow-DOM host holds focus, so paste events dispatched
 *    from here get queued by Draft.js until focus moves (which is why
 *    switching tabs made the GIF appear after a delay).
 *
 * What this function does: mark the textarea with a unique data attribute so
 * the main-world injected script can find it, then message the service
 * worker to run the injection.
 */
export async function insertIntoReply(
  textareaEl: HTMLElement,
  url: string,
): Promise<boolean> {
  const targetAttr = 'data-banger-target';
  const targetValue = `t${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
  textareaEl.setAttribute(targetAttr, targetValue);

  try {
    const response = (await chrome.runtime.sendMessage({
      type: 'insert-gif',
      url,
      targetAttr,
      targetValue,
    })) as { ok: boolean; error?: string };

    if (response?.ok) return true;
  } catch {
    // fall through to clipboard fallback
  }

  // Clean up the marker if the injection never happened.
  textareaEl.removeAttribute(targetAttr);

  // Silent safety net: put the URL on the clipboard so the user can paste it.
  void navigator.clipboard.writeText(` ${url} `).catch(() => {});
  return false;
}
