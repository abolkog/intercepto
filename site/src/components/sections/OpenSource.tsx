import GithubPurple from '@/assets/github_purple.svg';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

import { GITHUB_REPO } from '@/constants';

export default function OpenSource() {
  return (
    <section
      id="open-source"
      className="scroll-mt-20 border-y border-white/08 bg-[#0b1729]/70"
      data-testid="section-open-source"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[1fr_.8fr] lg:px-8">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <img src={GithubPurple} className="h-4 w-auto" />
            <span className="eyebrow font-code text-[11px] uppercase text-slate-500">Open source by default</span>
          </div>
          <h2
            className="max-w-xl text-3xl font-semibold tracking-[-.04em] text-white sm:text-4xl"
            data-testid="heading-open-source"
          >
            No black boxes between your code and the network.
          </h2>
          <p className="mt-5 max-w-lg leading-7 text-slate-400">
            Inspect every rule. Export your setup. Read the source. Intercepto is built for developers who would rather
            understand their tools than trust a dashboard.
          </p>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noreferrer"
            data-testid="link-browse-source"
            className="mt-7 inline-flex items-center gap-2 text-[13px] font-semibold text-[#d0a5ff] transition hover:text-white"
          >
            Browse the source <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#101d31] p-5" data-testid="code-rules-json">
          <div className="mb-5 flex items-center justify-between border-b border-white/08 pb-4">
            <span className="font-code text-[11px] text-slate-400">intercepto / rules.json</span>
            <span className="rounded bg-[#8cf2b4]/10 px-2 py-1 text-[9px] text-[#8cf2b4]">MIT</span>
          </div>
          <div className="font-code text-[11px] leading-6 text-slate-500">
            <span className="text-[#a855f7]">[</span>
            <br />
            &nbsp;&nbsp;<span className="text-[#c08afa]">{'{'}</span>{' '}
            <span className="text-[#8cf2b4]">&quot;match&quot;</span>:{' '}
            <span className="text-[#f5c38b]">&quot;/api/products&quot;</span>,<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#8cf2b4]">&quot;status&quot;</span>:{' '}
            <span className="text-[#f5c38b]">200</span>
            <br />
            &nbsp;&nbsp;<span className="text-[#c08afa]">{'}'}</span>
            <br />
            <span className="text-[#a855f7]">]</span>
          </div>
        </div>
      </div>
    </section>
  );
}
