export const VIBE_SLOTS = ['agree', 'mock', 'shocked', 'wholesome', 'savage'] as const;
export type VibeSlot = (typeof VIBE_SLOTS)[number];

export const SUBCULTURES = [
  'tech',
  'crypto',
  'anime',
  'sports',
  'music',
  'politics',
  'corporate-safe',
  'unhinged',
  'gaming',
  'film-tv',
  'football',
] as const;
export type Subculture = (typeof SUBCULTURES)[number];

export const PROVIDERS = ['anthropic', 'openai', 'google'] as const;
export type Provider = (typeof PROVIDERS)[number];

export const DEFAULT_MODELS: Record<Provider, string> = {
  anthropic: 'claude-haiku-4-5-20251001',
  openai: 'gpt-5-nano',
  google: 'gemini-3-flash',
};

export const MODEL_OPTIONS: Record<Provider, string[]> = {
  anthropic: ['claude-haiku-4-5-20251001', 'claude-sonnet-4-6', 'claude-opus-4-7'],
  openai: ['gpt-5-nano', 'gpt-5', 'gpt-5-turbo'],
  google: ['gemini-3-flash', 'gemini-3-pro', 'gemini-3-pro-deep-think'],
};
