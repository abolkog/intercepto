import GitHubButton from 'react-github-btn';

export default function Header() {
  return (
    <nav className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img src="/icons/icon128.png" alt="Intercepto" className="h-8 w-auto" />
              <span className="ml-2 text-2xl">Intercepto</span>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <GitHubButton
              href="https://github.com/abolkog/Intercepto"
              data-color-scheme="no-preference: light; light: light; dark: dark;"
              data-size="large"
              aria-label="Star abolkog/Intercepto on GitHub"
            >
              Star
            </GitHubButton>
          </div>
        </div>
      </div>
    </nav>
  );
}
