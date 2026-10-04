import {
  addCapturedRequest,
  clearCapturedRequests,
  getCapturedRequests,
  onCapturedRequestsChanged,
} from './capturedRequestsStorage';
import { chromeMock } from '../test-utils/chromeMock';

beforeEach(() => {
  chromeMock.__reset();
});

describe('capturedRequestsStorage', () => {
  it('returns an empty list when nothing is stored', async () => {
    expect(await getCapturedRequests()).toEqual([]);
  });

  it('adds captured requests and keeps latest first', async () => {
    await addCapturedRequest({
      method: 'GET',
      url: 'https://example.com/api/first',
      pageUrl: 'https://example.com',
      source: 'fetch',
      capturedAt: 1,
      mocked: false,
      statusCode: 200,
    });

    await addCapturedRequest({
      method: 'POST',
      url: 'https://example.com/api/second',
      pageUrl: 'https://example.com',
      source: 'xhr',
      capturedAt: 2,
      mocked: true,
      matchedRuleName: 'Mock second',
      statusCode: 201,
    });

    const requests = await getCapturedRequests();
    expect(requests).toHaveLength(2);
    expect(requests[0].url).toBe('https://example.com/api/second');
    expect(requests[1].url).toBe('https://example.com/api/first');
  });

  it('clears captured requests', async () => {
    await addCapturedRequest({
      method: 'GET',
      url: 'https://example.com/api/first',
      pageUrl: 'https://example.com',
      source: 'fetch',
      capturedAt: 1,
      mocked: false,
      statusCode: 200,
    });

    await clearCapturedRequests();
    expect(await getCapturedRequests()).toEqual([]);
  });

  it('notifies subscribers when captured requests change', async () => {
    const callback = vi.fn();
    const unsubscribe = onCapturedRequestsChanged(callback);

    await addCapturedRequest({
      method: 'GET',
      url: 'https://example.com/api/first',
      pageUrl: 'https://example.com',
      source: 'fetch',
      capturedAt: 1,
      mocked: false,
      statusCode: 200,
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0]).toHaveLength(1);

    unsubscribe();

    await addCapturedRequest({
      method: 'POST',
      url: 'https://example.com/api/second',
      pageUrl: 'https://example.com',
      source: 'xhr',
      capturedAt: 2,
      mocked: true,
      matchedRuleName: 'Mock second',
      statusCode: 201,
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
