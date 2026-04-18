import { runPipeline, type PipelineResult } from '../lib/pipeline/index.js';
import { getSettings } from '../lib/storage.js';
import type { TweetContext } from '@banger/shared';

export async function handleSuggestRequest(args: {
  tweet: TweetContext;
  sliderValue: number;
}): Promise<PipelineResult> {
  const settings = await getSettings();
  return runPipeline({
    tweet: args.tweet,
    settings,
    sliderValue: args.sliderValue,
  });
}
