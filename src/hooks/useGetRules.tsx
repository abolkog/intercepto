import { useEffect, useState } from 'react';
import { Rule } from '@/types/rule';
import { getRules, onRulesChanged } from '@/utils/ruleStorage';

export default function useGetRules() {
  const [rules, setRules] = useState<Rule[] | undefined>(undefined);

  useEffect(() => {
    void getRules().then(setRules);
    return onRulesChanged(setRules);
  }, []);

  return {
    rules,
    activeRulesCount: rules?.filter(r => r.enabled).length ?? 0,
  };
}
