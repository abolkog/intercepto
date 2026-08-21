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

              <label className="mt-6 flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={draft.enabled}
                  onChange={e => update('enabled', e.target.checked)}
                  className="h-4 w-4 rounded border-line bg-ink accent-signalDim"
                />
                Enabled
              </label>
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
