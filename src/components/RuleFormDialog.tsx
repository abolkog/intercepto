import { Rule, RuleDraft } from '@/types/rule';

import { Dialog, DialogPanel } from '@headlessui/react';
import RuleForm from './RuleForm';

type RuleFormProps = {
  initialRule?: Rule;
  onSave: (draft: RuleDraft) => void;
  onCancel: () => void;
  open: boolean;
};

export default function RuleFormDialog({ initialRule, onSave, onCancel, open }: RuleFormProps) {
  return (
    <Dialog open={open} onClose={onCancel} className="relative z-10">
      <div className="fixed inset-0" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-3xl transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
            >
              <RuleForm key={initialRule?.id ?? 'new'} initialRule={initialRule} onSave={onSave} onCancel={onCancel} />
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
