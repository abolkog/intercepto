import type { CapturedRequest, CapturedRequestDraft } from '@/types/capture';
import { generateId } from './id';

export const CAPTURED_REQUESTS_STORAGE_KEY = 'intercepto_captured_requests';
const MAX_CAPTURED_REQUESTS = 200;

export async function getCapturedRequests(): Promise<CapturedRequest[]> {
  const data = await chrome.storage.local.get(CAPTURED_REQUESTS_STORAGE_KEY);
  const entries = (data[CAPTURED_REQUESTS_STORAGE_KEY] as CapturedRequest[] | undefined) ?? [];

  return entries.sort((a, b) => b.capturedAt - a.capturedAt);
}

export async function addCapturedRequest(draft: CapturedRequestDraft): Promise<CapturedRequest> {
  const requests = await getCapturedRequests();
  const next: CapturedRequest = {
    ...draft,
    id: generateId(),
  };

  await chrome.storage.local.set({
    [CAPTURED_REQUESTS_STORAGE_KEY]: [next, ...requests].slice(0, MAX_CAPTURED_REQUESTS),
  });

  return next;
}

export async function clearCapturedRequests(): Promise<void> {
  await chrome.storage.local.set({ [CAPTURED_REQUESTS_STORAGE_KEY]: [] });
}

export function onCapturedRequestsChanged(callback: (requests: CapturedRequest[]) => void): () => void {
  const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
    if (areaName !== 'local' || !changes[CAPTURED_REQUESTS_STORAGE_KEY]) return;
    callback((changes[CAPTURED_REQUESTS_STORAGE_KEY].newValue as CapturedRequest[] | undefined) ?? []);
  };

  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
