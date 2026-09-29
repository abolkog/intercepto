import { FormEvent } from 'react';

import GroupDialogShell from '@/components/groups/GroupDialogShell';
import { SelectField } from '@/components/ui/SelectField';
import { isSameNormalisedString } from '@/utils/common';
import { TextField } from '../ui/TextField';

export type GroupActionType = 'rename' | 'move' | 'delete';

export type GroupActionState = {
  type: GroupActionType;
  groupName: string;
};

type GroupActionDialogProps = {
  action: GroupActionState | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  renameTarget: string;
  renameDescription: string;
  moveTarget: string;
  deleteMode: 'delete' | 'move';
  deleteMoveTarget: string;
  availableGroupNames: string[];
  onRenameTargetChange: (value: string) => void;
  onRenameDescriptionChange: (value: string) => void;
  onMoveTargetChange: (value: string) => void;
  onDeleteModeChange: (value: 'delete' | 'move') => void;
  onDeleteMoveTargetChange: (value: string) => void;
};

export default function GroupActionDialog({
  action,
  open,
  onClose,
  onSubmit,
  renameTarget,
  renameDescription,
  moveTarget,
  deleteMode,
  deleteMoveTarget,
  availableGroupNames,
  onRenameTargetChange,
  onRenameDescriptionChange,
  onMoveTargetChange,
  onDeleteModeChange,
  onDeleteMoveTargetChange,
}: GroupActionDialogProps) {
  if (!action) return null;

  const moveTargetOptions =
    action.type === 'move'
      ? availableGroupNames
          .filter(group => !isSameNormalisedString(group, action.groupName))
          .map(group => ({ label: group, value: group }))
      : [];

  const targetGroupOptions =
    action.type === 'delete'
      ? [
          { label: 'No Group', value: '' },
          ...availableGroupNames
            .filter(group => !isSameNormalisedString(group, action.groupName))
            .map(group => ({ label: group, value: group })),
        ]
      : [];

  const moveCandidateGroupNames =
    action.type === 'delete'
      ? availableGroupNames.filter(group => !isSameNormalisedString(group, action.groupName))
      : [];

  const isSubmitDisabled =
    (action.type === 'rename' && !renameTarget.trim()) ||
    (action.type === 'move' && !moveTargetOptions.map(option => option.value).includes(moveTarget)) ||
    (action.type === 'delete' && deleteMode === 'move' && !['', ...moveCandidateGroupNames].includes(deleteMoveTarget));

  const title =
    action.type === 'rename'
      ? `Rename ${action.groupName}`
      : action.type === 'move'
        ? `Move Rules From ${action.groupName}`
        : `Delete ${action.groupName}`;

  const submitLabel = action.type === 'rename' ? 'Save' : action.type === 'move' ? 'Move Rules' : 'Delete Group';

  return (
    <GroupDialogShell
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={title}
      submitLabel={submitLabel}
      submitDisabled={isSubmitDisabled}
    >
      {action.type === 'rename' && (
        <>
          <TextField
            id="rename-group-name"
            value={renameTarget}
            onChange={value => onRenameTargetChange(value)}
            label="New group name"
            autoFocus
          />
          <TextField
            id="rename-group-description"
            value={renameDescription}
            onChange={value => onRenameDescriptionChange(value)}
            label="Description (optional)"
            placeholder="e.g. APIs related to checkout flow"
          />
        </>
      )}

      {action.type === 'move' && (
        <>
          <p className="mb-2 text-sm text-gray-400">Move all rules in this group to:</p>
          <SelectField
            id="move-group-target"
            label="Target Group"
            value={moveTarget}
            onChange={onMoveTargetChange}
            options={moveTargetOptions}
          />
          {moveTargetOptions.length === 0 && (
            <p className="mt-2 text-xs text-gray-500">No existing groups available to move rules into.</p>
          )}
        </>
      )}

      {action.type === 'delete' && (
        <>
          <p className="text-sm text-gray-300">Choose what to do with rules in this group:</p>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2 text-sm text-gray-200">
              <input
                type="radio"
                name="delete-group-mode"
                value="move"
                checked={deleteMode === 'move'}
                onChange={() => onDeleteModeChange('move')}
                className="accent-purple-500"
              />
              Move rules to a new group
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-200">
              <input
                type="radio"
                name="delete-group-mode"
                value="delete"
                checked={deleteMode === 'delete'}
                onChange={() => onDeleteModeChange('delete')}
                className="accent-purple-500"
              />
              Delete rules in this group
            </label>
          </div>

          {deleteMode === 'move' && (
            <div className="mt-4">
              <SelectField
                id="delete-group-target"
                label="Target Group"
                value={deleteMoveTarget}
                onChange={onDeleteMoveTargetChange}
                options={targetGroupOptions}
              />
              {moveCandidateGroupNames.length === 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  No existing groups available. Choose No Group, or choose delete rules.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </GroupDialogShell>
  );
}
