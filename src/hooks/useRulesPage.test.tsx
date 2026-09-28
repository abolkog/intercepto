import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { FormEvent } from 'react';

import useRulesPage from './useRulesPage';
import useRules from './useRules';
import { getGroups, onGroupsChanged, addGroup, removeGroup, renameGroup } from '@/utils/groupsStorage';
import {
  addRule,
  updateRule,
  deleteRulesInGroup,
  moveRulesToGroup,
  setRulesInGroupEnabled,
  setRulesInGroupNotifications,
} from '@/utils/ruleStorage';
import type { Rule, RuleDraft, Group } from '@/types/rule';
import { mockRule as mockRuleData, mockRuleDraft } from '@/test-utils/mockData';

vi.mock('./useRules', () => ({
  default: vi.fn(),
}));

vi.mock('@/hooks/useSelectedRuleFromPopup', () => ({
  default: vi.fn(),
}));

vi.mock('@/utils/groupsStorage', () => ({
  getGroups: vi.fn(),
  onGroupsChanged: vi.fn(),
  addGroup: vi.fn(),
  removeGroup: vi.fn(),
  renameGroup: vi.fn(),
}));

vi.mock('@/utils/ruleStorage', () => ({
  addRule: vi.fn(),
  updateRule: vi.fn(),
  deleteRule: vi.fn(),
  moveRulesToGroup: vi.fn(),
  deleteRulesInGroup: vi.fn(),
  setRulesInGroupEnabled: vi.fn(),
  setRulesInGroupNotifications: vi.fn(),
}));

const mockRule = (overrides: Partial<Rule> = {}): Rule => ({
  ...mockRuleData,
  ...overrides,
});

describe('useRulesPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useRules).mockReturnValue({
      rules: [mockRule({ id: 'r-1', group: 'Checkout' }), mockRule({ id: 'r-2', group: 'Catalog' })],
      toggleRule: vi.fn(),
      duplicateRule: vi.fn(),
      activeRulesCount: 2,
    });
    vi.mocked(getGroups).mockResolvedValue([{ name: 'Checkout' }, { name: 'Catalog' }] as Group[]);
    vi.mocked(onGroupsChanged).mockReturnValue(() => {});
  });

  it('creates group with description from new group dialog submit', async () => {
    const { result } = renderHook(() => useRulesPage());

    await waitFor(() => {
      expect(result.current.newGroupDialogProps.open).toBe(false);
    });

    act(() => result.current.openNewGroupDialog());
    act(() => result.current.newGroupDialogProps.onNameChange('Payments'));
    act(() => result.current.newGroupDialogProps.onDescriptionChange('Payment flows'));

    await act(async () => {
      result.current.newGroupDialogProps.onSubmit({ preventDefault: vi.fn() } as unknown as FormEvent);
    });

    expect(addGroup).toHaveBeenCalledWith('Payments', 'Payment flows');
  });

  it('calls group-level bulk toggle actions', async () => {
    const { result } = renderHook(() => useRulesPage());

    await waitFor(() => {
      expect(result.current.rulesListProps.groups).toHaveLength(2);
    });

    await act(async () => {
      await result.current.rulesListProps.onToggleGroupEnabled?.('Checkout', false);
    });
    expect(setRulesInGroupEnabled).toHaveBeenCalledWith('Checkout', false);

    await act(async () => {
      await result.current.rulesListProps.onToggleGroupNotifications?.('Catalog', true);
    });
    expect(setRulesInGroupNotifications).toHaveBeenCalledWith('Catalog', true);
  });

  it('handles move action using selected existing target group', async () => {
    const { result } = renderHook(() => useRulesPage());

    await waitFor(() => {
      expect(result.current.groupActionDialogProps.availableGroupNames).toEqual(['Catalog', 'Checkout']);
    });

    act(() => result.current.rulesListProps.onMoveGroupRules?.('Checkout'));
    act(() => result.current.groupActionDialogProps.onMoveTargetChange('Catalog'));

    await act(async () => {
      result.current.groupActionDialogProps.onSubmit({ preventDefault: vi.fn() } as unknown as FormEvent);
    });

    expect(moveRulesToGroup).toHaveBeenCalledWith('Checkout', 'Catalog');
  });

  it('routes save to addRule or updateRule based on edit mode', async () => {
    const { result } = renderHook(() => useRulesPage());
    const draft: RuleDraft = { ...mockRuleDraft, group: 'Checkout' };

    await act(async () => {
      await result.current.ruleFormDialogProps.onSave(draft);
    });
    expect(addRule).toHaveBeenCalledWith(draft);

    act(() => result.current.openRulesForm(mockRule({ id: 'rule-edit', group: 'Checkout' })));

    await act(async () => {
      await result.current.ruleFormDialogProps.onSave(draft);
    });
    expect(updateRule).toHaveBeenCalledWith('rule-edit', draft);
  });

  it('handles delete-group action and removes group', async () => {
    const { result } = renderHook(() => useRulesPage());

    await waitFor(() => {
      expect(result.current.groupActionDialogProps.availableGroupNames).toEqual(['Catalog', 'Checkout']);
    });

    act(() => result.current.rulesListProps.onDeleteGroup?.('Checkout'));

    await act(async () => {
      result.current.groupActionDialogProps.onSubmit({ preventDefault: vi.fn() } as unknown as FormEvent);
    });

    expect(deleteRulesInGroup).toHaveBeenCalledWith('Checkout');
    expect(removeGroup).toHaveBeenCalledWith('Checkout');
  });

  it('handles rename-group action and moves rules to new name', async () => {
    const { result } = renderHook(() => useRulesPage());

    await waitFor(() => {
      expect(result.current.groupActionDialogProps.availableGroupNames).toEqual(['Catalog', 'Checkout']);
    });

    act(() => result.current.rulesListProps.onRenameGroup?.('Checkout'));
    act(() => result.current.groupActionDialogProps.onRenameTargetChange('Payments'));
    act(() => result.current.groupActionDialogProps.onRenameDescriptionChange('Payment APIs'));

    await act(async () => {
      result.current.groupActionDialogProps.onSubmit({ preventDefault: vi.fn() } as unknown as FormEvent);
    });

    expect(renameGroup).toHaveBeenCalledWith('Checkout', 'Payments', 'Payment APIs');
    expect(moveRulesToGroup).toHaveBeenCalledWith('Checkout', 'Payments');
  });
});
