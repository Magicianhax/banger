import { vi, beforeEach } from 'vitest';

const store = new Map<string, unknown>();
const mockStorage = {
  local: {
    get: vi.fn(async (keys?: string | string[] | null) => {
      if (!keys) return Object.fromEntries(store.entries());
      const arr = Array.isArray(keys) ? keys : [keys];
      return Object.fromEntries(arr.map((k) => [k, store.get(k)]));
    }),
    set: vi.fn(async (items: Record<string, unknown>) => {
      for (const [k, v] of Object.entries(items)) store.set(k, v);
    }),
    remove: vi.fn(async (keys: string | string[]) => {
      const arr = Array.isArray(keys) ? keys : [keys];
      for (const k of arr) store.delete(k);
    }),
    clear: vi.fn(async () => store.clear()),
  },
};

(globalThis as unknown as { chrome: { storage: typeof mockStorage } }).chrome = {
  storage: mockStorage,
};

beforeEach(() => {
  store.clear();
  document.body.replaceChildren();
});
