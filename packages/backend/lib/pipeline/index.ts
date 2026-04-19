import { VIBE_SLOTS, type Candidate, type Suggestion, type TweetContext, type VibeSlot } from '@banger/shared';
import { getServerModel } from '../llm';
import { analyze } from './analyze';
import { retrieve } from './retrieve';
import { rerank } from './rerank';
import { applyProfileWeight } from './profile-weight';
import { pickBySlider } from './slider';

export type PipelineResult = {
  suggestions: Suggestion[];
  sensitive: boolean;
  latencyMs: number;
};

export async function runServerPipeline(args: {
  tweet: TweetContext;
  sliderValue: number;
  blocklist?: string[];
  sendImages?: boolean;
}): Promise<PipelineResult> {
  const start = performance.now();
  const model = getServerModel();

  const analyzed = await analyze({
    model,
    tweet: args.tweet,
    sendImages: args.sendImages ?? true,
  });

  if (analyzed.serious) {
    return { suggestions: [], sensitive: true, latencyMs: Math.round(performance.now() - start) };
  }

  const retrieved = await retrieve({ queries: analyzed.queries, perQueryLimit: 5 });
  const filtered = applyProfileWeight(retrieved, args.blocklist);
  const byId = new Map<string, Candidate>(filtered.map((c) => [c.id, c]));

  const reranked = await rerank({
    model,
    intent: analyzed,
    tweetText: args.tweet.text,
    candidates: filtered,
  });

  const suggestions: Suggestion[] = VIBE_SLOTS.map((slot: VibeSlot) => {
    const picks = reranked[slot];
    const alternates = picks
      .map((p) => byId.get(p.id))
      .filter((c): c is Candidate => c !== undefined);
    const chosen = pickBySlider(alternates, args.sliderValue);
    return {
      slot,
      candidate: chosen,
      score: picks[0]?.score ?? 0,
      alternates: alternates.filter((c) => c.id !== chosen.id),
    };
  });

  return { suggestions, sensitive: false, latencyMs: Math.round(performance.now() - start) };
}
