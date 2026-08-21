type StorageChanges = Record<string, { oldValue?: unknown; newValue?: unknown }>;
type ChangeListener = (changes: StorageChanges, areaName: string) => void;

function createChromeMock() {
  let store: Record<string, unknown> = {};
  const listeners: ChangeListener[] = [];

  return {
    storage: {
      local: {
        get: async (key: string) => ({ [key]: store[key] }),
        set: async (items: Record<string, unknown>) => {
          const changes: StorageChanges = {};
          for (const [k, v] of Object.entries(items)) {
            changes[k] = { oldValue: store[k], newValue: v };
            store[k] = v;
          }
          listeners.forEach(listener => listener(changes, 'local'));
        },
      },
      onChanged: {
        addListener: (listener: ChangeListener) => listeners.push(listener),
        removeListener: (listener: ChangeListener) => {
          const index = listeners.indexOf(listener);
          if (index >= 0) listeners.splice(index, 1);
        },
      },
    },
    action: {
      setBadgeText: async () => undefined,
      setBadgeBackgroundColor: async () => undefined,
    },
    runtime: {
      openOptionsPage: () => undefined,
      onInstalled: { addListener: () => undefined },
      onStartup: { addListener: () => undefined },
    },
    __reset: () => {
      store = {};
      listeners.length = 0;
    },
  };
}

export const chromeMock = createChromeMock();

// Expose the mock as the global chrome extension API for node-based unit tests.
globalThis.chrome = chromeMock as unknown as typeof chrome;

export type ChromeMock = typeof chromeMock;
