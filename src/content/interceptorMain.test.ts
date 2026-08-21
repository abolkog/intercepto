import { INTERCEPTO_MESSAGE_SOURCE, INTERCEPTO_REQUEST_RULES } from '@/constants';
import { afterEach, describe, expect, test, vi } from 'vitest';

const installInterceptorMock = vi.fn();

vi.mock('./installInterceptor', () => ({
  installInterceptor: installInterceptorMock,
}));

describe('interceptorMain bootstrap', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
    installInterceptorMock.mockReset();
  });

  test('installs interceptor and requests rules from isolated content script', async () => {
    const postMessageSpy = vi.spyOn(window, 'postMessage').mockImplementation(() => undefined);

    await import('./interceptorMain');

    expect(installInterceptorMock).toHaveBeenCalledTimes(1);
    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        source: INTERCEPTO_MESSAGE_SOURCE,
        type: INTERCEPTO_REQUEST_RULES,
      },
      '*',
    );
  });
});
