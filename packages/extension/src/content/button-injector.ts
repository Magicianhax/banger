export function injectButton(toolbar: Element, onClick: () => void): void {
  if (toolbar.querySelector('[data-banger-button]')) return;

  const btn = document.createElement('button');
  btn.setAttribute('data-banger-button', '');
  btn.type = 'button';
  btn.title = 'Banger \u2014 AI meme reply';
  btn.textContent = '\u{1F525}';
  btn.style.cssText =
    'background:transparent;border:none;cursor:pointer;font-size:18px;padding:6px;opacity:0.7;';
  btn.addEventListener('mouseenter', () => (btn.style.opacity = '1'));
  btn.addEventListener('mouseleave', () => (btn.style.opacity = '0.7'));
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
