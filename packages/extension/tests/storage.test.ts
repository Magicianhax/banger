import { describe, it, expect } from 'vitest';
import { getSettings, saveSettings, defaultSettings } from '../src/lib/storage.js';

describe('storage', () => {
  it('returns defaults when storage is empty', async () => {
    const s = await getSettings();
    expect(s.provider).toBeNull();
    expect(s.humorProfile.enabledSubcultures).toEqual([]);
    expect(s.installId).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('persists changes', async () => {
    const s = defaultSettings();
    s.provider = 'anthropic';
    s.apiKey = 'sk-test';
    await saveSettings(s);
    const loaded = await getSettings();
    expect(loaded.provider).toBe('anthropic');
    expect(loaded.apiKey).toBe('sk-test');
  });

  it('reuses the same installId across saves', async () => {
    const s1 = await getSettings();
    const s2 = await getSettings();
    expect(s1.installId).toBe(s2.installId);
  });
});
