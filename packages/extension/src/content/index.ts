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

// Walk up from the textarea to find the enclosing reply composer. We require
// BOTH the toolBar (with gifSearchButton — signals a real full composer) AND
// the user avatar (where the badge attaches). That pairing eliminates ghost
// matches against secondary mini-composers.
function findComposer(
  textareaEl: HTMLElement,
): { toolbar: Element; avatar: Element } | null {
  let node: Element | null = textareaEl;
  while (node && node !== document.body) {
    const toolbar = node.querySelector('[data-testid="toolBar"]');
    const avatar =
      node.querySelector('[data-testid^="UserAvatar-Container-"]') ??
      node.querySelector('[data-testid="Tweet-User-Avatar"]');
    if (toolbar?.querySelector('[data-testid="gifSearchButton"]') && avatar) {
      return { toolbar, avatar };
    }
    node = node.parentElement;
  }
  return null;
}

onReplyBox((ctx) => {
  const composer = findComposer(ctx.textareaEl);
  if (!composer) return;

  injectButton(composer.avatar, () => {
    const tweet = extractTweetContext(ctx.textareaEl, ctx.tweetId);
    mountPopover(composer.toolbar as HTMLElement, tweet, ctx.textareaEl);
  });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'close-popover') unmountPopover();
});
