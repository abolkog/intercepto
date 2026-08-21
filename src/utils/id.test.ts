import { describe, expect, test } from 'vitest';
import { generateId } from './id';

describe('generateId', () => {
  test('generates non-empty, unique-looking ids', () => {
    const a = generateId();
    const b = generateId();
    expect(a).toEqual(expect.any(String));
    expect(a.length).toBeGreaterThan(0);
    expect(a).not.toBe(b);
  });
});
