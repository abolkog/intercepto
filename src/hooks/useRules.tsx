import { useEffect, useState } from 'react';
import { Rule } from '@/types/rule';
import { getRules, onRulesChanged, setRuleEnabled } from '@/utils/ruleStorage';

export default function useRules() {
  const [rules, setRules] = useState<Rule[] | undefined>(undefined);

  useEffect(() => {
    void getRules().then(setRules);
    return onRulesChanged(setRules);
  }, []);

  const toggleRule = async (rule: Rule, enabled: boolean) => {
    setRules(prev => (prev ? prev.map(r => (r.id === rule.id ? { ...r, enabled } : r)) : prev));
    await setRuleEnabled(rule.id, enabled);
  };

  return {
    rules,
    toggleRule,
    activeRulesCount: rules?.filter(r => r.enabled).length ?? 0,
  };
}
