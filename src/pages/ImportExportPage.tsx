import { useState, useRef, DragEvent, ChangeEvent, SubmitEvent } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { exportRules, importRules } from '@/utils/ruleTransfer';
import { DocumentTextIcon, ArrowUpTrayIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { clx } from '@/utils/common';
import { useNavigate } from 'react-router';

export default function ImportExportPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleExport = async (): Promise<void> => {
    try {
      await exportRules();
    } catch (err) {
      console.error('Failed to export rules', err);
    }
  };

  const handleDrag = (e: DragEvent<HTMLFormElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLFormElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFiles(Array.from(e.target.files));
    }
  };

  const resetForm = (): void => {
    setFiles([]);
    setImportErrors([]);
    setDragActive(false);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleCancel = (): void => {
    resetForm();
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const file = files[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const { errors } = await importRules(file);
      setImportErrors(errors);

      if (!errors || errors.length === 0) {
        setFiles([]);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
      setDialogOpen(true);
    } catch (err) {
      console.error('Failed to import rules', err);
    } finally {
      setIsImporting(false);
    }
  };

  const postImportSuccess = () => {
    resetForm();
    setDialogOpen(false);
    navigate('/');
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base/7 font-semibold text-white">Import/Export Rules</h2>
            <p className="mt-1 text-sm/6 text-gray-400">Export or Import Rules</p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 cursor-pointer"
          >
            Export Rules
            <ArrowUpTrayIcon aria-hidden="true" className="-mr-0.5 size-5" />
          </button>
        </div>

        <form
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onSubmit={handleSubmit}
        >
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="file-upload" className="block text-sm/6 font-medium text-white">
                Import Rules
              </label>
              <div
                className={clx(
                  dragActive ? 'border-purple-700 bg-purple-50' : 'border-white/25 ',
                  'mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10',
                )}
              >
                <div className="text-center">
                  <DocumentTextIcon aria-hidden="true" className="mx-auto size-12 text-gray-600" />
                  <div className="mt-4 flex text-sm/6 text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        className="sr-only"
                        ref={inputRef}
                        type="file"
                        accept=".json"
                        onChange={handleChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs/5 text-gray-400">.json files only</p>
                </div>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-20 text-white">
              <h4>Selected File:</h4>
              <ul className="list-none pl-2 py-2">
                {files.map((file, idx) => (
                  <li key={idx} className="flex flex-row gap-2 items-center text-purple-300">
                    <DocumentTextIcon className="size-4" />
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}

          {importErrors.length > 0 && (
            <div className="rounded-md bg-red-500/15 p-4 outline outline-red-500/25 mt-2">
              <div className="flex">
                <div className="shrink-0">
                  <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-200">Some rules could not be imported</h3>
                  <div className="mt-2 text-sm text-red-200/80">
                    <ul role="list" className="list-disc space-y-1 pl-5">
                      {importErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" onClick={handleCancel} className="text-sm/6 font-semibold text-white cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={files.length === 0 || isImporting}
              className="rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isImporting ? 'Saving...' : 'Import Rules'}
            </button>
          </div>
        </form>
      </div>
      <Dialog open={dialogOpen} onClose={setDialogOpen} className="relative z-10">
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
                <button
                  type="button"
                  onClick={postImportSuccess}
                  className="inline-flex w-full justify-center rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Go back to Rules Page
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
