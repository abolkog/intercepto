import { SignalIcon, CodeBracketIcon, RectangleGroupIcon } from '@heroicons/react/24/solid';

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="scroll-mt-20 border-y border-white.08 bg-[#0b1729]/70"
      data-testid="section-workflow"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow mb-4 font-code text-[11px] uppercase text-[#b86bff]">The control loop</p>
          <h2 className="section-title font-display text-white" data-testid="heading-workflow">
            Move from waiting
            <br />
            to <span className="text-[#8cf2b4]">building.</span>
          </h2>
          <p className="mt-5 text-[16px] leading-7 text-slate-400">
            Keep your UI moving even when the backend is in flux. Define a rule once, then let every refresh return the
            response you expect.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-white/09 bg-[#101d31] p-6" data-testid="card-workflow-match">
            <span className="mb-10 grid h-10 w-10 place-items-center rounded-lg bg-[#a855f7]/15 text-[#c08afa]">
              <RectangleGroupIcon className="h-5 w-5" />
            </span>
            <p className="mb-2 font-code text-[10px] text-[#b86bff]">01 / MATCH</p>
            <h3 className="text-xl font-semibold text-white">Catch the request</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Match by URL, HTTP method, or both. Rules stay transparent and readable in the extension.
            </p>
          </div>
          <div
            className="purple-glow rounded-xl border border-[#a855f7]/35 bg-[#151d36] p-6"
            data-testid="card-workflow-replace"
          >
            <span className="mb-10 grid h-10 w-10 place-items-center rounded-lg bg-[#8cf2b4]/12 text-[#8cf2b4]">
              <CodeBracketIcon className="h-5 w-5" />
            </span>
            <p className="mb-2 font-code text-[10px] text-[#8cf2b4]">02 / REPLACE</p>
            <h3 className="text-xl font-semibold text-white">Shape the response</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Return your JSON, set a status code, and make edge cases as easy to test as the happy path.
            </p>
          </div>
          <div className="rounded-xl border border-white/09 bg-[#101d31] p-6" data-testid="card-workflow-ship">
            <span className="mb-10 grid h-10 w-10 place-items-center rounded-lg bg-[#f5b97b]/12 text-[#f5c38b]">
              <SignalIcon className="h-5 w-5" />
            </span>
            <p className="mb-2 font-code text-[10px] text-[#f5c38b]">03 / SHIP</p>
            <h3 className="text-xl font-semibold text-white">See it instantly</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Toggle a rule off, refresh the page, and compare against the real API whenever you are ready.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
