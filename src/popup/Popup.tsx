import Toggle from '@/components/Toggle';
import useRules from '@/hooks/useRules';

const MAX_POPUP_RULES = 3;

function MethodBadge({ method }: { method: string }) {
  return (
    <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
      {method}
    </span>
  );
}

export default function Popup() {
  const { rules, activeRulesCount, toggleRule } = useRules();

  const sortedRules = [...(rules ?? [])].sort((a, b) => b.updatedAt - a.updatedAt);
  const visibleRules = sortedRules.slice(0, MAX_POPUP_RULES);
  const remainingRulesCount = Math.max(sortedRules.length - MAX_POPUP_RULES, 0);

  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
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

        {visibleRules.map(rule => (
          <div key={rule.id} className="flex items-center gap-3 border-b border-line/60 px-4 py-2.5 last:border-b-0">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-slate-100">{rule.name || 'Untitled rule'}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <MethodBadge method={rule.method} />
                <span className="truncate font-mono text-[11px] text-muted">{rule.urlMatch}</span>
              </div>
            </div>

            <Toggle checked={rule.enabled} onChange={checked => toggleRule(rule, checked)} name="status" />
          </div>
        ))}

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
