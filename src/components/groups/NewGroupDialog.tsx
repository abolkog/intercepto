import type { FormEvent } from 'react';

import GroupDialogShell from '@/components/groups/GroupDialogShell';
import { TextField } from '../ui/TextField';

type NewGroupDialogProps = {
  open: boolean;
  name: string;
  description: string;
  onClose: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
};

export default function NewGroupDialog({
  open,
  name,
  description,
  onClose,
  onNameChange,
  onDescriptionChange,
  onSubmit,
}: NewGroupDialogProps) {
  return (
    <GroupDialogShell
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="New Group"
      submitLabel="Save Group"
      submitDisabled={!name.trim()}
    >
      <TextField
        id="group-name"
        label="Group Name"
        value={name}
        placeholder="e.g. Checkout APIs"
        onChange={value => onNameChange(value)}
      />
      <TextField
        id="group-description"
        label="Description (optional)"
        value={description}
        placeholder="e.g. APIs related to checkout flow"
        onChange={value => onDescriptionChange(value)}
      />
    </GroupDialogShell>
  );
}
