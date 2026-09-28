import { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/20/solid';

import RulesList from '@/components/RulesList';
import useRules from '@/hooks/useRules';
import useSelectedRuleFromPopup from '@/hooks/useSelectedRuleFromPopup';
import { Rule, RuleDraft } from '@/types/rule';
import RuleFormDialog from '@/components/RuleFormDialog';
import { addRule, deleteRule, updateRule } from '@/utils/ruleStorage';

export default function RulesPage() {
  const { rules, toggleRule, duplicateRule } = useRules();
  const [editingRule, setEditingRule] = useState<Rule | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-white">Rules</h1>
          <p className="mt-2 text-sm text-gray-300">Manage existing rules or create a new one.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 gap-3 flex ">
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

      <RuleFormDialog initialRule={editingRule} onSave={d => handleSave(d)} onCancel={closeForm} open={isFormOpen} />
    </>
  );
}
