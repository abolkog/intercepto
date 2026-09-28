import { FormEvent, useEffect, useMemo, useState } from 'react';

import type { Group, Rule } from '@/types/rule';
import { isSameNormalisedString, normaliseString, trimString, trimToUndefined } from '@/utils/common';
import { addGroup, getGroups, onGroupsChanged, removeGroup, renameGroup } from '@/utils/groupsStorage';
import {
  deleteRulesInGroup,
  moveRulesToGroup,
  setRulesInGroupEnabled,
  setRulesInGroupNotifications,
} from '@/utils/ruleStorage';

export type GroupActionType = 'rename' | 'move' | 'delete';

export type GroupActionState = {
  type: GroupActionType;
  groupName: string;
};

type UseRuleGroupsManagerArgs = {
  rules: Rule[] | undefined;
};

export default function useRuleGroupsManager({ rules }: UseRuleGroupsManagerArgs) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const [groupAction, setGroupAction] = useState<GroupActionState | null>(null);
  const [renameTarget, setRenameTarget] = useState('');
  const [renameDescription, setRenameDescription] = useState('');
  const [moveTarget, setMoveTarget] = useState('');
  const [deleteMode, setDeleteMode] = useState<'delete' | 'move'>('delete');
  const [deleteMoveTarget, setDeleteMoveTarget] = useState('');

  useEffect(() => {
    getGroups().then(setGroups);
    return onGroupsChanged(setGroups);
  }, []);

  const availableGroups = useMemo(() => {
    const map = new Map<string, Group>();

    for (const group of groups) {
      const name = trimString(group.name);
      if (!name) continue;
      const key = normaliseString(name);
      map.set(key, { name, description: trimToUndefined(group.description) });
    }

    for (const rule of rules ?? []) {
      const name = trimToUndefined(rule.group);
      if (!name) continue;
      const key = normaliseString(name);
      if (!map.has(key)) {
        map.set(key, { name });
      }
    }

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [groups, rules]);

  const availableGroupNames = useMemo(() => availableGroups.map(group => group.name), [availableGroups]);

  const closeNewGroupDialog = () => {
    setIsGroupModalOpen(false);
    setNewGroupName('');
    setNewGroupDescription('');
  };

  const openNewGroupDialog = () => setIsGroupModalOpen(true);

  const handleCreateGroup = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = trimString(newGroupName);
    if (!trimmedName) return;

    await addGroup(trimmedName, newGroupDescription);
    closeNewGroupDialog();
  };

  const closeGroupActionDialog = () => {
    setGroupAction(null);
    setRenameTarget('');
    setRenameDescription('');
    setMoveTarget('');
    setDeleteMode('delete');
    setDeleteMoveTarget('');
  };

  const openRenameGroup = (groupName: string) => {
    setRenameTarget(groupName);
    setRenameDescription(
      availableGroups.find(group => isSameNormalisedString(group.name, groupName))?.description ?? '',
    );
    setGroupAction({ type: 'rename', groupName });
  };

  const openMoveGroupRules = (groupName: string) => {
    setMoveTarget('');
    setGroupAction({ type: 'move', groupName });
  };

  const openDeleteGroup = (groupName: string) => {
    setDeleteMode('delete');
    setDeleteMoveTarget('');
    setGroupAction({ type: 'delete', groupName });
  };

  const handleSubmitGroupAction = async (event: FormEvent) => {
    event.preventDefault();
    if (!groupAction) return;

    if (groupAction.type === 'rename') {
      const nextName = trimString(renameTarget);
      if (!nextName) return;
      await renameGroup(groupAction.groupName, nextName, renameDescription);
      await moveRulesToGroup(groupAction.groupName, nextName);
      closeGroupActionDialog();
      return;
    }

    if (groupAction.type === 'move') {
      const targetGroup = trimString(moveTarget);
      if (!targetGroup) return;

      const availableMoveTargets = availableGroupNames.filter(
        group => !isSameNormalisedString(group, groupAction.groupName),
      );
      if (!availableMoveTargets.includes(targetGroup)) return;

      await moveRulesToGroup(groupAction.groupName, targetGroup);
      closeGroupActionDialog();
      return;
    }

    if (deleteMode === 'delete') {
      await deleteRulesInGroup(groupAction.groupName);
    } else {
      await moveRulesToGroup(groupAction.groupName, trimToUndefined(deleteMoveTarget));
    }

    await removeGroup(groupAction.groupName);
    closeGroupActionDialog();
  };

  return {
    availableGroups,
    availableGroupNames,
    openNewGroupDialog,
    openRenameGroup,
    openMoveGroupRules,
    openDeleteGroup,
    onToggleGroupEnabled: (groupName: string, enabled: boolean) => setRulesInGroupEnabled(groupName, enabled),
    onToggleGroupNotifications: (groupName: string, showNotifications: boolean) =>
      setRulesInGroupNotifications(groupName, showNotifications),
    newGroupDialogProps: {
      open: isGroupModalOpen,
      name: newGroupName,
      description: newGroupDescription,
      onNameChange: setNewGroupName,
      onDescriptionChange: setNewGroupDescription,
      onSubmit: handleCreateGroup,
      onClose: closeNewGroupDialog,
    },
    groupActionDialogProps: {
      action: groupAction,
      open: !!groupAction,
      onClose: closeGroupActionDialog,
      onSubmit: handleSubmitGroupAction,
      renameTarget,
      renameDescription,
      moveTarget,
      deleteMode,
      deleteMoveTarget,
      availableGroupNames,
      onRenameTargetChange: setRenameTarget,
      onRenameDescriptionChange: setRenameDescription,
      onMoveTargetChange: setMoveTarget,
      onDeleteModeChange: setDeleteMode,
      onDeleteMoveTargetChange: setDeleteMoveTarget,
    },
  };
}
