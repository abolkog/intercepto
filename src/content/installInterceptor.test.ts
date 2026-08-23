import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { Rule } from '@/types/rule';
import { installInterceptor } from './installInterceptor';
import { INTERCEPTO_MESSAGE_SOURCE, INTERCEPTO_RULE_MATCHED, INTERCEPTO_RULES_UPDATE } from '@/constants';

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

    dispatchRulesUpdate([
      {
        id: 'r-1',
        name: 'Mock empty cart',
        enabled: true,
        showNotifications: true,
        urlMatch: '/shows',
        method: 'GET',
        statusCode: 201,
        responseBody: '{"mocked":true}',
        createdAt: 1,
        updatedAt: 1,
      },
    ]);
    await Promise.resolve();

    const response = await window.fetch('https://api.tvmaze.com/shows/431/cast', { method: 'GET' });

    expect(response.status).toBe(201);
    expect(await response.text()).toBe('{"mocked":true}');
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(originalFetchMock).not.toHaveBeenCalled();
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        source: INTERCEPTO_MESSAGE_SOURCE,
        type: INTERCEPTO_RULE_MATCHED,
        ruleName: 'Mock empty cart',
        method: 'GET',
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

    dispatchRulesUpdate([
      {
        id: 'r-2',
        name: 'Mock empty cart',
        enabled: true,
        showNotifications: false,
        urlMatch: '/shows',
        method: 'GET',
        statusCode: 202,
        responseBody: '{"xhr":true}',
        createdAt: 1,
        updatedAt: 1,
      },
    ]);
    await Promise.resolve();

    const xhr = new XMLHttpRequest();

    const loadEndPromise = new Promise<void>(resolve => {
      xhr.onloadend = () => resolve();
    });

    xhr.open('GET', 'https://api.tvmaze.com/shows/431/cast');
    xhr.send();

    await loadEndPromise;

    expect(xhr.status).toBe(202);
    expect(xhr.responseText).toBe('{"xhr":true}');
    expect(xhr.getResponseHeader('content-type')).toContain('application/json');
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        source: INTERCEPTO_MESSAGE_SOURCE,
        type: INTERCEPTO_RULE_MATCHED,
        ruleName: 'Mock empty cart',
        method: 'GET',
      },
      '*',
    );
  });
});
