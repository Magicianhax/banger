import { handleSuggestRequest } from './orchestrator.js';
import { TweetContextSchema } from '@banger/shared';
import { z } from 'zod';

const SuggestMessageSchema = z.object({
  type: z.literal('suggest'),
  tweet: TweetContextSchema,
  sliderValue: z.number().min(0).max(100),
});

chrome.runtime.onMessage.addListener((rawMessage, _sender, sendResponse) => {
  const parsed = SuggestMessageSchema.safeParse(rawMessage);
  if (!parsed.success) {
    sendResponse({ ok: false, error: 'invalid message shape' });
    return false;
  }

  handleSuggestRequest({ tweet: parsed.data.tweet, sliderValue: parsed.data.sliderValue })
    .then((result) => sendResponse({ ok: true, result }))
    .catch((err) => sendResponse({ ok: false, error: (err as Error).message }));

  return true; // async response
});
