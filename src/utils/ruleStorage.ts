import type { Rule, RuleDraft } from '../types/rule';
import { normaliseString, trimToUndefined } from './common';
import { generateId } from './id';

export const RULES_STORAGE_KEY = 'intercepto_rules';

function normalizeRuleDraft(draft: RuleDraft): RuleDraft {
  return {
    ...draft,
    group: trimToUndefined(draft.group),
  };
}

function isRuleInGroup(rule: Rule, groupName: string): boolean {
  return normaliseString(rule.group) === normaliseString(groupName);
}

export async function getRules(): Promise<Rule[]> {
  const data = await chrome.storage.local.get(RULES_STORAGE_KEY);
  const rules = (data[RULES_STORAGE_KEY] as Rule[] | undefined) ?? [];
  return rules.sort((a, b) => b.createdAt - a.createdAt);
}

export async function saveRules(rules: Rule[]): Promise<void> {
  await chrome.storage.local.set({ [RULES_STORAGE_KEY]: rules });
}

export async function clearRules(): Promise<void> {
  await saveRules([]);
}

export async function addRule(draft: RuleDraft): Promise<Rule> {
  const rules = await getRules();
  const now = Date.now();
  const rule: Rule = { ...normalizeRuleDraft(draft), id: generateId(), createdAt: now, updatedAt: now };
  await saveRules([rule, ...rules]);
  return rule;
}

export async function updateRule(id: string, draft: RuleDraft): Promise<void> {
  const rules = await getRules();
  const normalizedDraft = normalizeRuleDraft(draft);
  const next = rules.map(rule => (rule.id === id ? { ...rule, ...normalizedDraft, id, updatedAt: Date.now() } : rule));
  await saveRules(next);
}

export async function deleteRule(id: string): Promise<void> {
  const rules = await getRules();
  await saveRules(rules.filter(rule => rule.id !== id));
}

export async function setRuleEnabled(id: string, enabled: boolean): Promise<void> {
  const rules = await getRules();
  const next = rules.map(rule => (rule.id === id ? { ...rule, enabled, updatedAt: Date.now() } : rule));
  await saveRules(next);
}

export async function moveRulesToGroup(groupName: string, targetGroupName?: string): Promise<void> {
  const nextGroup = trimToUndefined(targetGroupName);
  const rules = await getRules();
  const now = Date.now();

  const next = rules.map(rule => {
    if (!isRuleInGroup(rule, groupName)) return rule;
    return {
      ...rule,
      group: nextGroup,
      updatedAt: now,
    };
  });

  await saveRules(next);
}

export async function deleteRulesInGroup(groupName: string): Promise<void> {
  const rules = await getRules();
  await saveRules(rules.filter(rule => !isRuleInGroup(rule, groupName)));
}

export async function setRulesInGroupEnabled(groupName: string, enabled: boolean): Promise<void> {
  const rules = await getRules();
  const now = Date.now();

  const next = rules.map(rule => {
    if (!isRuleInGroup(rule, groupName)) return rule;
    return {
      ...rule,
      enabled,
      updatedAt: now,
    };
  });

  await saveRules(next);
}

export async function setRulesInGroupNotifications(groupName: string, showNotifications: boolean): Promise<void> {
  const rules = await getRules();
  const now = Date.now();

  const next = rules.map(rule => {
    if (!isRuleInGroup(rule, groupName)) return rule;
    return {
      ...rule,
      showNotifications,
      updatedAt: now,
    };
  });

  await saveRules(next);
}

export function onRulesChanged(callback: (rules: Rule[]) => void): () => void {
  const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
    if (areaName !== 'local' || !changes[RULES_STORAGE_KEY]) return;
    callback((changes[RULES_STORAGE_KEY].newValue as Rule[] | undefined) ?? []);
  };
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
