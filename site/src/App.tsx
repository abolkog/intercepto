import Header from '@/components/Header';
import Logo from '@/components/Logo';
import { Compatibility, Hero, Install, OpenSource, Workflow } from '@/components/sections';

function App() {
  return (
    <div className="site-grid noise min-h-dvh overflow-hidden text-slate-200 selection:bg-[#a855f7]/40">
      <Header />

      <main id="top">
        <Hero />

        <Workflow />

        <Compatibility />

        <OpenSource />

        <Install />
      </main>

      <footer className="border-t border-white/08" data-testid="site-footer">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-7 text-[11px] text-slate-600 sm:flex-row lg:px-8">
          <Logo compact={false} />
          <span data-testid="text-footer-tagline">Made for the moment before “the API is ready.”</span>
          <span data-testid="text-footer-copyright">© 2024 Intercepto</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
