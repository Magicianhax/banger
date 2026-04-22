import { handleSuggestRequest } from './orchestrator.js';
import { TweetContextSchema } from '@banger/shared';
import { z } from 'zod';

const MessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('suggest'),
    tweet: TweetContextSchema,
    sliderValue: z.number().min(0).max(100),
  }),
  z.object({
    type: z.literal('insert-gif'),
    // Accepts https CDN URLs and base64 data: URLs (the prefetched form we
    // pass when the popover has already cached the blob).
    url: z.string().min(1),
    targetAttr: z.string(),
    targetValue: z.string(),
  }),
]);

/**
 * This runs in the page's MAIN world via chrome.scripting.executeScript.
 * It must be fully self-contained — no closure references to extension code.
 *
 * Why main world:
 * - X's Draft.js paste handler only trusts events from the page's own JS realm.
 *   ClipboardEvents constructed in the content script's isolated world get
 *   filtered out as untrusted.
 * - The popover's shadow DOM retains focus, so paste events dispatched from
 *   inside the popover get queued by Draft.js until focus changes. Dispatching
 *   from the main world against the textarea directly sidesteps this.
 * - Main-world fetch works for GIPHY/Tenor CDNs since both return permissive
 *   CORS on their media.
 */
async function insertGifInPage(
  url: string,
  attr: string,
  value: string,
): Promise<boolean> {
  const target = document.querySelector(
    `[${attr}="${value}"]`,
  ) as HTMLElement | null;
  if (!target) return false;
  target.removeAttribute(attr);

  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const blob = await res.blob();
    const file = new File([blob], 'banger.gif', {
      type: blob.type || 'image/gif',
    });
    const dt = new DataTransfer();
    dt.items.add(file);

    target.focus();

    const paste = new ClipboardEvent('paste', {
      clipboardData: dt,
      bubbles: true,
      cancelable: true,
    });
    target.dispatchEvent(paste);

    if (!paste.defaultPrevented) {
      const drop = new DragEvent('drop', {
        dataTransfer: dt,
        bubbles: true,
        cancelable: true,
      });
      (target.closest('[role="textbox"]') ?? target).dispatchEvent(drop);
    }
    return true;
  } catch {
    return false;
  }
}

chrome.runtime.onMessage.addListener((rawMessage, sender, sendResponse) => {
  const parsed = MessageSchema.safeParse(rawMessage);
  if (!parsed.success) {
    sendResponse({ ok: false, error: 'invalid message shape' });
    return false;
  }

  if (parsed.data.type === 'suggest') {
    handleSuggestRequest({
      tweet: parsed.data.tweet,
      sliderValue: parsed.data.sliderValue,
    })
      .then((result) => sendResponse({ ok: true, result }))
      .catch((err) => sendResponse({ ok: false, error: (err as Error).message }));
    return true;
  }

  const tabId = sender.tab?.id;
  if (tabId === undefined) {
    sendResponse({ ok: false, error: 'no tab' });
    return false;
  }

  chrome.scripting
    .executeScript({
      target: { tabId },
      world: 'MAIN',
      func: insertGifInPage,
      args: [parsed.data.url, parsed.data.targetAttr, parsed.data.targetValue],
    })
    .then((results) => {
      const inserted = results[0]?.result === true;
      sendResponse({ ok: inserted, error: inserted ? undefined : 'insert failed' });
    })
    .catch((err) => sendResponse({ ok: false, error: (err as Error).message }));

  return true;
});
