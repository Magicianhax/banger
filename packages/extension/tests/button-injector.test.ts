import { describe, it, expect, vi } from 'vitest';
import { injectButton } from '../src/content/button-injector.js';

describe('injectButton', () => {
  it('injects a button next to the GIF toolbar icon', () => {
    const toolbar = document.createElement('div');
    toolbar.setAttribute('data-testid', 'toolBar');
    const gifBtn = document.createElement('div');
    gifBtn.setAttribute('data-testid', 'gifSearchButton');
    toolbar.appendChild(gifBtn);
    document.body.appendChild(toolbar);

    const onClick = vi.fn();
    injectButton(toolbar, onClick);

    const btn = toolbar.querySelector('[data-banger-button]') as HTMLElement | null;
    expect(btn).not.toBeNull();
    btn!.click();
    expect(onClick).toHaveBeenCalled();
  });

  it('is idempotent — does not inject twice in same toolbar', () => {
    const toolbar = document.createElement('div');
    document.body.appendChild(toolbar);

    injectButton(toolbar, vi.fn());
    injectButton(toolbar, vi.fn());

    expect(toolbar.querySelectorAll('[data-banger-button]')).toHaveLength(1);
  });
});
