import { useEffect, useState } from 'react';
import type { Rule } from '@/types/rule';
import { getRules, onRulesChanged } from '@/utils/ruleStorage';

export default function Popup() {
  const [rules, setRules] = useState<Rule[] | null>(null);

  useEffect(() => {
    void getRules().then(setRules);
    return onRulesChanged(setRules);
  }, []);

  const activeCount = rules?.filter(r => r.enabled).length ?? 0;

  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="flex w-90 max-h-96 min-h-52 flex-col bg-slate-900 text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_blue]" />
          <span className="font-semibold tracking-tight">Intercepto</span>
        </div>
        <span className="font-mono text-xs text-slate-400">{activeCount} active</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {rules === null && <p className="px-4 py-6 text-center text-sm text-muted">Loading rules…</p>}

        {rules?.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted">
            No rules yet. Create one to start mocking API calls.
          </div>
        )}
      </div>

      <div className="border-t border-slate-700 p-3">
        <button
          type="button"
          onClick={openOptionsPage}
          className="w-full rounded-md bg-blue-400 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-blue-300 cursor-pointer"
        >
          Open Intercepto
        </button>
      </div>
    </div>
  );
}
