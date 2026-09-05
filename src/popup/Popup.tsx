import RulesList from '@/components/RulesList';

import useRules from '@/hooks/useRules';
import { INTERCEPTO_SELECTED_RULE_ID_KEY } from '@/constants';
import { type Rule } from '@/types/rule';

const MAX_POPUP_RULES = 5;

export default function Popup() {
  const { rules = [], activeRulesCount, toggleRule } = useRules();

  const visibleRules = rules.slice(0, MAX_POPUP_RULES);
  const remainingRulesCount = Math.max(rules.length - MAX_POPUP_RULES, 0);

  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
  };

  const openOptionsPageWithRule = async (rule: Rule) => {
    await chrome.storage.local.set({ [INTERCEPTO_SELECTED_RULE_ID_KEY]: rule.id });
    openOptionsPage();
  };

  return (
    <div className="flex w-90 max-h-96 min-h-52 flex-col text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_blue]" />
          <span className="font-semibold tracking-tight">Intercepto</span>
        </div>
        <span className="font-mono text-xs text-slate-400">{activeRulesCount} active</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rules === undefined && <p className="px-4 py-6 text-center text-sm text-muted">Loading rules...</p>}

        {rules?.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted">
            No rules yet. Create one to start mocking API calls.
          </div>
        )}

        <RulesList
          rules={visibleRules}
          showMenu={false}
          onToggleRule={toggleRule}
          onSelectRule={rule => openOptionsPageWithRule(rule)}
        />

        {remainingRulesCount > 0 && (
          <p className="px-4 py-3 text-xs text-slate-400">
            {remainingRulesCount} more rule{remainingRulesCount === 1 ? '' : 's'}. Click Open Intercepto to view them.
          </p>
        )}
      </div>

      <div className="border-t border-slate-700 p-3">
        <button
          type="button"
          onClick={openOptionsPage}
          className="w-full rounded-md bg-purple-400 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-300 cursor-pointer"
        >
          Open Intercepto
        </button>
      </div>
    </div>
  );
}
