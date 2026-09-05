import { useState } from 'react';
import { DialogTitle } from '@headlessui/react';
import { XMarkIcon, XCircleIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { aura } from '@uiw/codemirror-theme-aura';

import { HTTP_METHODS } from '@/constants';
import { Rule, RuleDraft } from '@/types/rule';
import { TextField } from './TextField';
import { SelectField } from './SelectField';
import Toggle from './Toggle';

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
        <div className="space-y-6 py-6 px-6 sm:space-y-0  sm:py-0">
          {/* Rule name */}
          <TextField
            id="name"
            label="Rule Name"
            value={draft.name}
            onChange={value => update('name', value)}
            placeholder="e.g, Mock empty cart"
          />

          {/* url */}
          <TextField
            id="urlMatch"
            label="URL Contains"
            variant="secondary"
            value={draft.urlMatch}
            onChange={value => update('urlMatch', value)}
            placeholder="/cart"
          />

          <div className="grid grid-cols-2 space-x-10">
            {/* method */}
            <SelectField
              id="method"
              label="HTTP method"
              value={draft.method}
              onChange={value => update('method', value as RuleDraft['method'])}
              options={HTTP_METHODS.map(m => ({ label: m === '*' ? 'Any(*)' : m, value: m }))}
            />

            {/* statusCode */}
            <TextField
              id="statusCode"
              label="Status Code"
              type="number"
              value={draft.statusCode}
              onChange={value => update('statusCode', Number(value))}
              placeholder="200"
              min={100}
              max={599}
            />
          </div>

          {/* response body */}
          <div className="space-y-2 py-4 ">
            <label htmlFor="responseBody" className="block text-sm font-medium text-gray-400">
              Response Body
            </label>
            <div className="flex justify-end px-2 mb-1">
              <button type="button" onClick={formatBody} className="cursor-pointer" aria-label="Format JSON">
                <CodeBracketIcon className="size-4 text-white" />
              </button>
            </div>
            <div className="text-sm">
              <CodeMirror
                id="responseBody"
                value={draft.responseBody}
                height="300px"
                extensions={[json(), responseBodyAriaLabel]}
                theme={aura}
                onChange={value => update('responseBody', value)}
              />
            </div>
          </div>

          {/* Enable/Disable */}
          <div className="flex justify-between py-4 ">
            <label htmlFor="enabled" className="block text-sm font-medium text-gray-400">
              Enable this rule.
            </label>
            <Toggle checked={draft.enabled} onChange={checked => update('enabled', checked)} name="enabled" />
          </div>

          <div className="flex justify-between py-4 ">
            <label htmlFor="showNotifications" className="block text-sm font-medium text-gray-400">
              Show notifications message when the rule is triggered
            </label>
            <Toggle
              checked={draft.showNotifications}
              onChange={checked => update('showNotifications', checked)}
              name="showNotifications"
            />
          </div>
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
