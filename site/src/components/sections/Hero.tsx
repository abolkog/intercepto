import { useState } from 'react';
import { PlayIcon, BoltIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ShieldCheckIcon, CodeBracketSquareIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { scrollTo } from '@/util';
import GetExtensionButton from '../GetExtensionButton';
import Logo from '../Logo';

type Rule = {
  method: 'GET' | 'POST';
  name: string;
  path: string;
  status: string;
  active: boolean;
};

const initialRules: Rule[] = [
  { method: 'GET', name: 'List products', path: '/api/products', status: '200', active: true },
  { method: 'POST', name: 'Create checkout', path: '/api/checkout', status: '201', active: true },
  { method: 'GET', name: 'Current user', path: '/api/me', status: '200', active: false },
];

function StatusToggle({ active, onToggle, testId }: { active: boolean; onToggle: () => void; testId: string }) {
  return (
    <div className="group relative inline-flex w-11 shrink-0 rounded-full bg-white/5 p-0.5 inset-ring inset-ring-white/10 outline-offset-2 outline-purple-500 transition-colors duration-200 ease-in-out has-checked:bg-[#a855f7] has-focus-visible:outline-2">
      <span className="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5" />
      <input
        data-testid={testId}
        name="setting"
        type="checkbox"
        aria-label="Rule setting"
        className="absolute inset-0 size-full appearance-none focus:outline-hidden"
        onClick={event => {
          event.stopPropagation();
          onToggle();
        }}
        checked={active}
      />
    </div>
  );
}

function ExtensionWindow() {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [active, setActive] = useState(0);
  const [detailsEnabled, setDetailsEnabled] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(true);

  const selectedRule = rules[active];
  const addRule = () => {
    const nextRule: Rule = {
      method: 'GET',
      name: 'Mock inventory',
      path: '/api/inventory',
      status: '200',
      active: true,
    };
    setRules(current => [...current, nextRule]);
    setActive(rules.length);
    setDetailsEnabled(true);
    setDetailsOpen(true);
  };

  const toggleRule = (index: number) => {
    setRules(current =>
      current.map((rule, ruleIndex) => (ruleIndex === index ? { ...rule, active: !rule.active } : rule)),
    );
    if (index === active) setDetailsEnabled(enabled => !enabled);
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#111d31] text-left shadow-[0_30px_90px_rgba(2,7,20,.65),0_0_0_1px_rgba(168,85,247,.08)]"
      data-testid="extension-window"
    >
      <div className="flex h-11 items-center justify-between border-b border-white/08 bg-[#17243b] px-4">
        <div className="flex items-center gap-2.5">
          <Logo compact />
          <span className="text-[11px] font-medium text-slate-300">Intercepto</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8cf2b4]" />
          active on this tab
          <span className="ml-2 text-slate-600" aria-hidden="true">
            ×
          </span>
        </div>
      </div>
      <div className="grid min-h-89.5 grid-cols-1 md:grid-cols-[1.1fr_.9fr]">
        <div className="border-b border-white/08 p-5 md:border-b-0 md:border-r">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-white">Rules</p>
              <p className="mt-1 text-[9px] text-slate-500">Manage existing rules or create a new one.</p>
            </div>
            <button
              type="button"
              onClick={addRule}
              data-testid="button-new-rule"
              className="rounded-md bg-[#9b43ec] px-2 py-1 text-[9px] font-semibold text-white transition hover:bg-[#b566fa]"
            >
              New rule
            </button>
          </div>
          <div
            className="overflow-hidden rounded-lg border border-white/08 bg-[#152238]"
            role="list"
            aria-label="Intercepto rules"
          >
            {rules.map((rule, index) => (
              <div
                key={`${rule.name}-${index}`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setActive(index);
                  setDetailsOpen(true);
                }}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActive(index);
                    setDetailsOpen(true);
                  }
                }}
                data-testid={`rule-row-${index}`}
                className={`flex w-full cursor-pointer items-center justify-between border-b border-white/[.07] px-3 py-3 text-left last:border-0 ${active === index ? 'bg-[#1d2d48]' : 'hover:bg-[#1a2941]'}`}
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[10px] font-medium text-slate-200">{rule.name}</span>
                    <span className="rounded bg-[#263957] px-1 py-0.5 font-mono text-[8px] text-[#bd8bfa]">
                      {rule.method}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${rule.active ? 'bg-[#8cf2b4]' : 'bg-slate-600'}`}
                    />
                  </div>
                  <p className="mt-1 truncate font-mono text-[8px] text-slate-500">{rule.path} · updated just now</p>
                </div>
                <StatusToggle active={rule.active} onToggle={() => toggleRule(index)} testId={`toggle-rule-${index}`} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[9px] text-slate-500">
            <ExclamationCircleIcon className="h-3 w-3 text-[#8cf2b4]" />
            Listening for fetch and XHR requests
          </div>
        </div>
        <div className="bg-[#19283d] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-white">Rule details</p>
              <p className="mt-1 text-[9px] text-slate-500">Transparent, local, predictable.</p>
            </div>
            <button
              type="button"
              onClick={() => setDetailsOpen(false)}
              aria-label="Close rule details"
              data-testid="button-close-rule-details"
              className="text-slate-500 transition hover:text-white"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          {selectedRule && detailsOpen && (
            <div className="mt-5 space-y-3" data-testid="rule-details">
              <label className="block text-[9px] font-medium text-slate-400">
                Rule name
                <input
                  value={selectedRule.name}
                  readOnly
                  aria-label="Rule name"
                  data-testid="input-rule-name"
                  className="mt-1.5 w-full rounded border border-white/09 bg-[#22334b] px-2.5 py-2 text-[10px] text-slate-200 outline-none"
                />
              </label>
              <label className="block text-[9px] font-medium text-slate-400">
                URL contains
                <input
                  value={selectedRule.path}
                  readOnly
                  aria-label="URL contains"
                  data-testid="input-rule-url"
                  className="mt-1.5 w-full rounded border border-white/09 bg-[#22334b] px-2.5 py-2 font-mono text-[10px] text-[#d2b1fb] outline-none"
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="text-[9px] text-slate-400">
                  HTTP method
                  <div className="mt-1.5 flex items-center justify-between rounded border border-white/09 bg-[#22334b] px-2.5 py-2 text-[10px] text-slate-200">
                    {selectedRule.method}
                    <ChevronDownIcon className="h-3 w-3 text-slate-500" />
                  </div>
                </label>
                <label className="text-[9px] text-slate-400">
                  Status code
                  <input
                    value={selectedRule.status}
                    readOnly
                    aria-label="Status code"
                    data-testid="input-rule-status"
                    className="mt-1.5 w-full rounded border border-white/09 bg-[#22334b] px-2.5 py-2 text-[10px] text-slate-200 outline-none"
                  />
                </label>
              </div>
              <div>
                <p className="text-[9px] font-medium text-slate-400">Response body</p>
                <div
                  className="mt-1.5 rounded border border-white/09 bg-[#0d1728] p-2.5 font-mono text-[8px] leading-4 text-slate-400"
                  data-testid="text-response-body"
                >
                  <span className="text-slate-600">1</span> {'{'}
                  <br />
                  <span className="text-slate-600">2</span>&nbsp;{' '}
                  <span className="text-[#c08afa]">&quot;data&quot;</span>: [{'{'}
                  <br />
                  <span className="text-slate-600">3</span>&nbsp;&nbsp;{' '}
                  <span className="text-[#c08afa]">&quot;id&quot;</span>: <span className="text-[#8cf2b4]">481</span>,
                  <br />
                  <span className="text-slate-600">4</span>&nbsp;&nbsp;{' '}
                  <span className="text-[#c08afa]">&quot;name&quot;</span>:{' '}
                  <span className="text-[#8cf2b4]">&quot;Nova keyboard&quot;</span>
                  <br />
                  <span className="text-slate-600">5</span>&nbsp; {'}'}]<br />
                  <span className="text-slate-600">6</span> {'}'}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/08 pt-3">
                <span className="text-[9px] text-slate-400">Rule enabled</span>
                <StatusToggle
                  active={detailsEnabled}
                  onToggle={() => toggleRule(active)}
                  testId="toggle-selected-rule"
                />
              </div>
            </div>
          )}
          {!detailsOpen && (
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              data-testid="button-open-rule-details"
              className="mt-8 rounded-md border border-white/10 px-3 py-2 text-[10px] font-semibold text-slate-300 transition hover:border-[#a855f7]/50 hover:text-white"
            >
              Open rule details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 pt-16 lg:px-8 lg:pb-36 lg:pt-28" data-testid="section-hero">
      <div className="grid items-center gap-16 lg:grid-cols-[.88fr_1.12fr]">
        <div>
          <div
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#a855f7]/30 bg-[#a855f7]/10 px-3 py-1.5 text-[11px] font-medium text-[#d8b5ff]"
            data-testid="badge-open-source"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#8cf2b4]" />
            Open-source request control for frontend teams
          </div>
          <h1 className="hero-title max-w-xl font-display text-white" data-testid="heading-hero">
            Your API.
            <br />
            <span className="text-[#b86bff]">Your rules.</span>
            <br />
            Your flow.
          </h1>
          <p className="mt-7 max-w-md text-[17px] leading-7 text-slate-400" data-testid="text-hero-description">
            Intercept real API calls in the browser and replace them with predictable responses. No server setup. No
            waiting. Just build.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <GetExtensionButton label="Get Intercepto free" showIcon />
            <button
              type="button"
              onClick={() => scrollTo('workflow')}
              data-testid="button-hero-workflow"
              className="flex items-center gap-2 rounded-lg border border-white/[.14] bg-white/03 px-5 py-3 text-[13px] font-semibold text-slate-300 transition hover:bg-white/[.07]"
            >
              <PlayIcon className="h-3.5 w-3.5 fill-current" /> See how it works
            </button>
          </div>
          <div className="mt-7 flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheckIcon className="size-5 text-[#8cf2b4]" /> Runs locally
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <a
              href=""
              target="_blank"
              rel="noreferrer"
              data-testid="link-hero-license"
              className="flex items-center gap-1.5 transition hover:text-slate-300"
            >
              <CodeBracketSquareIcon className="size-5 text-[#8cf2b4]" /> MIT licensed
            </a>
          </div>
        </div>
        <div className="relative lg:pt-7">
          <div className="absolute -inset-8 rounded-full bg-[#8c45da]/10 blur-3xl" aria-hidden="true" />
          <ExtensionWindow />
          <div
            className="absolute -bottom-5 -left-6 hidden items-center gap-3 rounded-xl border border-white/1 bg-[#101c2e] px-4 py-3 shadow-xl sm:flex"
            data-testid="status-request-intercepted"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#8cf2b4]/10">
              <BoltIcon className="h-4 w-4 text-[#8cf2b4]" />
            </span>
            <div>
              <p className="text-[11px] font-medium text-white">Request intercepted</p>
              <p className="font-mono text-[9px] text-slate-500">GET /api/products · 14ms</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
