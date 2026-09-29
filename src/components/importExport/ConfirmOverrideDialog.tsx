import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import Button from '../ui/Button';

type ConfirmOverrideDialogProps = {
  isOpen: boolean;
  onClose: VoidFunction;
  onConfirm: VoidFunction;
};

export default function ConfirmOverrideDialog({ isOpen, onClose, onConfirm }: ConfirmOverrideDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-20">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/70 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-20 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pt-5 pb-4 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div>
              <DialogTitle as="h3" className="text-base font-semibold text-white">
                Confirm override import
              </DialogTitle>
              <p className="mt-2 text-sm text-gray-300">
                This will delete all existing rules and groups before importing from the selected file. This action
                cannot be undone.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-end gap-x-3">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onConfirm} variant="danger">
                Delete everything and import
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
