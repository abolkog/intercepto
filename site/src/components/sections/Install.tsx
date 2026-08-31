import { SparklesIcon } from '@heroicons/react/24/solid';
import GetExtensionButton from '../GetExtensionButton';
import GithubButton from '../GithubButton';

export default function Install() {
  return (
    <section
      id="install"
      className="scroll-mt-20 relative mx-auto max-w-6xl px-5 py-28 text-center lg:px-8 lg:py-36"
      data-testid="section-install"
    >
      <div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8c45da]/15 blur-[100px]"
        aria-hidden="true"
      />
      <div className="relative">
        <SparklesIcon className="mx-auto mb-6 h-6 w-6 text-[#8cf2b4]" />
        <h2
          className="mx-auto max-w-2xl font-display text-5xl leading-[.9] tracking-[-.055em] text-white sm:text-7xl"
          data-testid="heading-install"
        >
          Build the UI.
          <br />
          <span className="text-[#b86bff]">Control the response.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[16px] leading-7 text-slate-400">
          Your next frontend feedback loop is one extension away.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <GetExtensionButton label="Add to Chrome" showIcon />
          <GithubButton label="View source" />
        </div>
        <p className="mt-5 font-code text-[10px] text-slate-600" data-testid="text-install-note">
          free forever · no account · no telemetry
        </p>
      </div>
    </section>
  );
}
