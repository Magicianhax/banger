import type { TweetContext } from '@banger/shared';
import { onReplyBox } from './reply-detector.js';
import { injectButton } from './button-injector.js';
import { mountPopover, unmountPopover } from './popover-mount.js';

function extractTweetContext(textareaEl: HTMLElement, tweetId: string): TweetContext {
  const tweetArticle = textareaEl.closest('article[data-testid="tweet"]')
    ?? document.querySelector(`article[data-testid="tweet"] a[href*="/status/${tweetId}"]`)
       ?.closest('article[data-testid="tweet"]');

  const parentArticle = tweetArticle?.previousElementSibling?.querySelector?.('article[data-testid="tweet"]')
    ?? document.querySelector('article[data-testid="tweet"]');

  const textEl = parentArticle?.querySelector('[data-testid="tweetText"]');
  const authorEl = parentArticle?.querySelector('[data-testid="User-Name"] a');
  const imageEls = parentArticle?.querySelectorAll('img[alt="Image"]') ?? [];

  return {
    tweetId: tweetId === 'unknown' ? crypto.randomUUID() : tweetId,
    authorHandle: authorEl?.textContent?.trim() ?? '',
    text: textEl?.textContent?.trim() ?? '',
    imageUrls: Array.from(imageEls)
      .map((img) => (img as HTMLImageElement).src)
      .filter((u) => u.startsWith('http')),
    threadContext: [],
  };
}

// Only treat as a reply context — skip the home-feed "What's happening?" composer.
// Signals: inside an <article> (inline thread reply), inside a [role=dialog]
// (reply modal), or on a /status/ URL (tweet detail page).
function isInReplyContext(textareaEl: HTMLElement): boolean {
  if (textareaEl.closest('article[data-testid="tweet"]')) return true;
  if (textareaEl.closest('[role="dialog"]')) return true;
  if (/\/status\//.test(window.location.pathname)) return true;
  return false;
}

// Walk up from the textarea to find the user avatar. Less strict than before
// to catch both the compact "Post your reply" state and the expanded composer.
function findReplyAvatar(textareaEl: HTMLElement): Element | null {
  let node: Element | null = textareaEl;
  while (node && node !== document.body) {
    const avatar =
      node.querySelector('[data-testid^="UserAvatar-Container-"]') ??
      node.querySelector('[data-testid="Tweet-User-Avatar"]');
    if (avatar) return avatar;
    node = node.parentElement;
  }
  return null;
}

function findToolbar(textareaEl: HTMLElement): Element | null {
  let node: Element | null = textareaEl;
  while (node && node !== document.body) {
    const toolbar = node.querySelector('[data-testid="toolBar"]');
    if (toolbar) return toolbar;
    node = node.parentElement;
  }
  return null;
}

onReplyBox((ctx) => {
  if (!isInReplyContext(ctx.textareaEl)) return;

  const avatar = findReplyAvatar(ctx.textareaEl);
  if (!avatar) return;

  injectButton(avatar, () => {
    const tweet = extractTweetContext(ctx.textareaEl, ctx.tweetId);
    // Toolbar may not exist yet in compact reply state — fall back to the
    // avatar's parent container so the popover still has something to anchor on.
    const anchor =
      findToolbar(ctx.textareaEl) ?? (avatar.parentElement as HTMLElement | null) ?? ctx.textareaEl;
    mountPopover(anchor as HTMLElement, tweet, ctx.textareaEl);
  });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'close-popover') unmountPopover();
});
