import { describe, it, expect, vi } from 'vitest';
import { onReplyBox } from '../src/content/reply-detector.js';

describe('onReplyBox', () => {
  it('fires callback when a reply composer appears', async () => {
    const spy = vi.fn();
    const stop = onReplyBox(spy);

    const composer = document.createElement('div');
    composer.setAttribute('data-testid', 'tweetTextarea_0');
    composer.setAttribute('role', 'textbox');
    document.body.appendChild(composer);

    await new Promise((r) => setTimeout(r, 10));

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]?.[0]?.textareaEl).toBe(composer);
    stop();
  });

  it('does not fire for non-reply elements', async () => {
    const spy = vi.fn();
    const stop = onReplyBox(spy);

    const unrelated = document.createElement('div');
    unrelated.setAttribute('data-testid', 'something-else');
    document.body.appendChild(unrelated);

    await new Promise((r) => setTimeout(r, 10));

    expect(spy).not.toHaveBeenCalled();
    stop();
  });
});
