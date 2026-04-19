import { fetchSuggestions, type SuggestResult } from '../lib/search-client.js';
import { getSettings } from '../lib/storage.js';
import type { TweetContext } from '@banger/shared';

export async function handleSuggestRequest(args: {
  tweet: TweetContext;
  sliderValue: number;
}): Promise<SuggestResult> {
  const settings = await getSettings();
  return fetchSuggestions({
    tweet: args.tweet,
    sliderValue: args.sliderValue,
    installId: settings.installId,
    blocklist: settings.humorProfile.blocklist,
  });
}
