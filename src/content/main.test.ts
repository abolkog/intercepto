import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { type InterceptoRule } from '@/types/interceptor';
import { INTERCEPTO_MESSAGE_SOURCE, INTERCEPTO_REQUEST_RULES, INTERCEPTO_RULES_UPDATE } from '@/constants';

const getRulesMock = vi.fn<() => Promise<InterceptoRule[]>>();
const onRulesChangedMock = vi.fn<(callback: (rules: InterceptoRule[]) => void) => () => void>();

vi.mock('@/utils/ruleStorage', () => ({
  getRules: getRulesMock,
  onRulesChanged: onRulesChangedMock,
}));

describe('content main bridge', () => {
  let onRulesChangedCallback: ((rules: InterceptoRule[]) => void) | undefined;

  beforeEach(() => {
    onRulesChangedCallback = undefined;
    getRulesMock.mockResolvedValue([
      {
        id: 'r-1',
        enabled: true,
        urlMatch: '/shows',
        method: 'GET',
        statusCode: 200,
        responseBody: '{"ok":true}',
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

    const updatedRules: InterceptoRule[] = [
      {
        id: 'r-2',
        enabled: true,
        urlMatch: '/cast',
        method: 'GET',
        statusCode: 201,
        responseBody: '{"source":"update"}',
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
});
