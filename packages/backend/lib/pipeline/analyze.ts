import { generateObject, type LanguageModel } from 'ai';
import { AnalyzedTweetSchema, type AnalyzedTweet, type TweetContext } from '@banger/shared';

type Args = {
  model: LanguageModel;
  tweet: TweetContext;
  sendImages: boolean;
};

/**
 * Fused Stage 1 + 2: in a SINGLE LLM call, extract tweet intent AND craft
 * per-slot search queries for GIPHY/Tenor. Replaces the old understand.ts
 * and query-craft.ts modules — cuts one network round-trip per reply.
 */
export async function analyze(args: Args): Promise<AnalyzedTweet> {
  const { model, tweet, sendImages } = args;

  const userParts: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = [
    { type: 'text', text: buildPrompt(tweet) },
  ];
  if (sendImages) {
    for (const url of tweet.imageUrls) {
      userParts.push({ type: 'image', image: url });
    }
  }

  const { object } = await generateObject({
    model,
    schema: AnalyzedTweetSchema,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userParts },
    ],
    // GPT-5 family defaults to medium reasoning which adds ~20-60s. We don't
    // need reasoning for structured extraction — force minimal.
    providerOptions: { openai: { reasoningEffort: 'minimal' } },
  });

  return object;
}

const SYSTEM_PROMPT = `You analyze a tweet to help a user pick a reaction meme reply, AND you generate GIPHY/Tenor search queries — all in one response.

Output strict JSON matching the schema. Be concise.

Fields:
- "subject": one-line description of what the tweet is about
- "emotional_tone": e.g. "self-deprecating", "outraged", "celebratory"
- "subculture": one of the allowed values, or null if unclear
- "image_description": brief description if images present, else null
- "vibe_fits": for each slot (agree, mock, shocked, wholesome, savage), one short sentence describing how a reply with that vibe would land
- "avoid": tags or categories to skip (e.g., "political", "nsfw")
- "serious": true ONLY if the tweet is about grief, death, violence, breaking news — cases where a meme reply is inappropriate
- "queries": for each of the 5 vibe slots, return EXACTLY 3 short search queries (1-5 words each) that describe the REACTION — not the tweet's subject. Think how people describe GIFs: "skill issue", "jaw drop", "big mood", "delete your account". Prefer emotional match over literal keyword match.`;

function buildPrompt(tweet: TweetContext): string {
  const parts: string[] = [`Tweet by ${tweet.authorHandle}:`, tweet.text];
  if (tweet.quotedTweet) parts.push(`Quoting: "${tweet.quotedTweet}"`);
  if (tweet.threadContext.length > 0) {
    parts.push('Thread context (oldest first):', ...tweet.threadContext);
  }
  return parts.join('\n');
}
