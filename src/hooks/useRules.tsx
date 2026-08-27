import { useEffect, useState } from 'react';
import { Rule, RuleDraft } from '@/types/rule';
import { getRules, onRulesChanged, setRuleEnabled, addRule } from '@/utils/ruleStorage';

export default function useRules() {
  const [rules, setRules] = useState<Rule[] | undefined>(undefined);

  useEffect(() => {
    getRules().then(setRules);
    return onRulesChanged(setRules);
  }, []);

  const toggleRule = async (rule: Rule, enabled: boolean) => {
    setRules(prev => (prev ? prev.map(r => (r.id === rule.id ? { ...r, enabled } : r)) : prev));
    await setRuleEnabled(rule.id, enabled);
  };

  const duplicateRule = async (rule: Rule) => {
    const newRule: RuleDraft = {
      name: `Copy of ${rule.name}`,
      enabled: rule.enabled,
      showNotifications: rule.showNotifications,
      urlMatch: rule.urlMatch,
      method: rule.method,
      statusCode: rule.statusCode,
      responseBody: rule.responseBody,
    };
    await addRule(newRule);
  };

  return {
    rules,
    toggleRule,
    duplicateRule,
    activeRulesCount: rules?.filter(r => r.enabled).length ?? 0,
  };
}
