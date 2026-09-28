import { useState } from 'react';

import useRules from '@/hooks/useRules';
import useRuleGroupsManager from '@/hooks/useRuleGroupsManager';
import useSelectedRuleFromPopup from '@/hooks/useSelectedRuleFromPopup';
import type { Rule, RuleDraft } from '@/types/rule';
import { deleteRule, addRule, updateRule } from '@/utils/ruleStorage';

export default function useRulesPage() {
  const { rules, toggleRule, duplicateRule } = useRules();
  const {
    availableGroups,
    availableGroupNames,
    openNewGroupDialog,
    openRenameGroup,
    openMoveGroupRules,
    openDeleteGroup,
    onToggleGroupEnabled,
    onToggleGroupNotifications,
    newGroupDialogProps,
    groupActionDialogProps,
  } = useRuleGroupsManager({ rules });

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

  return {
    openRulesForm,
    openNewGroupDialog,
    rulesListKey: editingRule?.id ?? 'new',
    rulesListProps: {
      rules,
      groups: availableGroups,
      onToggleGroupEnabled,
      onToggleGroupNotifications,
      onRenameGroup: openRenameGroup,
      onMoveGroupRules: openMoveGroupRules,
      onDeleteGroup: openDeleteGroup,
      onSelectRule: (rule: Rule) => openRulesForm(rule),
      onDeleteRule: (id: string) => deleteRule(id),
      onToggleRule: (rule: Rule, status: boolean) => toggleRule(rule, status),
      onDuplicateRule: (rule: Rule) => duplicateRule(rule),
    },
    ruleFormDialogProps: {
      initialRule: editingRule,
      groups: availableGroupNames,
      onSave: (draft: RuleDraft) => handleSave(draft),
      onCancel: closeForm,
      open: isFormOpen,
    },
    newGroupDialogProps,
    groupActionDialogProps,
  };
}
