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

onReplyBox((ctx) => {
  const toolbar = ctx.element.closest('[data-testid="toolBar"]')
    ?? ctx.element.parentElement?.querySelector('[data-testid="toolBar"]')
    ?? ctx.element.parentElement;
  if (!toolbar) return;

  injectButton(toolbar, () => {
    const tweet = extractTweetContext(ctx.textareaEl, ctx.tweetId);
    mountPopover(toolbar as HTMLElement, tweet, ctx.textareaEl);
  });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'close-popover') unmountPopover();
});
