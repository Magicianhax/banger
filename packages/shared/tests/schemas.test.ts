import { describe, it, expect } from 'vitest';
import { IntentSchema, SettingsSchema } from '../src/schemas.js';

describe('IntentSchema', () => {
  it('accepts a valid intent', () => {
    const input = {
      subject: 'dev is tired',
      emotional_tone: 'self-deprecating',
      subculture: 'tech',
      image_description: null,
      vibe_fits: {
        agree: 'same',
        mock: 'skill issue',
        shocked: 'jaw drop',
        wholesome: 'you got this',
        savage: 'get a real job',
      },
      avoid: ['political'],
      serious: false,
    };
    expect(() => IntentSchema.parse(input)).not.toThrow();
  });

  it('rejects missing vibe_fits', () => {
    const input = { subject: 'x', emotional_tone: 'y', subculture: null, image_description: null, avoid: [], serious: false };
    expect(() => IntentSchema.parse(input)).toThrow();
  });
});

describe('SettingsSchema', () => {
  it('accepts default-shaped settings', () => {
    const input = {
      humorProfile: {
        styles: { darkVsWholesome: 0, absurdistVsObservational: 0, dryVsHyper: 0, politicalVsApolitical: 0 },
        enabledSubcultures: [],
        blocklist: [],
      },
      behavior: { sendImagesToLLM: true, logHistoryLocally: true },
      installId: '11111111-1111-1111-1111-111111111111',
    };
    expect(() => SettingsSchema.parse(input)).not.toThrow();
  });

  it('rejects invalid installId (not a UUID)', () => {
    const input = {
      humorProfile: {
        styles: { darkVsWholesome: 0, absurdistVsObservational: 0, dryVsHyper: 0, politicalVsApolitical: 0 },
        enabledSubcultures: [],
        blocklist: [],
      },
      behavior: { sendImagesToLLM: true, logHistoryLocally: true },
      installId: 'not-a-uuid',
    };
    expect(() => SettingsSchema.parse(input)).toThrow();
  });
});
