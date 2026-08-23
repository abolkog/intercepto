import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { type Rule } from '@/types/rule';
import {
  INTERCEPTO_MESSAGE_SOURCE,
  INTERCEPTO_REQUEST_RULES,
  INTERCEPTO_RULE_MATCHED,
  INTERCEPTO_RULES_UPDATE,
} from '@/constants';

const notifyRuleMatchedMock = vi.fn();

const getRulesMock = vi.fn<() => Promise<Rule[]>>();
const onRulesChangedMock = vi.fn<(callback: (rules: Rule[]) => void) => () => void>();

vi.mock('@/utils/ruleStorage', () => ({
  getRules: getRulesMock,
  onRulesChanged: onRulesChangedMock,
}));

vi.mock('@/utils/ruleNotifications', () => ({
  notifyRuleMatched: notifyRuleMatchedMock,
}));

describe('content main bridge', () => {
  let onRulesChangedCallback: ((rules: Rule[]) => void) | undefined;

  beforeEach(() => {
    onRulesChangedCallback = undefined;
    getRulesMock.mockResolvedValue([
      {
        id: 'r-1',
        name: 'Mock empty cart',
        enabled: true,
        showNotifications: true,
        urlMatch: '/shows',
        method: 'GET',
        statusCode: 200,
        responseBody: '{"ok":true}',
        createdAt: 1,
        updatedAt: 1,
      },
    ]);

    onRulesChangedMock.mockImplementation(callback => {
      onRulesChangedCallback = callback;
      return () => undefined;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    getRulesMock.mockReset();
    onRulesChangedMock.mockReset();
  });

  test('posts initial rules and responds to rules request message', async () => {
    const postMessageSpy = vi.spyOn(window, 'postMessage').mockImplementation(() => undefined);

    await import('./main');
    await Promise.resolve();

    expect(getRulesMock).toHaveBeenCalledTimes(1);
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        source: INTERCEPTO_MESSAGE_SOURCE,
        type: INTERCEPTO_RULES_UPDATE,
        rules: expect.any(Array),
      },
      '*',
    );

    window.dispatchEvent(
      new MessageEvent('message', {
        source: window,
        data: {
          source: INTERCEPTO_MESSAGE_SOURCE,
          type: INTERCEPTO_REQUEST_RULES,
        },
      }),
    );
    await Promise.resolve();

    expect(getRulesMock).toHaveBeenCalledTimes(2);
  });

  test('forwards rule updates from storage listener', async () => {
    const postMessageSpy = vi.spyOn(window, 'postMessage').mockImplementation(() => undefined);

    await import('./main');

    const updatedRules: Rule[] = [
      {
        id: 'r-2',
        name: 'Mock empty cart',
        enabled: true,
        showNotifications: true,
        urlMatch: '/cast',
        method: 'GET',
        statusCode: 201,
        responseBody: '{"source":"update"}',
        createdAt: 1,
        updatedAt: 2,
      },
    ];

    if (!onRulesChangedCallback) throw new Error('Expected onRulesChanged callback to be registered');
    onRulesChangedCallback(updatedRules);

    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        source: INTERCEPTO_MESSAGE_SOURCE,
        type: INTERCEPTO_RULES_UPDATE,
        rules: updatedRules,
      },
      '*',
    );
  });

  test('shows a toast when a matched rule message is received', async () => {
    await import('./main');

    window.dispatchEvent(
      new MessageEvent('message', {
        source: window,
        data: {
          source: INTERCEPTO_MESSAGE_SOURCE,
          type: INTERCEPTO_RULE_MATCHED,
          ruleName: 'Mock empty cart',
          method: 'GET',
        },
      }),
    );

    expect(notifyRuleMatchedMock).toHaveBeenCalledWith('Mock empty cart', 'GET');
  });
});
