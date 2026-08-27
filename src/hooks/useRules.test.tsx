import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import useRules from './useRules';
import { getRules, onRulesChanged, setRuleEnabled, addRule } from '@/utils/ruleStorage';
import { Rule } from '@/types/rule';

vi.mock('@/utils/ruleStorage', () => ({
  getRules: vi.fn(),
  onRulesChanged: vi.fn(),
  setRuleEnabled: vi.fn(),
  addRule: vi.fn(),
}));

const mockRule = (overrides: Partial<Rule> = {}): Rule => ({
  id: '1',
  name: 'Mock Rule',
  enabled: true,
  showNotifications: false,
  urlMatch: '/cart',
  method: 'GET',
  statusCode: 200,
  responseBody: '{}',
  createdAt: 1000,
  updatedAt: 1000,
  ...overrides,
});

describe('useRules', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(onRulesChanged).mockReturnValue(() => {});
  });

  it('loads rules from getRules on mount', async () => {
    const rules = [mockRule({ id: '1' }), mockRule({ id: '2', enabled: false })];
    vi.mocked(getRules).mockResolvedValue(rules);

    const { result } = renderHook(() => useRules());

    await waitFor(() => expect(result.current.rules).toEqual(rules));
  });

  it('computes activeRulesCount from enabled rules', async () => {
    const rules = [
      mockRule({ id: '1', enabled: true }),
      mockRule({ id: '2', enabled: false }),
      mockRule({ id: '3', enabled: true }),
    ];
    vi.mocked(getRules).mockResolvedValue(rules);

    const { result } = renderHook(() => useRules());

    await waitFor(() => expect(result.current.rules).toEqual(rules));
    expect(result.current.activeRulesCount).toBe(2);
  });

  it('subscribes via onRulesChanged and updates rules when it fires', async () => {
    vi.mocked(getRules).mockResolvedValue([]);
    let emit: (rules: Rule[]) => void = () => {};
    vi.mocked(onRulesChanged).mockImplementation(cb => {
      emit = cb;
      return () => {};
    });

    const { result } = renderHook(() => useRules());
    await waitFor(() => expect(result.current.rules).toEqual([]));

    const pushed = [mockRule({ id: 'x' })];
    act(() => emit(pushed));

    expect(result.current.rules).toEqual(pushed);
  });

  it('toggles the matching rule and calls setRuleEnabled', async () => {
    const rules = [mockRule({ id: '1', enabled: false }), mockRule({ id: '2', enabled: true })];
    vi.mocked(getRules).mockResolvedValue(rules);
    vi.mocked(setRuleEnabled).mockResolvedValue(undefined);

    const { result } = renderHook(() => useRules());
    await waitFor(() => expect(result.current.rules).toEqual(rules));

    await act(async () => {
      await result.current.toggleRule(rules[0], true);
    });

    expect(result.current.rules?.find(r => r.id === '1')?.enabled).toBe(true);
    expect(result.current.rules?.find(r => r.id === '2')?.enabled).toBe(true); // unchanged
    expect(setRuleEnabled).toHaveBeenCalledWith('1', true);
  });

  it('duplicateRule calls addRule with a draft copy, prefixed name, and no id/timestamps', async () => {
    vi.mocked(getRules).mockResolvedValue([]);

    const { result } = renderHook(() => useRules());
    await waitFor(() => expect(result.current.rules).toEqual([]));

    const original = mockRule({ id: 'abc', name: 'Original', createdAt: 111, updatedAt: 222 });

    await act(async () => {
      await result.current.duplicateRule(original);
    });

    expect(addRule).toHaveBeenCalledTimes(1);
    const draftArg = vi.mocked(addRule).mock.calls[0][0];

    expect(draftArg).toEqual({
      name: 'Copy of Original',
      enabled: original.enabled,
      showNotifications: original.showNotifications,
      urlMatch: original.urlMatch,
      method: original.method,
      statusCode: original.statusCode,
      responseBody: original.responseBody,
    });
    expect(draftArg).not.toHaveProperty('id');
    expect(draftArg).not.toHaveProperty('createdAt');
    expect(draftArg).not.toHaveProperty('updatedAt');
  });
});
