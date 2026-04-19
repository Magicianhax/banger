import { describe, it, expect, vi } from 'vitest';
import { injectButton } from '../src/content/button-injector.js';

describe('injectButton', () => {
  it('injects a badge into the avatar container', () => {
    const host = document.createElement('div');
    const avatar = document.createElement('div');
    avatar.setAttribute('data-testid', 'UserAvatar-Container-me');
    host.appendChild(avatar);
    document.body.appendChild(host);

    const onClick = vi.fn();
    injectButton(avatar, onClick);

    const btn = host.querySelector('[data-banger-button]') as HTMLElement | null;
    expect(btn).not.toBeNull();
    expect(btn!.classList.contains('banger-badge')).toBe(true);

    btn!.click();
    expect(onClick).toHaveBeenCalled();
  });

  it('is idempotent — does not inject twice in same host', () => {
    const host = document.createElement('div');
    const avatar = document.createElement('div');
    host.appendChild(avatar);
    document.body.appendChild(host);

    injectButton(avatar, vi.fn());
    injectButton(avatar, vi.fn());

    expect(host.querySelectorAll('[data-banger-button]')).toHaveLength(1);
  });
});
