import { useCallback, useState } from 'react';

import type { Rule, RuleDraft } from '@/types/rule';
import { addRule, updateRule } from '@/utils/ruleStorage';

export default function useRuleEditor() {
  const [editingRule, setEditingRule] = useState<Rule | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  const openCreate = useCallback(() => {
    setEditingRule(undefined);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((rule: Rule) => {
    setEditingRule(rule);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const save = useCallback(
    async (draft: RuleDraft) => {
      if (editingRule) {
        await updateRule(editingRule.id, draft);
      } else {
        await addRule(draft);
      }
      setIsOpen(false);
    },
    [editingRule],
  );

  return { editingRule, isOpen, openCreate, openEdit, close, save };
}
