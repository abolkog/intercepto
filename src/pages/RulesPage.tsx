import { PlusCircleIcon } from '@heroicons/react/20/solid';

import RulesList from '@/components/RulesList';
import RuleFormDialog from '@/components/RuleFormDialog';
import GroupActionDialog from '@/components/rules/GroupActionDialog';
import NewGroupDialog from '@/components/rules/NewGroupDialog';
import useRuleGroupsManager from '@/hooks/useRuleGroupsManager';
import useRules from '@/hooks/useRules';
import useSelectedRuleFromPopup from '@/hooks/useSelectedRuleFromPopup';
import { deleteRule } from '@/utils/ruleStorage';

import useRuleEditor from '@/hooks/useRuleEditor';

export default function RulesPage() {
  const { rules, toggleRule, duplicateRule } = useRules();
  const ruleGroupsManager = useRuleGroupsManager({ rules });
  const ruleEditor = useRuleEditor();

  useSelectedRuleFromPopup({ rules, onSelectRule: ruleEditor.openEdit });

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
            className="inline-flex items-center gap-x-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 cursor-pointer"
            onClick={ruleGroupsManager.openNewGroupDialog}
          >
            New Group
            <PlusCircleIcon aria-hidden="true" className="-mr-0.5 size-5" />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-md bg-purple-500 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 cursor-pointer"

            onClick={ruleEditor.openCreate}
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
              rules={rules}
              groups={ruleGroupsManager.availableGroups}
              onToggleGroupEnabled={ruleGroupsManager.onToggleGroupEnabled}
              onToggleGroupNotifications={ruleGroupsManager.onToggleGroupNotifications}
              onRenameGroup={ruleGroupsManager.openRenameGroup}
              onMoveGroupRules={ruleGroupsManager.openMoveGroupRules}
              onDeleteGroup={ruleGroupsManager.openDeleteGroup}
              onSelectRule={ruleEditor.openEdit}
              onDeleteRule={deleteRule}
              onToggleRule={toggleRule}
              onDuplicateRule={duplicateRule}
            />
          </div>
        </div>
      </div>

      <RuleFormDialog
        initialRule={ruleEditor.editingRule}
        groups={ruleGroupsManager.availableGroupNames}
        onCancel={ruleEditor.close}
        open={ruleEditor.isOpen}
        onSave={ruleEditor.save}
      />

      <NewGroupDialog {...ruleGroupsManager.newGroupDialogProps} />

      <GroupActionDialog {...ruleGroupsManager.groupActionDialogProps} />
    </>
  );
}
