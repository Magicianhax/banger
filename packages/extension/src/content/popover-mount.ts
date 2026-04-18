import { createRoot, type Root } from 'react-dom/client';
import { createElement } from 'react';
import { App } from '../popover/App.js';
import type { TweetContext } from '@banger/shared';
import styles from '../popover/styles.css?inline';

let currentHost: HTMLElement | null = null;
let currentRoot: Root | null = null;

export function mountPopover(anchor: HTMLElement, tweet: TweetContext, textareaEl: HTMLElement): void {
  unmountPopover();

  const host = document.createElement('div');
  host.setAttribute('data-banger-popover-host', '');
  host.style.cssText = 'position:absolute;z-index:2147483647;';

  const rect = anchor.getBoundingClientRect();
  host.style.top = `${window.scrollY + rect.top - 12 - 280}px`;
  host.style.left = `${window.scrollX + rect.left}px`;

  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: 'open' });

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  shadow.appendChild(styleEl);

  const mountPoint = document.createElement('div');
  shadow.appendChild(mountPoint);

  currentHost = host;
  currentRoot = createRoot(mountPoint);
  currentRoot.render(
    createElement(App, {
      tweet,
      textareaEl,
      onClose: unmountPopover,
    }),
  );
}

export function unmountPopover(): void {
  currentRoot?.unmount();
  currentRoot = null;
  currentHost?.remove();
  currentHost = null;
}
