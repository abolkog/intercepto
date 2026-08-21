import { addRule, deleteRule, getRules, onRulesChanged, setRuleEnabled, updateRule } from './ruleStorage';
import { chromeMock } from '../test-utils/chromeMock';
import type { RuleDraft } from '../types/rule';

const draft: RuleDraft = {
  name: 'Mock empty cart',
  enabled: true,
  urlMatch: '/cart',
  method: 'GET',
  statusCode: 200,
  responseBody: '{"items":[]}',
};

beforeEach(() => {
  chromeMock.__reset();
});

describe('rulesStorage', () => {
  it('returns an empty list when nothing is stored', async () => {
    expect(await getRules()).toEqual([]);
  });

  it('adds a rule and assigns it an id and timestamps', async () => {
    const rule = await addRule(draft);
    expect(rule.id).toBeTruthy();
    expect(rule.createdAt).toBeGreaterThan(0);

    const rules = await getRules();
    expect(rules).toHaveLength(1);
    expect(rules[0]).toMatchObject(draft);
  });

  it('updates an existing rule in place', async () => {
    const rule = await addRule(draft);
    await updateRule(rule.id, { ...draft, statusCode: 404 });

    const [updated] = await getRules();
    expect(updated.statusCode).toBe(404);
    expect(updated.id).toBe(rule.id);
  });

  it('deletes a rule', async () => {
    const rule = await addRule(draft);
    await deleteRule(rule.id);
    expect(await getRules()).toEqual([]);
  });

  it('toggles a rule enabled state', async () => {
    const rule = await addRule({ ...draft, enabled: true });
    await setRuleEnabled(rule.id, false);

    const [updated] = await getRules();
    expect(updated.enabled).toBe(false);
  });

  it('notifies subscribers when rules change', async () => {
    const callback = vi.fn();
    const unsubscribe = onRulesChanged(callback);

    await addRule(draft);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0]).toHaveLength(1);

    unsubscribe();
    await addRule(draft);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
