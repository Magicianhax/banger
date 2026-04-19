import { generateObject, type LanguageModel } from 'ai';
import { RerankResultSchema, type Candidate, type Intent, type RerankResult } from '@banger/shared';

export async function rerank(args: {
  model: LanguageModel;
  intent: Intent;
  tweetText: string;
  candidates: Candidate[];
}): Promise<RerankResult> {
  const { model, intent, tweetText, candidates } = args;

  const candidateList = candidates
    .slice(0, 60)
    .map((c) => `- ${c.id}: ${c.title} [${c.tags.slice(0, 4).join(', ')}]`)
    .join('\n');

  const { object } = await generateObject({
    model,
    schema: RerankResultSchema,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Tweet: ${tweetText}
Subject: ${intent.subject}
Tone: ${intent.emotional_tone}

Vibe fits:
- agree: ${intent.vibe_fits.agree}
- mock: ${intent.vibe_fits.mock}
- shocked: ${intent.vibe_fits.shocked}
- wholesome: ${intent.vibe_fits.wholesome}
- savage: ${intent.vibe_fits.savage}

Candidates:
${candidateList}`,
      },
    ],
    providerOptions: { openai: { reasoningEffort: 'minimal' } },
  });

  return object;
}

const SYSTEM_PROMPT = `You rank reaction GIFs for each of 5 vibe slots.
For each slot (agree, mock, shocked, wholesome, savage), pick the top 3 candidate IDs and assign a 0-10 fit score.
Prefer tight emotional match over literal keyword match.
At index 0 put the BEST match for the default (medium) intensity.
At index 1 put a MILDER alternate.
At index 2 put a MORE INTENSE alternate.
If candidates are weak, low scores are honest — do not inflate.`;
