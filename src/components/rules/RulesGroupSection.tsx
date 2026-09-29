import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  ArrowRightCircleIcon,
  BellIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';

import Toggle from '@/components/ui/Toggle';
import { Rule } from '@/types/rule';

type RulesGroupSectionProps = {
  groupName: string;
  isUngrouped: boolean;
  description?: string;
  rules: Rule[];
  showMenu: boolean;
  onSelectRule: (rule: Rule) => void;
  onToggleRule: (rule: Rule, enabled: boolean) => void;
  onDeleteRule?: (id: string) => void;
  onDuplicateRule?: (rule: Rule) => void;
  onRenameGroup?: (groupName: string) => void;
  onMoveGroupRules?: (groupName: string) => void;
  onDeleteGroup?: (groupName: string) => void;
  onToggleGroupEnabled?: (groupName: string, enabled: boolean) => void;
  onToggleGroupNotifications?: (groupName: string, showNotifications: boolean) => void;
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

export default function RulesGroupSection({
  groupName,
  isUngrouped,
  description,
  rules,
  showMenu,
  onSelectRule,
  onToggleRule,
  onDeleteRule,
  onDuplicateRule,
  onRenameGroup,
  onMoveGroupRules,
  onDeleteGroup,
  onToggleGroupEnabled,
  onToggleGroupNotifications,
}: RulesGroupSectionProps) {
  const groupEnabled = rules.length > 0 && rules.every(rule => rule.enabled);
  const groupNotifications = rules.length > 0 && rules.every(rule => rule.showNotifications);
  const groupKey = isUngrouped ? '' : groupName;

  return (
    <section className="mb-6 last:mb-0 h-full overflow-hidden bg-gray-800/50 outline-1 outline-white/10 sm:rounded-xl sm:-outline-offset-1 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-purple-300">{isUngrouped ? 'Ungrouped' : groupName}</h3>
          {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Rules</span>
            <Toggle
              checked={groupEnabled}
              onChange={checked => onToggleGroupEnabled?.(groupKey, checked)}
              name={`group-enabled-${groupName}`}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Notifications</span>
            <Toggle
              checked={groupNotifications}
              onChange={checked => onToggleGroupNotifications?.(groupKey, checked)}
              name={`group-notifications-${groupName}`}
            />
          </div>

          {showMenu && !isUngrouped && (
            <Menu as="div" className="relative flex-none">
              <MenuButton className="relative block text-gray-400 hover:text-white">
                <span className="absolute -inset-2.5" />
                <span className="sr-only">Open group options</span>
                <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
              </MenuButton>
              <MenuItems
                transition
                anchor="bottom end"
                className="z-10 mt-2 w-52 rounded-md bg-gray-800 py-2 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <button
                    className="flex w-full flex-1 items-center gap-2 px-3 py-1 text-sm/6 text-white data-focus:bg-white/5 data-focus:outline-hidden cursor-pointer"
                    onClick={() => onRenameGroup?.(groupName)}
                  >
                    <PencilSquareIcon className="size-4" />
                    Rename Group
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    className="flex w-full flex-1 items-center gap-2 px-3 py-1 text-sm/6 text-white data-focus:bg-white/5 data-focus:outline-hidden cursor-pointer"
                    onClick={() => onMoveGroupRules?.(groupName)}
                  >
                    <ArrowRightCircleIcon className="size-4" />
                    Move Rules
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    className="flex w-full flex-1 items-center gap-2 px-3 py-1 text-sm/6 text-red-500 data-focus:bg-white/5 data-focus:outline-hidden cursor-pointer"
                    onClick={() => onDeleteGroup?.(groupName)}
                  >
                    <TrashIcon className="size-4" />
                    Delete Group
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          )}
        </div>
      </div>

      <ul role="list" className="divide-y divide-white/5">
        {rules.length === 0 && <li className="py-3 text-sm text-gray-500">No rules in this group yet.</li>}
        {rules.map(rule => (
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
                {showMenu && (
                  <>
                    <CalendarIcon className="size-3" />
                    <p className="truncate">Updated on {formatTimestamp(rule.updatedAt)}</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4">
              <Toggle checked={rule.enabled} onChange={checked => onToggleRule(rule, checked)} name="status" />

              {showMenu && (
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
                        onClick={() => onDuplicateRule?.(rule)}
                      >
                        <DocumentDuplicateIcon className="size-4" />
                        Duplicate<span className="sr-only">, {rule.name}</span>
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button
                        className="flex flex-1 items-center gap-2 w-full px-3 py-1 text-sm/6 text-red-500 data-focus:bg-white/5 data-focus:outline-hidden cursor-pointer"
                        onClick={() => onDeleteRule?.(rule.id)}
                      >
                        <TrashIcon className="size-4" />
                        Delete<span className="sr-only">, {rule.name}</span>
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
