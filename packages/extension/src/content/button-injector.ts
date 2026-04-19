// Builds the flaming-diamond SVG via DOM APIs (no innerHTML).
function buildFlamingDiamond(): SVGSVGElement {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.display = 'block';

  const flame = document.createElementNS(NS, 'path');
  flame.setAttribute(
    'd',
    'M12 1.5c-0.8 1.8-2.6 2.5-2.6 4.5 0 1.2 1 1.9 1 3.2 0 0.6-0.3 1-0.7 1.3 1.3-0.2 2-1.4 2-2.7 0-1.3-0.5-2 0.3-2.9 0.9 1 1.3 2 1.3 3.1 0 1 -0.4 1.9-1 2.5 1.8-0.3 2.8-1.6 2.8-3.4 0-2.5-3-2.9-3.1-5.6z',
  );
  flame.setAttribute('fill', '#ffb800');
  flame.setAttribute('stroke', '#000');
  flame.setAttribute('stroke-width', '1.2');
  flame.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(flame);

  const diamond = document.createElementNS(NS, 'path');
  diamond.setAttribute('d', 'M12 9L4.5 13.5L12 22.5L19.5 13.5L12 9z');
  diamond.setAttribute('fill', '#ff006e');
  diamond.setAttribute('stroke', '#000');
  diamond.setAttribute('stroke-width', '1.6');
  diamond.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(diamond);

  const facet = document.createElementNS(NS, 'path');
  facet.setAttribute('d', 'M12 9L9 13.5L12 22.5L12 9z');
  facet.setAttribute('fill', '#ff4091');
  facet.setAttribute('stroke', '#000');
  facet.setAttribute('stroke-width', '1.2');
  facet.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(facet);

  return svg;
}

function ensureSharedStyle(): void {
  const ID = 'banger-icon-style';
  if (document.getElementById(ID)) return;
  const style = document.createElement('style');
  style.id = ID;
  style.textContent = `
    @keyframes banger-badge-shake {
      0%, 100% { transform: rotate(0deg) scale(1); }
      20% { transform: rotate(-10deg) scale(1.15); }
      40% { transform: rotate(10deg) scale(1.15); }
      60% { transform: rotate(-6deg) scale(1.1); }
      80% { transform: rotate(4deg) scale(1.05); }
    }
    @keyframes banger-badge-in {
      from { transform: scale(0) rotate(-180deg); opacity: 0; }
      to { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    [data-banger-button].banger-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      width: 26px;
      height: 26px;
      padding: 0;
      margin: 0;
      background: #0a0a0f;
      border: 2.5px solid #000;
      border-radius: 999px;
      cursor: pointer;
      display: grid;
      place-items: center;
      box-shadow: 2px 2px 0 #000;
      z-index: 10;
      animation: banger-badge-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    [data-banger-button].banger-badge:hover {
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0 #000;
    }
    [data-banger-button].banger-badge:hover svg {
      animation: banger-badge-shake 0.5s ease-in-out;
    }
    [data-banger-button].banger-badge:active {
      transform: translate(2px, 2px);
      box-shadow: 0 0 0 #000;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Injects the Banger badge at the top-right corner of the given avatar element.
 * Idempotent: a second call on the same host is a no-op.
 */
export function injectButton(avatar: Element, onClick: () => void): void {
  const host = avatar.parentElement as HTMLElement | null;
  if (!host) return;
  if (host.querySelector('[data-banger-button]')) return;

  ensureSharedStyle();

  // Avatar's parent needs to be a positioning context for our absolute badge.
  const position = getComputedStyle(host).position;
  if (position === 'static') {
    host.style.position = 'relative';
  }

  const btn = document.createElement('button');
  btn.setAttribute('data-banger-button', '');
  btn.classList.add('banger-badge');
  btn.type = 'button';
  btn.title = 'Banger — AI meme reply';
  btn.appendChild(buildFlamingDiamond());

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  });

  host.appendChild(btn);
}
