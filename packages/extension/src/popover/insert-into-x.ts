export function insertIntoReply(textareaEl: HTMLElement, url: string): void {
  textareaEl.focus();
  const sel = window.getSelection();
  if (!sel) return;
  sel.selectAllChildren(textareaEl);
  sel.collapseToEnd();
  document.execCommand('insertText', false, ` ${url} `);
  const inputEvent = new InputEvent('input', { bubbles: true, inputType: 'insertText', data: url });
  textareaEl.dispatchEvent(inputEvent);
}
