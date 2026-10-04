import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import { Bars3Icon, SquaresPlusIcon, ArrowsRightLeftIcon, XMarkIcon, CameraIcon } from '@heroicons/react/24/solid';
import GitHubButton from 'react-github-btn';
import AppLogo from './AppLogo';
import { NavLink, Outlet } from 'react-router';
import { clx } from '@/utils/common';

const navigation = [
  { name: 'Rules', href: '/', icon: SquaresPlusIcon },
  { name: 'Import/Export', href: 'import-export', icon: ArrowsRightLeftIcon },
  { name: 'Capture Requests', href: 'capture-requests', icon: CameraIcon },
];

function NavList() {
  return (
    <ul role="list" className="-mx-2 space-y-1">
      {navigation.map(item => (
        <li key={item.name}>
          <NavLink
            to={item.href}
            className={({ isActive }) =>
              clx(
                isActive ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
              )
            }
          >
            <item.icon aria-hidden="true" className="size-6 shrink-0" />
            {item.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function StarButton() {
  return (
    <div className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-white/5">
      <GitHubButton
        href="https://github.com/abolkog/Intercepto"
        data-color-scheme="no-preference: light; light: light; dark: dark;"
        data-size="large"
        aria-label="Star abolkog/Intercepto on GitHub"
      >
        Star Intercepto on Github
      </GitHubButton>
    </div>
  );
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                  </button>
                </div>
              </TransitionChild>

              <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10 before:pointer-events-none before:absolute before:inset-0 before:bg-black/10">
                <div className="relative flex h-16 shrink-0 items-center">
                  <AppLogo />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <NavList />
                    </li>
                    <li className="-mx-6 mt-auto">
                      <StarButton />
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <div className="hidden bg-gray-900 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-white/10 bg-black/10 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <AppLogo />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <NavList />
                </li>
                <li className="-mx-6 mt-auto">
                  <StarButton />
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 after:pointer-events-none after:absolute after:inset-0 after:border-b after:border-white/10 after:bg-black/10 sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-400 hover:text-white lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
          <AppLogo />
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
