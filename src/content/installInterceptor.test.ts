import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { type Rule } from '@/types/rule';
import { installInterceptor } from './installInterceptor';
import { INTERCEPTO_MESSAGE_SOURCE, INTERCEPTO_RULE_MATCHED, INTERCEPTO_RULES_UPDATE } from '@/constants';
import { mockRule } from '@/test-utils/mockData';

const originalFetchMock = vi.fn(async () => new Response('real-network', { status: 200 }));

function dispatchRulesUpdate(rules: Rule[]): void {
  window.dispatchEvent(
    new MessageEvent('message', {
      source: window,
      data: {
        source: INTERCEPTO_MESSAGE_SOURCE,
        type: INTERCEPTO_RULES_UPDATE,
        rules,
      },
    }),
  );
}

describe('installInterceptor', () => {
  beforeAll(() => {
    window.fetch = originalFetchMock as typeof window.fetch;
    installInterceptor();
  });

  beforeEach(() => {
    originalFetchMock.mockClear();
    dispatchRulesUpdate([]);
  });

  test('intercepts fetch for matching rule and returns mocked response', async () => {
    const postMessageSpy = vi.spyOn(window, 'postMessage').mockImplementation(() => undefined);

    dispatchRulesUpdate([mockRule]);
    await Promise.resolve();

    const response = await window.fetch('https://api.tvmaze.com/shows/431/cast', { method: 'GET' });

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('{"ok":true}');
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(originalFetchMock).not.toHaveBeenCalled();
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        source: INTERCEPTO_MESSAGE_SOURCE,
        type: INTERCEPTO_RULE_MATCHED,
        ruleName: 'Mock tv shows',
        method: 'GET',
        url: '/shows',
      },
      '*',
    );
  });

  test('falls back to native fetch when no rule matches', async () => {
    const response = await window.fetch('https://api.tvmaze.com/people/1', { method: 'GET' });

    expect(await response.text()).toBe('real-network');
    expect(originalFetchMock).toHaveBeenCalledTimes(1);
  });

  test('intercepts XMLHttpRequest for matching rule', async () => {
    const postMessageSpy = vi.spyOn(window, 'postMessage').mockImplementation(() => undefined);

    dispatchRulesUpdate([mockRule]);
    await Promise.resolve();

    const xhr = new XMLHttpRequest();

    const loadEndPromise = new Promise<void>(resolve => {
      xhr.onloadend = () => resolve();
    });

    xhr.open('GET', 'https://api.tvmaze.com/shows/431/cast');
    xhr.send();

    await loadEndPromise;

    expect(xhr.status).toBe(200);
    expect(xhr.responseText).toBe('{"ok":true}');
    expect(xhr.getResponseHeader('content-type')).toContain('application/json');
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        source: INTERCEPTO_MESSAGE_SOURCE,
        type: INTERCEPTO_RULE_MATCHED,
        ruleName: 'Mock tv shows',
        method: 'GET',
        url: '/shows',
      },
      '*',
    );
  });
});
