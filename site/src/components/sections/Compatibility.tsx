import { useState } from 'react';
import { GlobeAltIcon, CommandLineIcon, Square3Stack3DIcon } from '@heroicons/react/24/solid';

function CodeBlock({ activeTab }: { activeTab: 'fetch' | 'xhr' }) {
  return (
    <div
      className="relative rounded-xl border border-white/10 bg-[#0a1424] p-5 font-mono text-[11px] leading-6 shadow-xl"
      data-testid="code-example"
    >
      <div className="pr-8">
        {activeTab === 'fetch' ? (
          <>
            <div>
              <span className="text-[#a855f7]">const</span> response = <span className="text-[#a855f7]">await</span>{' '}
              fetch(<span className="text-[#8cf2b4]">&quot;/api/products&quot;</span>);
            </div>
            <div>
              <span className="text-slate-600">// Intercepto catches this request locally</span>
            </div>
            <div>
              <span className="text-[#a855f7]">const</span> data = <span className="text-[#a855f7]">await</span>{' '}
              response.json();
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="text-[#a855f7]">const</span> request = <span className="text-[#a855f7]">new</span>{' '}
              XMLHttpRequest();
            </div>
            <div>
              request.open(<span className="text-[#8cf2b4]">&quot;GET&quot;</span>,{' '}
              <span className="text-[#8cf2b4]">&quot;/api/products&quot;</span>);
            </div>
            <div>request.onload = () =&gt; render(request.response);</div>
          </>
        )}
      </div>
      <div className="mt-3 border-t border-white/08 pt-3 text-slate-500">
        <span className="text-[#8cf2b4]">200</span>&nbsp;&nbsp; 14ms&nbsp;&nbsp; mocked by{' '}
        <span className="text-[#c08afa]">products</span>
      </div>
    </div>
  );
}

export default function Compatibility() {
  const [activeTab, setActiveTab] = useState<'fetch' | 'xhr'>('fetch');

  return (
    <section
      id="compatibility"
      className="scroll-mt-20 mx-auto max-w-6xl px-5 py-24 lg:px-8 lg:py-32"
      data-testid="section-compatibility"
    >
      <div className="grid items-start gap-14 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="eyebrow mb-4 font-code text-[11px] uppercase text-[#b86bff]">Built for the browser</p>
          <h2 className="section-title font-display text-white" data-testid="heading-compatibility">
            The network layer
            <br />
            shouldn't slow you down.
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-7 text-slate-400">
            Intercepto works where your app works. Keep your existing fetch and XHR code. Add no SDK, no proxy, and no
            environment variable.
          </p>
          <div className="mt-8 flex gap-2" role="tablist" aria-label="Transport examples">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'fetch'}
              onClick={() => setActiveTab('fetch')}
              data-testid="tab-fetch"
              className={`rounded-md px-4 py-2 text-[12px] font-semibold transition ${activeTab === 'fetch' ? 'bg-[#a855f7] text-white' : 'border border-white/10 text-slate-400 hover:text-white'}`}
            >
              fetch
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'xhr'}
              onClick={() => setActiveTab('xhr')}
              data-testid="tab-xhr"
              className={`rounded-md px-4 py-2 text-[12px] font-semibold transition ${activeTab === 'xhr' ? 'bg-[#a855f7] text-white' : 'border border-white/10 text-slate-400 hover:text-white'}`}
            >
              XMLHttpRequest
            </button>
          </div>
        </div>
        <div>
          <CodeBlock activeTab={activeTab} />
          <div className="mt-5 flex flex-wrap gap-3">
            <div
              className="flex items-center gap-2 rounded-lg border border-white/08 bg-white/03 px-3 py-2 text-[11px] text-slate-400"
              data-testid="capability-any-origin"
            >
              <GlobeAltIcon className="h-3.5 w-3.5 text-[#8cf2b4]" /> Any origin
            </div>
            <div
              className="flex items-center gap-2 rounded-lg border border-white/08 bg-white/03 px-3 py-2 text-[11px] text-slate-400"
              data-testid="capability-per-tab"
            >
              <Square3Stack3DIcon className="h-3.5 w-3.5 text-[#c08afa]" /> Per-tab rules
            </div>
            <div
              className="flex items-center gap-2 rounded-lg border border-white/08 bg-white/03 px-3 py-2 text-[11px] text-slate-400"
              data-testid="capability-zero-config"
            >
              <CommandLineIcon className="h-3.5 w-3.5 text-[#f5c38b]" /> Zero config
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
