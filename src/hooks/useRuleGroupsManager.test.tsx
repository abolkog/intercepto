import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { FormEvent } from 'react';

import useRuleGroupsManager from './useRuleGroupsManager';
import { getGroups, onGroupsChanged, addGroup, removeGroup, renameGroup } from '@/utils/groupsStorage';
import {
  deleteRulesInGroup,
  moveRulesToGroup,
  setRulesInGroupEnabled,
  setRulesInGroupNotifications,
} from '@/utils/ruleStorage';
import type { Group, Rule } from '@/types/rule';
import { mockRule as mockRuleData } from '@/test-utils/mockData';

vi.mock('@/utils/groupsStorage', () => ({
  getGroups: vi.fn(),
  onGroupsChanged: vi.fn(),
  addGroup: vi.fn(),
  removeGroup: vi.fn(),
  renameGroup: vi.fn(),
}));

vi.mock('@/utils/ruleStorage', () => ({
  moveRulesToGroup: vi.fn(),
  deleteRulesInGroup: vi.fn(),
  setRulesInGroupEnabled: vi.fn(),
  setRulesInGroupNotifications: vi.fn(),
}));

const mockRule = (overrides: Partial<Rule> = {}): Rule => ({
  ...mockRuleData,
  ...overrides,
});

describe('useRuleGroupsManager', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(onGroupsChanged).mockReturnValue(() => {});
  });

  it('merges groups from storage and rules, trims values, deduplicates, and sorts', async () => {
    vi.mocked(getGroups).mockResolvedValue([
      { name: ' Checkout ', description: ' Payment APIs ' },
      { name: '   ' },
    ] as Group[]);

    const rules = [
      mockRule({ id: 'r-1', group: 'checkout' }),
      mockRule({ id: 'r-2', group: 'Catalog' }),
      mockRule({ id: 'r-3', group: undefined }),
    ];

    const { result } = renderHook(() => useRuleGroupsManager({ rules }));

    await waitFor(() => {
      expect(result.current.availableGroupNames).toEqual(['Catalog', 'Checkout']);
    });

    expect(result.current.availableGroups).toEqual([
      { name: 'Catalog' },
      { name: 'Checkout', description: 'Payment APIs' },
    ]);
  });

  it('creates a group with trimmed name and resets dialog state', async () => {
    vi.mocked(getGroups).mockResolvedValue([]);

    const { result } = renderHook(() => useRuleGroupsManager({ rules: [] }));

    act(() => result.current.openNewGroupDialog());
    act(() => {
      result.current.newGroupDialogProps.onNameChange('  Payments  ');
      result.current.newGroupDialogProps.onDescriptionChange('Payment flows');
    });

    await act(async () => {
      result.current.newGroupDialogProps.onSubmit({ preventDefault: vi.fn() } as unknown as FormEvent);
    });

    expect(addGroup).toHaveBeenCalledWith('Payments', 'Payment flows');
    expect(result.current.newGroupDialogProps.open).toBe(false);
    expect(result.current.newGroupDialogProps.name).toBe('');
    expect(result.current.newGroupDialogProps.description).toBe('');
  });

  it('renames a group and moves rules to new name', async () => {
    vi.mocked(getGroups).mockResolvedValue([{ name: 'Checkout', description: 'Old desc' }] as Group[]);

    const { result } = renderHook(() =>
      useRuleGroupsManager({
        rules: [mockRule({ id: 'r-1', group: 'Checkout' }), mockRule({ id: 'r-2', group: 'Catalog' })],
      }),
    );

    await waitFor(() => {
      expect(result.current.availableGroups).toContainEqual({ name: 'Checkout', description: 'Old desc' });
    });

    act(() => result.current.openRenameGroup('Checkout'));
    expect(result.current.groupActionDialogProps.renameDescription).toBe('Old desc');

    act(() => {
      result.current.groupActionDialogProps.onRenameTargetChange('Payments');
      result.current.groupActionDialogProps.onRenameDescriptionChange('Payment APIs');
    });

    await act(async () => {
      result.current.groupActionDialogProps.onSubmit({ preventDefault: vi.fn() } as unknown as FormEvent);
    });

    expect(renameGroup).toHaveBeenCalledWith('Checkout', 'Payments', 'Payment APIs');
    expect(moveRulesToGroup).toHaveBeenCalledWith('Checkout', 'Payments');
  });

  it('deletes rules in group and removes group in delete mode', async () => {
    vi.mocked(getGroups).mockResolvedValue([{ name: 'Checkout' }] as Group[]);

    const { result } = renderHook(() => useRuleGroupsManager({ rules: [mockRule({ group: 'Checkout' })] }));

    act(() => result.current.openDeleteGroup('Checkout'));

    await act(async () => {
      result.current.groupActionDialogProps.onSubmit({ preventDefault: vi.fn() } as unknown as FormEvent);
    });

    expect(deleteRulesInGroup).toHaveBeenCalledWith('Checkout');
    expect(removeGroup).toHaveBeenCalledWith('Checkout');
  });

  it('delegates group toggle actions to storage helpers', async () => {
    vi.mocked(getGroups).mockResolvedValue([]);

    const { result } = renderHook(() => useRuleGroupsManager({ rules: [] }));

    await act(async () => {
      await result.current.onToggleGroupEnabled('Checkout', false);
      await result.current.onToggleGroupNotifications('Catalog', true);
    });

    expect(setRulesInGroupEnabled).toHaveBeenCalledWith('Checkout', false);
    expect(setRulesInGroupNotifications).toHaveBeenCalledWith('Catalog', true);
  });
});
