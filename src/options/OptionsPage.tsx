import { PlusCircleIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, XCircleIcon } from '@heroicons/react/20/solid';

import { useRef, useState } from 'react';
import Header from '@/components/Header';
import RulesList from '@/components/RulesList';
import useRules from '@/hooks/useRules';
import useSelectedRuleFromPopup from '@/hooks/useSelectedRuleFromPopup';
import { Rule, RuleDraft } from '@/types/rule';
import RuleFormDialog from '@/components/RuleFormDialog';
import { addRule, deleteRule, updateRule } from '@/utils/ruleStorage';
import { exportRules, importRules } from '@/utils/ruleTransfer';

const clx = (...classes: string[]) => classes.filter(Boolean).join(' ');

export default function OptionsPage() {
  const { rules, toggleRule, duplicateRule } = useRules();
  const [editingRule, setEditingRule] = useState<Rule | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const closeForm = () => setIsFormOpen(false);

  const openRulesForm = (rule?: Rule) => {
    setEditingRule(rule);
    setIsFormOpen(true);
  };

  useSelectedRuleFromPopup({ rules, onSelectRule: openRulesForm });

  const handleSave = async (draft: RuleDraft) => {
    if (editingRule) {
      await updateRule(editingRule.id, draft);
    } else {
      await addRule(draft);
    }
    setIsFormOpen(false);
  };

  const handleExport = async () => {
    try {
      await exportRules();
    } catch (err) {
      console.error('Failed to export rules', err);
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const { errors } = await importRules(file);
    setImportErrors(errors);
  };

  const rulesExists = rules && rules.length > 0;
  return (
    <div className="min-h-screen text-slate-100">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold text-white">Rules</h1>
              <p className="mt-2 text-sm text-gray-300">Manage existing rules or create a new one.</p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 gap-3 flex ">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={handleFileSelected}
              />
              <button
                type="button"
                className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer"

                onClick={handleImportClick}
              >
                Import Rules
                <ArrowDownTrayIcon aria-hidden="true" className="-mr-0.5 size-5" />
              </button>
              <button
                type="button"
                className={clx(
                  'inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 ',
                  rulesExists
                    ? 'bg-cyan-500 hover:bg-cyan-400 focus-visible:outline-cyan-500 cursor-pointer'
                    : 'bg-gray-500 cursor-not-allowed',
                )}
                disabled={!rulesExists}
                onClick={handleExport}
              >
                Export Rules
                <ArrowUpTrayIcon aria-hidden="true" className="-mr-0.5 size-5" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 cursor-pointer"

                onClick={() => openRulesForm()}
              >
                New Rule
                <PlusCircleIcon aria-hidden="true" className="-mr-0.5 size-5" />
              </button>
            </div>
          </div>
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

          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <RulesList
                  key={editingRule?.id ?? 'new'}
                  rules={rules}
                  onSelectRule={rule => openRulesForm(rule)}
                  onDeleteRule={id => deleteRule(id)}
                  onToggleRule={(rule, status) => toggleRule(rule, status)}
                  onDuplicateRule={rule => duplicateRule(rule)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <RuleFormDialog initialRule={editingRule} onSave={d => handleSave(d)} onCancel={closeForm} open={isFormOpen} />
    </div>
  );
}
