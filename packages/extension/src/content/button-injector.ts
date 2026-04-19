// SVG flaming diamond — drawn with DOM APIs so there's no innerHTML / HTML parsing.
function buildFlamingDiamond(): SVGSVGElement {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '22');
  svg.setAttribute('height', '22');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.display = 'block';

  // Flame tail (amber, behind diamond)
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

  // Diamond body (pink fill, black outline)
  const diamond = document.createElementNS(NS, 'path');
  diamond.setAttribute('d', 'M12 9L4.5 13.5L12 22.5L19.5 13.5L12 9z');
  diamond.setAttribute('fill', '#ff006e');
  diamond.setAttribute('stroke', '#000');
  diamond.setAttribute('stroke-width', '1.6');
  diamond.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(diamond);

  // Diamond highlight facet
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
    @keyframes banger-shake {
      0%, 100% { transform: rotate(0deg) scale(1); }
      20% { transform: rotate(-8deg) scale(1.12); }
      40% { transform: rotate(8deg) scale(1.12); }
      60% { transform: rotate(-6deg) scale(1.1); }
      80% { transform: rotate(4deg) scale(1.05); }
    }
    [data-banger-button] {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      transition: background 0.15s;
    }
    [data-banger-button]:hover {
      background: rgba(255, 0, 110, 0.1);
    }
    [data-banger-button]:hover svg {
      animation: banger-shake 0.5s ease-in-out;
    }
  `;
  document.head.appendChild(style);
}

export function injectButton(toolbar: Element, onClick: () => void): void {
  if (toolbar.querySelector('[data-banger-button]')) return;
  ensureSharedStyle();

  const btn = document.createElement('button');
  btn.setAttribute('data-banger-button', '');
  btn.type = 'button';
  btn.title = 'Banger — AI meme reply';

  btn.appendChild(buildFlamingDiamond());

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  });

  const gifBtn = toolbar.querySelector('[data-testid="gifSearchButton"]');
  if (gifBtn?.parentElement) {
    gifBtn.parentElement.insertBefore(btn, gifBtn.nextSibling);
  } else {
    toolbar.appendChild(btn);
  }
}
