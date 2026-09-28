import type { Group } from '@/types/rule';
import { normaliseString, trimString, trimToUndefined } from '@/utils/common';

export const RULE_GROUPS_STORAGE_KEY = 'intercepto_groups';

type GroupStorageEntry = string | Group;

function mapToGroup(entry: GroupStorageEntry): Group | null {
  if (typeof entry === 'string') {
    const name = trimString(entry);
    if (!name) return null;
    return { name };
  }

  const name = trimString(entry.name);
  if (!name) return null;

  return {
    name,
    description: trimToUndefined(entry.description),
  };
}

function dedupeGroups(entries: GroupStorageEntry[]): Group[] {
  const map = new Map<string, Group>();

  for (const entry of entries) {
    const group = mapToGroup(entry);
    if (!group) continue;

    const key = normaliseString(group.name);
    const existing = map.get(key);
    if (!existing) {
      map.set(key, group);
      continue;
    }

    if (!existing.description && group.description) {
      map.set(key, { ...existing, description: group.description });
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getGroups(): Promise<Group[]> {
  const data = await chrome.storage.local.get(RULE_GROUPS_STORAGE_KEY);
  const raw = (data[RULE_GROUPS_STORAGE_KEY] as GroupStorageEntry[] | undefined) ?? [];
  return dedupeGroups(raw);
}

export async function saveGroups(groups: Group[]): Promise<void> {
  await chrome.storage.local.set({ [RULE_GROUPS_STORAGE_KEY]: groups });
}

export async function addGroup(name: string, description?: string): Promise<void> {
  const normalizedName = trimString(name);
  if (!normalizedName) return;

  const groups = await getGroups();
  const key = normaliseString(normalizedName);
  const existing = groups.find(group => normaliseString(group.name) === key);

  if (existing) {
    const nextDescription = trimToUndefined(description);
    if (nextDescription && nextDescription !== existing.description) {
      await saveGroups(
        groups.map(group => (normaliseString(group.name) === key ? { ...group, description: nextDescription } : group)),
      );
    }
    return;
  }

  await saveGroups([...groups, { name: normalizedName, description: trimToUndefined(description) }]);
}

export async function renameGroup(oldName: string, newName: string, description?: string): Promise<void> {
  const normalizedOld = trimString(oldName);
  const normalizedNew = trimString(newName);
  if (!normalizedOld || !normalizedNew) return;

  const groups = await getGroups();
  const oldKey = normaliseString(normalizedOld);
  const newKey = normaliseString(normalizedNew);

  const target = groups.find(group => normaliseString(group.name) === oldKey);
  if (!target) return;

  const otherGroups = groups.filter(group => normaliseString(group.name) !== oldKey);
  const conflict = otherGroups.find(group => normaliseString(group.name) === newKey);

  const nextDescription = trimToUndefined(description) ?? target.description;

  if (conflict) {
    await saveGroups(
      otherGroups.map(group =>
        normaliseString(group.name) === newKey
          ? { ...group, description: group.description ?? nextDescription }
          : group,
      ),
    );
    return;
  }

  await saveGroups([...otherGroups, { name: normalizedNew, description: nextDescription }]);
}

export async function removeGroup(name: string): Promise<void> {
  const normalizedName = trimString(name);
  if (!normalizedName) return;

  const key = normaliseString(normalizedName);
  const groups = await getGroups();
  await saveGroups(groups.filter(group => normaliseString(group.name) !== key));
}

export function onGroupsChanged(callback: (groups: Group[]) => void): () => void {
  const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
    if (areaName !== 'local' || !changes[RULE_GROUPS_STORAGE_KEY]) return;

    const raw = (changes[RULE_GROUPS_STORAGE_KEY].newValue as GroupStorageEntry[] | undefined) ?? [];
    callback(dedupeGroups(raw));
  };

  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
