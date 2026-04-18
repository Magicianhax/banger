export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type ReplyBoxContext = {
  element: Element;
  tweetId: string;
  textareaEl: HTMLElement;
};
