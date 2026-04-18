import { generateObject } from 'ai';
import type { LanguageModel } from 'ai';
import { IntentSchema, type Intent, type TweetContext } from '@banger/shared';

type Args = {
  model: LanguageModel;
  tweet: TweetContext;
  sendImages: boolean;
};

export async function understand(args: Args): Promise<Intent> {
  const { model, tweet, sendImages } = args;

  const userParts: Array<
    | { type: 'text'; text: string }
    | { type: 'image'; image: string | URL }
  > = [
    {
      type: 'text',
      text: buildPrompt(tweet),
    },
  ];

  if (sendImages) {
    for (const url of tweet.imageUrls) {
      userParts.push({ type: 'image', image: url });
    }
  }

  const { object } = await generateObject({
    model,
    schema: IntentSchema,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userParts },
    ],
  });

  return object;
}

const SYSTEM_PROMPT = `You analyze tweets to help a user pick a reaction meme reply.
Output strict JSON matching the schema. Be concise in every field.
For each vibe slot (agree, mock, shocked, wholesome, savage), describe how a reply with that vibe would land for THIS tweet in one short sentence.
Set "serious" to true ONLY if the tweet is about grief, death, violence, breaking news, or similar — meme replies would be inappropriate.
Detect subculture conservatively; return null if unclear.`;

function buildPrompt(tweet: TweetContext): string {
  const parts: string[] = [
    `Tweet by ${tweet.authorHandle}:`,
    tweet.text,
  ];
  if (tweet.quotedTweet) parts.push(`Quoting: "${tweet.quotedTweet}"`);
  if (tweet.threadContext.length > 0) {
    parts.push('Thread context (oldest first):', ...tweet.threadContext);
  }
  return parts.join('\n');
}
