import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { FormEvent } from 'react';

import { SelectField } from '@/components/SelectField';
import { isSameNormalisedString } from '@/utils/common';

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
  const moveTargetOptions =
    action?.type === 'move'
      ? availableGroupNames
          .filter(group => !isSameNormalisedString(group, action.groupName))
          .map(group => ({ label: group, value: group }))
      : [];

  const targetGroupOptions =
    action?.type === 'delete'
      ? [
          { label: 'No Group', value: '' },
          ...availableGroupNames
            .filter(group => !isSameNormalisedString(group, action.groupName))
            .map(group => ({ label: group, value: group })),
        ]
      : [];

  const moveCandidateGroupNames =
    action?.type === 'delete'
      ? availableGroupNames.filter(group => !isSameNormalisedString(group, action.groupName))
      : [];

  const isSubmitDisabled =
    !action ||
    (action.type === 'rename' && !renameTarget.trim()) ||
    (action.type === 'move' && !moveTargetOptions.map(option => option.value).includes(moveTarget)) ||
    (action.type === 'delete' && deleteMode === 'move' && !['', ...moveCandidateGroupNames].includes(deleteMoveTarget));

  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pt-5 pb-4 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-md sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            {action && (
              <form onSubmit={onSubmit}>
                <div>
                  <DialogTitle as="h3" className="text-base font-semibold text-white">
                    {action.type === 'rename' && `Rename ${action.groupName}`}
                    {action.type === 'move' && `Move Rules From ${action.groupName}`}
                    {action.type === 'delete' && `Delete ${action.groupName}`}
                  </DialogTitle>

                  <div className="mt-4">
                    {action.type === 'rename' && (
                      <>
                        <label htmlFor="rename-group-name" className="block text-sm font-medium text-gray-300">
                          New group name
                        </label>
                        <input
                          id="rename-group-name"
                          type="text"
                          value={renameTarget}
                          onChange={event => onRenameTargetChange(event.target.value)}
                          className="mt-2 block w-full rounded-md bg-white/5 px-4 py-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple-600"
                          autoFocus
                        />

                        <label
                          htmlFor="rename-group-description"
                          className="mt-4 block text-sm font-medium text-gray-300"
                        >
                          Description (optional)
                        </label>
                        <input
                          id="rename-group-description"
                          type="text"
                          value={renameDescription}
                          onChange={event => onRenameDescriptionChange(event.target.value)}
                          className="mt-2 block w-full rounded-md bg-white/5 px-4 py-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple-600"
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
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-gray-100 inset-ring inset-ring-white/5 hover:bg-white/20 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="inline-flex justify-center rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {action.type === 'rename' && 'Save'}
                    {action.type === 'move' && 'Move Rules'}
                    {action.type === 'delete' && 'Delete Group'}
                  </button>
                </div>
              </form>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
