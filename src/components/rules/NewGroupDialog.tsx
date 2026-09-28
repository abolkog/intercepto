import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { FormEvent } from 'react';

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
                  New Group
                </DialogTitle>
                <div className="mt-4">
                  <label htmlFor="group-name" className="block text-sm font-medium text-gray-300">
                    Group name
                  </label>
                  <input
                    id="group-name"
                    type="text"
                    value={name}
                    onChange={event => onNameChange(event.target.value)}
                    className="mt-2 block w-full rounded-md bg-white/5 px-4 py-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple-600"
                    placeholder="e.g. Checkout APIs"
                    autoFocus
                  />

                  <label htmlFor="group-description" className="mt-4 block text-sm font-medium text-gray-300">
                    Description (optional)
                  </label>
                  <input
                    id="group-description"
                    type="text"
                    value={description}
                    onChange={event => onDescriptionChange(event.target.value)}
                    className="mt-2 block w-full rounded-md bg-white/5 px-4 py-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple-600"
                    placeholder="e.g. APIs related to checkout flow"
                  />
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
                  disabled={!name.trim()}
                  className="inline-flex justify-center rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Group
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
