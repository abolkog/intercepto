import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

type ImportSuccessDialogProps = {
  isOpen: boolean;
  onClose: VoidFunction;
  onConfirm: VoidFunction;
};

export default function ImportSuccessDialog({ isOpen, onClose, onConfirm }: ImportSuccessDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pt-5 pb-4 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div>
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-500/10">
                <CheckIcon aria-hidden="true" className="size-6 text-green-400" />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <DialogTitle as="h3" className="text-base font-semibold text-white">
                  Import successful
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">Rules imported successfully</p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <Button className="w-full" onClick={onConfirm}>
                Go back to Rules Page
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
