import type { Rule, RuleDraft } from '../types/rule';
import { generateId } from './id';

export const RULES_STORAGE_KEY = 'intercepto_rules';

export async function getRules(): Promise<Rule[]> {
  const data = await chrome.storage.local.get(RULES_STORAGE_KEY);
  const rules = (data[RULES_STORAGE_KEY] as Rule[] | undefined) ?? [];
  return rules.sort((a, b) => b.createdAt - a.createdAt);
}

export async function saveRules(rules: Rule[]): Promise<void> {
  await chrome.storage.local.set({ [RULES_STORAGE_KEY]: rules });
}

export async function addRule(draft: RuleDraft): Promise<Rule> {
  const rules = await getRules();
  const now = Date.now();
  const rule: Rule = { ...draft, id: generateId(), createdAt: now, updatedAt: now };
  await saveRules([rule, ...rules]);
  return rule;
}

export async function updateRule(id: string, draft: RuleDraft): Promise<void> {
  const rules = await getRules();
  const next = rules.map(rule => (rule.id === id ? { ...rule, ...draft, id, updatedAt: Date.now() } : rule));
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

export function onRulesChanged(callback: (rules: Rule[]) => void): () => void {
  const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
    if (areaName !== 'local' || !changes[RULES_STORAGE_KEY]) return;
    callback((changes[RULES_STORAGE_KEY].newValue as Rule[] | undefined) ?? []);
  };
  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
