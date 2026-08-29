import { describe, expect, test } from 'vitest';
import { parseRulesJson, validateRuleDraft } from './ruleTransfer';

describe('validateRuleDraft', () => {
  const valid = {
    name: 'Mock cart',
    enabled: true,
    showNotifications: false,
    urlMatch: '/cart',
    method: 'GET',
    statusCode: 200,
    responseBody: '{}',
  };

  test('accepts a fully valid entry', () => {
    const result = validateRuleDraft(valid, 0);
    expect('draft' in result).toBe(true);
    if ('draft' in result) {
      expect(result.draft).toEqual(valid);
    }
  });

  test('defaults enabled/showNotifications when omitted', () => {
    const { enabled: _enabled, showNotifications: _showNotifications, ...rest } = valid;
    const result = validateRuleDraft(rest, 0);
    expect('draft' in result).toBe(true);
    if ('draft' in result) {
      expect(result.draft.enabled).toBe(true);
      expect(result.draft.showNotifications).toBe(true);
    }
  });

  test('rejects a non-object entry', () => {
    const result = validateRuleDraft('not an object', 2);
    expect('error' in result).toBe(true);
    if ('error' in result) expect(result.error).toContain('Entry 2');
  });

  test('rejects missing name', () => {
    const { name: _name, ...rest } = valid;
    const result = validateRuleDraft(rest, 0);
    expect('error' in result).toBe(true);
    if ('error' in result) expect(result.error).toContain('name');
  });

  test('rejects invalid method', () => {
    const result = validateRuleDraft({ ...valid, method: 'NOT_A_METHOD' }, 0);
    expect('error' in result).toBe(true);
    if ('error' in result) expect(result.error).toContain('method');
  });

  test('rejects out-of-range statusCode', () => {
    const result = validateRuleDraft({ ...valid, statusCode: 999 }, 0);
    expect('error' in result).toBe(true);
    if ('error' in result) expect(result.error).toContain('statusCode');
  });

  test('rejects non-integer statusCode', () => {
    const result = validateRuleDraft({ ...valid, statusCode: 200.5 }, 0);
    expect('error' in result).toBe(true);
  });
});

describe('parseRulesJson', () => {
  test('parses a valid array of rules', () => {
    const json = JSON.stringify([
      { name: 'A', urlMatch: '/a', method: 'GET', statusCode: 200, responseBody: '{}' },
      { name: 'B', urlMatch: '/b', method: 'POST', statusCode: 201, responseBody: '{}' },
    ]);

    const result = parseRulesJson(json);

    expect(result.errors).toEqual([]);
    expect(result.drafts).toHaveLength(2);
    expect(result.drafts[0].name).toBe('A');
    expect(result.drafts[1].name).toBe('B');
  });

  test('reports malformed JSON', () => {
    const result = parseRulesJson('{not valid json');
    expect(result.drafts).toEqual([]);
    expect(result.errors).toEqual(['File is not valid JSON']);
  });

  test('reports non-array JSON', () => {
    const result = parseRulesJson(JSON.stringify({ name: 'not an array' }));
    expect(result.drafts).toEqual([]);
    expect(result.errors).toEqual(['Expected a JSON array of rules']);
  });

  test('collects valid drafts and skips invalid entries, reporting errors for each', () => {
    const json = JSON.stringify([
      { name: 'Good', urlMatch: '/ok', method: 'GET', statusCode: 200, responseBody: '{}' },
      { name: 'Bad method', urlMatch: '/bad', method: 'BOGUS', statusCode: 200, responseBody: '{}' },
      { urlMatch: '/no-name', method: 'GET', statusCode: 200, responseBody: '{}' },
    ]);

    const result = parseRulesJson(json);

    expect(result.drafts).toHaveLength(1);
    expect(result.drafts[0].name).toBe('Good');
    expect(result.errors).toHaveLength(2);
  });
});
