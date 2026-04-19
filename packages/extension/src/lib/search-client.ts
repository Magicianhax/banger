import { BACKEND_URL } from '../env.js';
import type { Suggestion, TweetContext } from '@banger/shared';

export type SuggestResult = {
  suggestions: Suggestion[];
  sensitive: boolean;
  latencyMs: number;
};

export async function fetchSuggestions(args: {
  tweet: TweetContext;
  sliderValue: number;
  installId: string;
  blocklist?: string[];
}): Promise<SuggestResult> {
  const res = await fetch(`${BACKEND_URL}/api/suggest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Install-Id': args.installId,
    },
    body: JSON.stringify({
      tweet: args.tweet,
      sliderValue: args.sliderValue,
      blocklist: args.blocklist,
      sendImages: true,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Suggest failed: ${res.status} ${body.slice(0, 200)}`);
  }
  return (await res.json()) as SuggestResult;
}
