import { useState } from 'react';
import { DialogTitle } from '@headlessui/react';
import { XMarkIcon, XCircleIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { dracula } from '@uiw/codemirror-theme-dracula';

import { HTTP_METHODS } from '@/constants';
import { Rule, RuleDraft } from '@/types/rule';

type RuleFormProps = {
  initialRule?: Rule;
  onSave: (draft: RuleDraft) => void;
  onCancel: () => void;
};

const emptyDraft: RuleDraft = {
  name: '',
  enabled: true,
  showNotifications: true,
  urlMatch: '',
  method: '*',
  statusCode: 200,
  responseBody: '{\n  \n}',
};

const responseBodyAriaLabel = EditorView.contentAttributes.of({ 'aria-label': 'Response Body' });

export default function RuleForm({ initialRule, onSave, onCancel }: RuleFormProps) {
  const [draft, setDraft] = useState<RuleDraft>(initialRule ?? emptyDraft);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!initialRule;

  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();
    setError(null);
    if (!draft.name.trim()) {
      setError('Rule name is required');
      return;
    }

    if (!draft.urlMatch.trim()) {
      setError('URL match is required');
      return;
    }

    if (!Number.isInteger(draft.statusCode) || draft.statusCode < 100 || draft.statusCode > 599) {
      setError('Status code must be an integer between 100 and 599.');
      return;
    }

    if (!formatBody()) return;

    onSave({ ...draft, name: draft.name.trim() || draft.urlMatch });
  };

  const update = <K extends keyof RuleDraft>(key: K, value: RuleDraft[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const formatBody = () => {
    try {
      const parsed = JSON.parse(draft.responseBody);
      update('responseBody', JSON.stringify(parsed, null, 2));
      setError(null);
      return true;
    } catch {
      setError('Response body is not valid JSON');
      return false;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex h-full flex-col overflow-y-auto bg-gray-800 shadow-xl after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-white/10"
    >
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gray-800/50 px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between space-x-3">
            <div className="space-y-1">
              <DialogTitle className="text-base font-semibold text-white">
                {isEditing ? 'Edit rule' : 'New rule'}
              </DialogTitle>
              <p className="text-sm text-gray-400">Create or update a rule.</p>
            </div>
            <div className="flex h-7 items-center">
              <button
                type="button"
                onClick={onCancel}
                className="relative rounded-md text-gray-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
              >
                <span className="absolute -inset-2.5" />
                <span className="sr-only">Close panel</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-500/15 p-4 outline outline-red-500/25">
            <div className="flex">
              <div className="shrink-0">
                <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-200">There was error processing your submission</h3>
                <div className="mt-2 text-sm text-red-200/80">
                  <ul role="list" className="list-disc space-y-1 pl-5">
                    <li>{error}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Divider container */}
        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-white/10 sm:py-0">
          {/* Rule name */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="name" className="block text-sm/6 font-medium text-white sm:mt-1.5">
                Rule Name
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                id="name"
                name="name"
                type="text"
                value={draft.name}
                onChange={e => update('name', e.target.value)}
                placeholder="e.g, Mock empty cart"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* url */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="urlMatch" className="block text-sm/6 font-medium text-white sm:mt-1.5">
                URL Contains
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                id="urlMatch"
                name="urlMatch"
                type="text"
                value={draft.urlMatch}
                onChange={e => update('urlMatch', e.target.value)}
                placeholder="/cart"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* method */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="method" className="block text-sm/6 font-medium text-white sm:mt-1.5">
                Http Method
              </label>
            </div>
            <div className="sm:col-span-2">
              <select
                id="method"
                name="method"
                value={draft.method}
                onChange={e => update('method', e.target.value as RuleDraft['method'])}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple-600 sm:text-sm/6"
              >
                {HTTP_METHODS.map(method => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* status code */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="statusCode" className="block text-sm/6 font-medium text-white sm:mt-1.5">
                Status Code
              </label>
            </div>
            <div className="sm:col-span-2">
              <input
                id="statusCode"
                type="number"
                name="statusCode"
                min={100}
                max={599}
                value={draft.statusCode}
                onChange={e => update('statusCode', Number(e.target.value))}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-purple-500 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple-600 sm:text-sm/6"
              />
            </div>
          </div>

          {/* response body */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
              <label htmlFor="responseBody" className="block text-sm/6 font-medium text-white sm:mt-1.5">
                Response Body
              </label>
            </div>
            <div className="sm:col-span-2">
              <div className="flex justify-end px-2 mb-1">
                <button type="button" onClick={formatBody} className="cursor-pointer" aria-label="Format JSON">
                  <CodeBracketIcon className="size-4 text-white" />
                </button>
              </div>
              <div className="text-sm">
                <CodeMirror
                  value={draft.responseBody}
                  height="200px"
                  extensions={[json(), responseBodyAriaLabel]}
                  theme={dracula}
                  onChange={value => update('responseBody', value)}
                />
              </div>
            </div>
          </div>

          {/* settings */}
          <fieldset className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <legend className="sr-only">Settings</legend>
            <div aria-hidden="true" className="text-sm/6 font-medium text-white">
              Settings
            </div>
            <div className="space-y-5 sm:col-span-2">
              <div className="space-y-5 sm:mt-0">
                {/* Enable/Disable */}
                <div className="relative flex items-start">
                  <div className="absolute flex h-6 items-center">
                    <input
                      id="enabled"
                      type="checkbox"
                      name="enabled"
                      checked={draft.enabled}
                      onChange={e => update('enabled', e.target.checked)}
                      aria-describedby="enabled-description"
                      className="relative size-4 appearance-none rounded-full border border-white/20 bg-black/10 before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-purple-500 checked:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 disabled:border-white/10 disabled:bg-gray-800 disabled:before:bg-white/20 forced-colors:appearance-auto forced-colors:before:hidden"
                    />
                  </div>
                  <div className="pl-7 text-sm/6">
                    <label htmlFor="enabled" className="font-medium text-white">
                      Enable
                    </label>
                    <p id="enabled-description" className="text-gray-400">
                      Enable this rule.
                    </p>
                  </div>
                </div>

                {/* Notifications */}
                <div className="relative flex items-start">
                  <div className="absolute flex h-6 items-center">
                    <input
                      id="showNotifications"
                      type="checkbox"
                      name="showNotifications"
                      checked={draft.showNotifications}
                      onChange={e => update('showNotifications', e.target.checked)}
                      aria-describedby="showNotifications-description"
                      className="relative size-4 appearance-none rounded-full border border-white/20 bg-black/10 before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-purple-500 checked:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 disabled:border-white/10 disabled:bg-gray-800 disabled:before:bg-white/20 forced-colors:appearance-auto forced-colors:before:hidden"
                    />
                  </div>
                  <div className="pl-7 text-sm/6">
                    <label htmlFor="enabled" className="font-medium text-white">
                      Show Notifications
                    </label>
                    <p id="enabled-description" className="text-gray-400">
                      Show notifications message when the rule is triggered
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      {/* Action buttons */}
      <div className="shrink-0 border-t border-white/10 px-4 py-5 sm:px-6">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-gray-100 inset-ring inset-ring-white/5 hover:bg-white/20 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 cursor-pointer"
          >
            Save Rule
          </button>
        </div>
      </div>
    </form>
  );
}
