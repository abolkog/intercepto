import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import type { FormEvent, ReactNode } from 'react';

import Button from '@/components/ui/Button';

type GroupDialogShellProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  submitLabel: string;
  submitDisabled?: boolean;
  children: ReactNode;
};

export default function GroupDialogShell({
  open,
  title,
  onClose,
  onSubmit,
  submitLabel,
  submitDisabled = false,
  children,
}: GroupDialogShellProps) {
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
            <form onSubmit={onSubmit}>
              <div>
                <DialogTitle as="h3" className="text-base font-semibold text-white">
                  {title}
                </DialogTitle>
                <div className="mt-4">{children}</div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-x-3">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button disabled={submitDisabled} type="submit">
                  {submitLabel}
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
