import { PlusCircleIcon, FolderPlusIcon } from '@heroicons/react/20/solid';

import RulesList from '@/components/rules/RulesList';
import RuleFormDialog from '@/components/rules/RuleFormDialog';
import GroupActionDialog from '@/components/groups/GroupActionDialog';
import NewGroupDialog from '@/components/groups/NewGroupDialog';
import useRuleGroupsManager from '@/hooks/useRuleGroupsManager';
import useRules from '@/hooks/useRules';
import useSelectedRuleFromPopup from '@/hooks/useSelectedRuleFromPopup';
import { deleteRule } from '@/utils/ruleStorage';

import useRuleEditor from '@/hooks/useRuleEditor';
import Button from '@/components/ui/Button';

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
          <Button onClick={ruleGroupsManager.openNewGroupDialog} variant="secondary">
            New Group <FolderPlusIcon aria-hidden="true" className="-mr-0.5 size-5" />
          </Button>

          <Button onClick={ruleEditor.openCreate}>
            New Rule <PlusCircleIcon aria-hidden="true" className="-mr-0.5 size-5" />
          </Button>
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
