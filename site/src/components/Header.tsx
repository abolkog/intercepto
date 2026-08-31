import Logo from './Logo';
import GetExtensionButton from './GetExtensionButton';
import GithubButton from './GithubButton';
import { scrollTo } from '@/util';

export default function Header() {
  return (
    <header className="glass-nav sticky top-0 z-30 border-b border-white/08">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 lg:px-8">
        <button type="button" onClick={() => scrollTo('top')} aria-label="Go to top" data-testid="button-go-top">
          <Logo compact={false} />
        </button>
        <nav className="hidden items-center gap-8 text-[13px] text-slate-400 md:flex" aria-label="Primary navigation">
          <button
            type="button"
            onClick={() => scrollTo('workflow')}
            data-testid="nav-workflow"
            className="transition hover:text-white"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={() => scrollTo('compatibility')}
            data-testid="nav-compatibility"
            className="transition hover:text-white"
          >
            Compatibility
          </button>
          <button
            type="button"
            onClick={() => scrollTo('open-source')}
            data-testid="nav-open-source"
            className="transition hover:text-white"
          >
            Open source
          </button>
        </nav>
        <div className="flex items-center gap-3">
          <GithubButton label="Source" />

          <GetExtensionButton label="Install extension" />
        </div>
      </div>
    </header>
  );
}
