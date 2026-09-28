import { addRule, getRules } from '@/utils/ruleStorage';
import { HTTP_METHODS } from '@/constants';
import { Rule, RuleDraft, Group } from '@/types/rule';
import { addGroup, getGroups } from '@/utils/groupsStorage';
import { isSameNormalisedString, normaliseString, trimString, trimToUndefined } from '@/utils/common';

export type ImportResult = {
  imported: Rule[];
  errors: string[];
};

type RulesExportDataV2 = {
  version: 2;
  exportedAt: string;
  rules: Rule[];
  groups: Group[];
};

export async function exportRules(): Promise<void> {
  const rules = await getRules();
  const groups = await getGroups();
  const payload: RulesExportDataV2 = {
    version: 2,
    exportedAt: new Date().toISOString(),
    rules,
    groups,
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `intercepto-rules-export-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function validateRuleDraft(data: unknown, index: number): { draft: RuleDraft } | { error: string } {
  if (typeof data !== 'object' || data === null) {
    return { error: `Entry ${index}: not an object` };
  }

  const d = data as Record<string, unknown>;

  if (typeof d.name !== 'string' || !d.name.trim()) {
    return { error: `Entry ${index}: missing or invalid "name"` };
  }

  if (typeof d.urlMatch !== 'string' || !d.urlMatch.trim()) {
    return { error: `Entry ${index} ("${d.name}"): missing or invalid "urlMatch"` };
  }

  if (typeof d.method !== 'string' || !HTTP_METHODS.includes(d.method as (typeof HTTP_METHODS)[number])) {
    return { error: `Entry ${index} ("${d.name}"): missing or invalid "method"` };
  }

  if (!Number.isInteger(d.statusCode) || (d.statusCode as number) < 100 || (d.statusCode as number) > 599) {
    return { error: `Entry ${index} ("${d.name}"): "statusCode" must be an integer between 100 and 599` };
  }

  if (typeof d.responseBody !== 'string') {
    return { error: `Entry ${index} ("${d.name}"): missing or invalid "responseBody"` };
  }

  const delayMs = (d.delayMs as number) ?? 0;
  const group = typeof d.group === 'string' ? trimToUndefined(d.group) : undefined;

  return {
    draft: {
      name: d.name,
      group: group ? group : undefined,
      enabled: typeof d.enabled === 'boolean' ? d.enabled : true,
      showNotifications: typeof d.showNotifications === 'boolean' ? d.showNotifications : true,
      urlMatch: d.urlMatch,
      method: d.method as RuleDraft['method'],
      statusCode: d.statusCode as number,
      responseBody: d.responseBody,
      delayMs,
    },
  };
}

function parseGroups(raw: unknown): Group[] {
  if (!Array.isArray(raw)) return [];

  const groups: Group[] = [];
  const seen = new Set<string>();

  for (const entry of raw) {
    if (typeof entry === 'string') {
      const name = trimString(entry);
      if (!name) continue;
      const key = normaliseString(name);
      if (seen.has(key)) continue;
      seen.add(key);
      groups.push({ name });
      continue;
    }

    if (typeof entry !== 'object' || entry === null) continue;
    const candidate = entry as Record<string, unknown>;
    if (typeof candidate.name !== 'string') continue;

    const name = trimString(candidate.name);
    if (!name) continue;

    const key = normaliseString(name);
    if (seen.has(key)) continue;
    seen.add(key);

    groups.push({
      name,
      description: typeof candidate.description === 'string' ? trimToUndefined(candidate.description) : undefined,
    });
  }

  return groups;
}

export function parseRulesJson(json: string): ImportResult & { drafts: RuleDraft[]; groups: Group[] } {
  const errors: string[] = [];
  const drafts: RuleDraft[] = [];
  let groups: Group[] = [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { imported: [], drafts: [], groups: [], errors: ['File is not valid JSON'] };
  }

  let rawRules: unknown;

  if (Array.isArray(parsed)) {
    rawRules = parsed;
  } else if (
    typeof parsed === 'object' &&
    parsed !== null &&
    Array.isArray((parsed as Record<string, unknown>).rules)
  ) {
    const payload = parsed as Record<string, unknown>;
    rawRules = payload.rules;
    groups = parseGroups(payload.groups);
  } else {
    return { imported: [], drafts: [], groups: [], errors: ['Expected a JSON array of rules'] };
  }

  (rawRules as unknown[]).forEach((entry, index) => {
    const result = validateRuleDraft(entry, index);
    if ('error' in result) {
      errors.push(result.error);
    } else {
      drafts.push(result.draft);

      const groupName = trimToUndefined(result.draft.group);
      if (groupName && !groups.some(group => isSameNormalisedString(group.name, groupName))) {
        groups.push({ name: groupName });
      }
    }
  });

  return { imported: [], drafts, groups, errors };
}

export async function importRules(file: File): Promise<ImportResult> {
  const text = await file.text();
  const { drafts, groups, errors } = parseRulesJson(text);

  for (const group of groups) {
    await addGroup(group.name, group.description);
  }

  const imported: Rule[] = [];
  for (const draft of drafts) {
    const rule = await addRule(draft);
    imported.push(rule);
  }

  return { imported, errors };
}
