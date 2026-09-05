import { useEffect } from 'react';

import { INTERCEPTO_SELECTED_RULE_ID_KEY } from '@/constants';
import { type Rule } from '@/types/rule';

type UseSelectedRuleFromPopupParams = {
  rules: Rule[] | undefined;
  onSelectRule: (rule: Rule) => void;
};

export default function useSelectedRuleFromPopup({ rules, onSelectRule }: UseSelectedRuleFromPopupParams) {
  useEffect(() => {
    if (!rules) return;

    let cancelled = false;

    const consumeSelectedRuleId = async (nextRuleId?: string) => {
      const selectedRuleId =
        nextRuleId ??
        (await chrome.storage.local.get(INTERCEPTO_SELECTED_RULE_ID_KEY))[INTERCEPTO_SELECTED_RULE_ID_KEY];

      if (typeof selectedRuleId !== 'string' || !selectedRuleId) return;

      await chrome.storage.local.set({ [INTERCEPTO_SELECTED_RULE_ID_KEY]: '' });

      if (cancelled) return;

      const selectedRule = rules.find(rule => rule.id === selectedRuleId);
      if (selectedRule) {
        onSelectRule(selectedRule);
      }
    };

    const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName !== 'local') return;

      const selectedRuleId = changes[INTERCEPTO_SELECTED_RULE_ID_KEY]?.newValue;
      if (typeof selectedRuleId === 'string' && selectedRuleId) {
        consumeSelectedRuleId(selectedRuleId);
      }
    };

    chrome.storage.onChanged.addListener(listener);
    consumeSelectedRuleId();

    return () => {
      cancelled = true;
      chrome.storage.onChanged.removeListener(listener);
    };
  }, [onSelectRule, rules]);
}
