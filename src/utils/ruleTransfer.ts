import { addRule, getRules } from '@/utils/ruleStorage';
import { HTTP_METHODS } from '@/constants';
import { Rule, RuleDraft } from '@/types/rule';

export type ImportResult = {
  imported: Rule[];
  errors: string[];
};

export async function exportRules(): Promise<void> {
  const rules = await getRules();
  const json = JSON.stringify(rules, null, 2);
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

  return {
    draft: {
      name: d.name,
      enabled: typeof d.enabled === 'boolean' ? d.enabled : true,
      showNotifications: typeof d.showNotifications === 'boolean' ? d.showNotifications : true,
      urlMatch: d.urlMatch,
      method: d.method as RuleDraft['method'],
      statusCode: d.statusCode as number,
      responseBody: d.responseBody,
    },
  };
}

export function parseRulesJson(json: string): ImportResult & { drafts: RuleDraft[] } {
  const errors: string[] = [];
  const drafts: RuleDraft[] = [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { imported: [], drafts: [], errors: ['File is not valid JSON'] };
  }

  if (!Array.isArray(parsed)) {
    return { imported: [], drafts: [], errors: ['Expected a JSON array of rules'] };
  }

  parsed.forEach((entry, index) => {
    const result = validateRuleDraft(entry, index);
    if ('error' in result) {
      errors.push(result.error);
    } else {
      drafts.push(result.draft);
    }
  });

  return { imported: [], drafts, errors };
}

export async function importRules(file: File): Promise<ImportResult> {
  const text = await file.text();
  const { drafts, errors } = parseRulesJson(text);

  const imported: Rule[] = [];
  for (const draft of drafts) {
    const rule = await addRule(draft);
    imported.push(rule);
  }

  return { imported, errors };
}
