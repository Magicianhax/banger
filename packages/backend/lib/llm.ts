import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { Provider } from '@banger/shared';

const PROVIDER = (process.env.LLM_PROVIDER ?? 'openai') as Provider;
const MODEL = process.env.LLM_MODEL ?? defaultModelFor(PROVIDER);

function defaultModelFor(p: Provider): string {
  switch (p) {
    case 'openai': return 'gpt-5';
    case 'anthropic': return 'claude-haiku-4-5-20251001';
    case 'google': return 'gemini-3-flash';
  }
}

// Derive the model type from one of the provider factories to avoid a direct
// dependency on @ai-sdk/provider (which is not listed in package.json).
type LanguageModel = ReturnType<ReturnType<typeof createAnthropic>>;

export function getServerModel(): LanguageModel {
  switch (PROVIDER) {
    case 'openai': {
      const key = process.env.OPENAI_API_KEY;
      if (!key) throw new Error('OPENAI_API_KEY not set');
      return createOpenAI({ apiKey: key })(MODEL);
    }
    case 'anthropic': {
      const key = process.env.ANTHROPIC_API_KEY;
      if (!key) throw new Error('ANTHROPIC_API_KEY not set');
      return createAnthropic({ apiKey: key })(MODEL);
    }
    case 'google': {
      const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      if (!key) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not set');
      return createGoogleGenerativeAI({ apiKey: key })(MODEL);
    }
  }
}
