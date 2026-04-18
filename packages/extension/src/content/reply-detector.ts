import type { ReplyBoxContext } from '@banger/shared';

const TEXTAREA_SELECTOR = '[data-testid^="tweetTextarea_"]';

export function onReplyBox(cb: (ctx: ReplyBoxContext) => void): () => void {
  const seen = new WeakSet<Element>();

  const handle = (el: Element) => {
    if (seen.has(el)) return;
    seen.add(el);
    const tweetEl = el.closest('article[data-testid="tweet"]');
    const tweetId =
      tweetEl?.querySelector('a[href*="/status/"]')?.getAttribute('href')?.split('/status/')[1]?.split('/')[0] ??
      'unknown';
    cb({ element: el, tweetId, textareaEl: el as HTMLElement });
  };

  document.querySelectorAll(TEXTAREA_SELECTOR).forEach(handle);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of Array.from(m.addedNodes)) {
        if (!(node instanceof Element)) continue;
        if (node.matches?.(TEXTAREA_SELECTOR)) handle(node);
        node.querySelectorAll?.(TEXTAREA_SELECTOR).forEach(handle);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}
