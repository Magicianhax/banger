import { SettingsSchema, type Settings } from '@banger/shared';

const KEY = 'banger:settings:v1';

export function defaultSettings(): Settings {
  return {
    humorProfile: {
      styles: {
        darkVsWholesome: 0,
        absurdistVsObservational: 0,
        dryVsHyper: 0,
        politicalVsApolitical: 0,
      },
      enabledSubcultures: [],
      blocklist: [],
    },
    behavior: {
      sendImagesToLLM: true,
      logHistoryLocally: true,
    },
    installId: crypto.randomUUID(),
  };
}

export async function getSettings(): Promise<Settings> {
  const stored = await chrome.storage.local.get(KEY);
  const raw = stored[KEY];
  if (!raw) {
    const fresh = defaultSettings();
    await saveSettings(fresh);
    return fresh;
  }
  const parsed = SettingsSchema.safeParse(raw);
  if (!parsed.success) {
    const fresh = defaultSettings();
    await saveSettings(fresh);
    return fresh;
  }
  return parsed.data;
}

export async function saveSettings(settings: Settings): Promise<void> {
  SettingsSchema.parse(settings);
  await chrome.storage.local.set({ [KEY]: settings });
}

export async function clearSettings(): Promise<void> {
  await chrome.storage.local.remove(KEY);
}
