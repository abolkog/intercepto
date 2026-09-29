import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import useRuleEditor from './useRuleEditor';
import { addRule, updateRule } from '@/utils/ruleStorage';
import { mockRule as mockRuleData, mockRuleDraft } from '@/test-utils/mockData';

vi.mock('@/utils/ruleStorage', () => ({
  addRule: vi.fn(),
  updateRule: vi.fn(),
}));

describe('useRuleEditor', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('opens create mode with no editing rule', () => {
    const { result } = renderHook(() => useRuleEditor());

    act(() => result.current.openCreate());

    expect(result.current.isOpen).toBe(true);
    expect(result.current.editingRule).toBeUndefined();
  });

  it('opens edit mode with provided rule', () => {
    const { result } = renderHook(() => useRuleEditor());
    const rule = { ...mockRuleData, id: 'rule-42' };

    act(() => result.current.openEdit(rule));

    expect(result.current.isOpen).toBe(true);
    expect(result.current.editingRule).toEqual(rule);
  });

  it('saves create mode via addRule and closes form', async () => {
    const { result } = renderHook(() => useRuleEditor());

    act(() => result.current.openCreate());

    await act(async () => {
      await result.current.save(mockRuleDraft);
    });

    expect(addRule).toHaveBeenCalledWith(mockRuleDraft);
    expect(updateRule).not.toHaveBeenCalled();
    expect(result.current.isOpen).toBe(false);
  });

  it('saves edit mode via updateRule and closes form', async () => {
    const { result } = renderHook(() => useRuleEditor());

    act(() => result.current.openEdit({ ...mockRuleData, id: 'rule-edit' }));

    await act(async () => {
      await result.current.save(mockRuleDraft);
    });

    expect(updateRule).toHaveBeenCalledWith('rule-edit', mockRuleDraft);
    expect(addRule).not.toHaveBeenCalled();
    expect(result.current.isOpen).toBe(false);
  });

  it('closes form when close is called', () => {
    const { result } = renderHook(() => useRuleEditor());

    act(() => result.current.openCreate());
    expect(result.current.isOpen).toBe(true);

    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });
});
