import { describe, it, expect } from 'vitest';
import { getModel } from '../src/lib/llm.js';

describe('getModel', () => {
  it('returns a model for anthropic', () => {
    const m = getModel({ provider: 'anthropic', apiKey: 'sk-test', model: null });
    expect(m).toBeDefined();
  });

  it('returns a model for openai', () => {
    const m = getModel({ provider: 'openai', apiKey: 'sk-test', model: null });
    expect(m).toBeDefined();
  });

  it('returns a model for google', () => {
    const m = getModel({ provider: 'google', apiKey: 'g-test', model: null });
    expect(m).toBeDefined();
  });

  it('uses custom model when provided', () => {
    const m = getModel({
      provider: 'anthropic',
      apiKey: 'sk-test',
      model: 'claude-sonnet-4-6',
    });
    expect(m).toBeDefined();
  });
});
