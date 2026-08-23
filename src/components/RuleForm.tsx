import { HTTP_METHODS } from '@/constants';
import { Rule, RuleDraft } from '@/types/rule';
import { useState } from 'react';

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

export default function RuleForm({ initialRule, onSave, onCancel }: RuleFormProps) {
  const [draft, setDraft] = useState<RuleDraft>(initialRule ?? emptyDraft);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialRule;

  const update = <K extends keyof RuleDraft>(key: K, value: RuleDraft[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();
    setError(null);
    if (!draft.name.trim()) {
      setError('Rule name is required');
      return;
    }

    if (!draft.urlMatch.trim()) {
      setError('URL match is required.');
      return;
    }
    if (!Number.isInteger(draft.statusCode) || draft.statusCode < 100 || draft.statusCode > 599) {
      setError('Status code must be an integer between 100 and 599.');
      return;
    }

    onSave({ ...draft, name: draft.name.trim() || draft.urlMatch });
  };

  const formatBody = () => {
    try {
      const parsed = JSON.parse(draft.responseBody);
      update('responseBody', JSON.stringify(parsed, null, 2));
      setError(null);
    } catch {
      setError('Response body is not valid JSON, so it will be sent as plain text.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50 px-4">
      <div className="w-full bg-slate-900 max-w-lg rounded-lg border border-line bg-panel shadow-2xl">
        <form onSubmit={handleSubmit}>
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-100">{isEditing ? 'Edit rule' : 'New rule'}</h2>
          </div>

          <div className="space-y-4 px-5 py-4">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm/6 font-medium text-white">
                Rule Name
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={draft.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="Mock empty cart"
                    className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="urlMatch" className="block text-sm/6 font-medium text-white">
                  URL contains
                </label>

                <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                  <input
                    id="urlMatch"
                    type="text"
                    name="urlMatch"
                    value={draft.urlMatch}
                    onChange={e => update('urlMatch', e.target.value)}
                    placeholder="/cart"
                    className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="w-32">
                <label htmlFor="method" className="block text-sm/6 font-medium text-white">
                  Method
                </label>

                <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                  <select
                    id="method"
                    name="method"
                    value={draft.method}
                    onChange={e => update('method', e.target.value as RuleDraft['method'])}
                    className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                  >
                    {HTTP_METHODS.map(method => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-32">
                <label htmlFor="statusCode" className="block text-sm/6 font-medium text-white">
                  Status code
                </label>
                <div className="mt-2">
                  <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                    <input
                      id="statusCode"
                      type="number"
                      name="statusCode"
                      min={100}
                      max={599}
                      value={draft.statusCode}
                      onChange={e => update('statusCode', Number(e.target.value))}
                      className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="responseBody" className="block text-sm/6 font-medium text-white">
                  Response body
                </label>
                <button
                  type="button"
                  onClick={formatBody}
                  className="text-xs text-signal hover:underline cursor-pointer"
                >
                  Format JSON
                </button>
              </div>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                  <textarea
                    id="responseBody"
                    name="responseBody"
                    value={draft.responseBody}
                    onChange={e => update('responseBody', e.target.value)}
                    className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-white placeholder:text-gray-500 focus:outline-none sm:text-sm/6"
                    rows={7}
                    spellCheck={false}
                  />
                </div>
              </div>

              <div className="mt-2">
                <div className="flex gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        id="enabled"
                        type="checkbox"
                        name="enabled"
                        checked={draft.enabled}
                        onChange={e => update('enabled', e.target.checked)}
                        aria-describedby="enabled-description"
                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-white/10 bg-white/5 checked:border-indigo-500 checked:bg-indigo-500 indeterminate:border-indigo-500 indeterminate:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:border-white/5 disabled:bg-white/10 disabled:checked:bg-white/10 forced-colors:appearance-auto"
                      />
                      <svg
                        viewBox="0 0 14 14"
                        fill="none"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-white/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-checked:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-indeterminate:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm/6">
                    <label htmlFor="enabled" className="font-medium text-white">
                      Enable Rule
                    </label>
                    <p id="enabled-description" className="text-gray-400">
                      Enable the rule
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <div className="flex gap-3">
                  <div className="flex h-6 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        id="showNotifications"
                        type="checkbox"
                        name="showNotifications"
                        checked={draft.showNotifications}
                        onChange={e => update('showNotifications', e.target.checked)}
                        aria-describedby="notifications-description"
                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-white/10 bg-white/5 checked:border-indigo-500 checked:bg-indigo-500 indeterminate:border-indigo-500 indeterminate:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:border-white/5 disabled:bg-white/10 disabled:checked:bg-white/10 forced-colors:appearance-auto"
                      />
                      <svg
                        viewBox="0 0 14 14"
                        fill="none"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-white/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-checked:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-indeterminate:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-sm/6">
                    <label htmlFor="showNotifications" className="font-medium text-white">
                      Show notifications
                    </label>
                    <p id="notifications-description" className="text-gray-400">
                      Display a toast message when the rule is activated and api call is intercepted
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md px-3 py-1.5 text-sm text-muted hover:text-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-medium text-ink hover:bg-indigo-400 cursor-pointer"
            >
              Save rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
