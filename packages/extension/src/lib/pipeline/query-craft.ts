import { generateObject, type LanguageModel } from 'ai';
import { QuerySetSchema, type Intent, type QuerySet } from '@banger/shared';

export async function craftQueries(args: {
  model: LanguageModel;
  intent: Intent;
}): Promise<QuerySet> {
  const { model, intent } = args;

  const { object } = await generateObject({
    model,
    schema: QuerySetSchema,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Tweet intent:
subject: ${intent.subject}
tone: ${intent.emotional_tone}
subculture: ${intent.subculture ?? 'none'}

Vibe fits:
- agree: ${intent.vibe_fits.agree}
- mock: ${intent.vibe_fits.mock}
- shocked: ${intent.vibe_fits.shocked}
- wholesome: ${intent.vibe_fits.wholesome}
- savage: ${intent.vibe_fits.savage}`,
      },
    ],
  });

  return object;
}

const SYSTEM_PROMPT = `You craft short search queries for GIPHY/Tenor to find reaction GIFs.
For each of the 5 vibe slots, return exactly 3 short queries (1-5 words each).
Queries should feel like how people describe GIFs: "skill issue", "jaw drop", "big mood".
Avoid literal keyword matching of the tweet subject — match the emotional reaction instead.`;
