import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { EllipsisVerticalIcon, TrashIcon, BellIcon, DocumentDuplicateIcon } from '@heroicons/react/20/solid';

import { Rule } from '@/types/rule';
import Toggle from '@/components/Toggle';

type RulesListProps = {
  rules?: Rule[];
  onSelectRule: (rule: Rule) => void;
  onDeleteRule: (id: string) => void;
  onToggleRule: (rule: Rule, status: boolean) => void;
  onDuplicateRule: (rule: Rule) => void;
};

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RulesList({
  rules,
  onSelectRule,
  onDeleteRule,
  onToggleRule,
  onDuplicateRule,
}: RulesListProps) {
  return (
    <ul
      role="list"
      className="h-full divide-y divide-white/5 overflow-hidden bg-gray-800/50 outline-1 outline-white/10 sm:rounded-xl sm:-outline-offset-1 p-5"
    >
      {rules?.map(rule => (
        <li key={rule.id} className="flex items-center justify-between gap-x-6 py-5">
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <button
                onClick={() => onSelectRule(rule)}
                className="text-sm/6 font-semibold text-white underline cursor-pointer"
              >
                {rule.name}
              </button>

              <p className="mt-0.5 rounded-md bg-gray-400/10 px-1.5 py-0.5 text-xs font-medium text-gray-400 inset-ring inset-ring-gray-400/20">
                {rule.method === '*' ? 'Any (*)' : rule.method}
              </p>
              {rule.showNotifications && <BellIcon className="size-4 text-green-400" />}
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-400">
              <p className="whitespace-nowrap">{rule.urlMatch}</p>
              <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
              <p className="truncate">Updated on {formatTimestamp(rule.updatedAt)}</p>
            </div>
          </div>
          <div className="flex flex-none items-center gap-x-4">
            <Toggle checked={rule.enabled} onChange={checked => onToggleRule(rule, checked)} name="status" />

            <Menu as="div" className="relative flex-none">
              <MenuButton className="relative block text-gray-400 hover:text-white">
                <span className="absolute -inset-2.5" />
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
              </MenuButton>
              <MenuItems
                transition
                anchor="bottom end"
                className="z-10 mt-2 w-32 rounded-md bg-gray-800 py-2 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <button
                    className="flex flex-1 items-center gap-2 w-full px-3 py-1 text-sm/6 text-white data-focus:bg-white/5 data-focus:outline-hidden cursor-pointer"
                    onClick={() => onDuplicateRule(rule)}
                  >
                    <DocumentDuplicateIcon className="size-4" />
                    Duplicate<span className="sr-only">, {rule.name}</span>
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    className="flex flex-1 items-center gap-2 w-full px-3 py-1 text-sm/6 text-red-500 data-focus:bg-white/5 data-focus:outline-hidden cursor-pointer"
                    onClick={() => onDeleteRule(rule.id)}
                  >
                    <TrashIcon className="size-4" />
                    Delete<span className="sr-only">, {rule.name}</span>
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </li>
      ))}
    </ul>
  );
}
