import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { DEFAULT_MODELS, type Provider } from '@banger/shared';

export type LLMConfig = {
  provider: Provider;
  apiKey: string;
  model: string | null;
};

// Derive the model type from one of the provider factories to avoid a direct
// dependency on @ai-sdk/provider (which is not listed in package.json).
type LanguageModel = ReturnType<ReturnType<typeof createAnthropic>>;

export function getModel(cfg: LLMConfig): LanguageModel {
  const modelId = cfg.model ?? DEFAULT_MODELS[cfg.provider];
  switch (cfg.provider) {
    case 'anthropic': {
      // Pass the direct-browser-access header so the SDK works in MV3 service workers.
      // In v3 there is no separate dangerouslyAllowBrowser flag — headers are the mechanism.
      const provider = createAnthropic({
        apiKey: cfg.apiKey,
        headers: { 'anthropic-dangerous-direct-browser-access': 'true' },
      });
      return provider(modelId);
    }
    case 'openai': {
      // @ai-sdk/openai v3 does not expose a dangerouslyAllowBrowser flag;
      // browser access is controlled via headers at the application level.
      const provider = createOpenAI({ apiKey: cfg.apiKey });
      return provider(modelId);
    }
    case 'google': {
      const provider = createGoogleGenerativeAI({ apiKey: cfg.apiKey });
      return provider(modelId);
    }
  }
}

export async function testConnection(
  cfg: LLMConfig,
): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const { generateText } = await import('ai');
  const start = performance.now();
  try {
    await generateText({
      model: getModel(cfg),
      prompt: 'Reply with just the word "ok".',
    });
    return { ok: true, latencyMs: Math.round(performance.now() - start) };
  } catch (err) {
    return { ok: false, latencyMs: 0, error: (err as Error).message };
  }
}
