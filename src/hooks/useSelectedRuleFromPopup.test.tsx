import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import useSelectedRuleFromPopup from './useSelectedRuleFromPopup';
import { INTERCEPTO_SELECTED_RULE_ID_KEY } from '@/constants';
import { type Rule } from '@/types/rule';
import { chromeMock } from '@/test-utils/chromeMock';

const mockRule = (overrides: Partial<Rule> = {}): Rule => ({
  id: 'r-1',
  name: 'Mock rule',
  enabled: true,
  showNotifications: true,
  urlMatch: '/test',
  method: 'GET',
  statusCode: 200,
  responseBody: '{}',
  createdAt: 1,
  updatedAt: 1,
  ...overrides,
});

describe('useSelectedRuleFromPopup', () => {
  beforeEach(() => {
    chromeMock.__reset();
    vi.restoreAllMocks();
  });

  it('consumes selected rule id on mount, selects the matching rule, and clears the key', async () => {
    const rules = [mockRule({ id: 'r-1' }), mockRule({ id: 'r-2', name: 'Second rule' })];
    const onSelectRule = vi.fn();

    await chrome.storage.local.set({ [INTERCEPTO_SELECTED_RULE_ID_KEY]: 'r-2' });

    renderHook(() => useSelectedRuleFromPopup({ rules, onSelectRule }));

    await waitFor(() => expect(onSelectRule).toHaveBeenCalledTimes(1));
    expect(onSelectRule).toHaveBeenCalledWith(expect.objectContaining({ id: 'r-2' }));

    const stored = await chrome.storage.local.get(INTERCEPTO_SELECTED_RULE_ID_KEY);
    expect(stored[INTERCEPTO_SELECTED_RULE_ID_KEY]).toBe('');
  });

  it('reacts to storage updates while mounted and does not reopen repeatedly', async () => {
    const rules = [mockRule({ id: 'r-1' })];
    const onSelectRule = vi.fn();

    renderHook(() => useSelectedRuleFromPopup({ rules, onSelectRule }));

    await chrome.storage.local.set({ [INTERCEPTO_SELECTED_RULE_ID_KEY]: 'r-1' });

    await waitFor(() => expect(onSelectRule).toHaveBeenCalledTimes(1));

    const stored = await chrome.storage.local.get(INTERCEPTO_SELECTED_RULE_ID_KEY);
    expect(stored[INTERCEPTO_SELECTED_RULE_ID_KEY]).toBe('');

    // No additional call should happen from the key-clear event.
    await Promise.resolve();
    expect(onSelectRule).toHaveBeenCalledTimes(1);
  });
});
