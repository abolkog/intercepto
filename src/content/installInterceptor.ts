import {
  INTERCEPTO_STATE_KEY,
  INTERCEPTO_REQUEST_CAPTURED,
  INTERCEPTO_RULE_MATCHED,
  INTERCEPTO_RULES_UPDATE,
  INTERCEPTO_MESSAGE_SOURCE,
} from '@/constants';
import { type InterceptoMessage, type InterceptoRulesUpdateMessage, type XhrMeta } from '@/types/interceptor';
import { Rule } from '@/types/rule';
import type { CapturedRequestDraft, RequestSource } from '@/types/capture';

export function installInterceptor(): void {
  const globalWindow = window as Window & {
    [INTERCEPTO_STATE_KEY]?: {
      rules: Rule[];
      originalFetch: typeof window.fetch;
      originalXhrOpen: XMLHttpRequest['open'];
      originalXhrSend: XMLHttpRequest['send'];
      installed: boolean;
    };
  };

  if (globalWindow[INTERCEPTO_STATE_KEY]?.installed) {
    return;
  }

  const findMatchingRule = (url: string, method: string, rules: Rule[]): Rule | undefined => {
    const normalizedMethod = method.toUpperCase();
    return rules.find(rule => {
      if (!rule.enabled) return false;
      if (!url.includes(rule.urlMatch)) return false;
      return rule.method === '*' || rule.method.toUpperCase() === normalizedMethod;
    });
  };

  const getContentType = (body: string): string => {
    try {
      JSON.parse(body);
      return 'application/json; charset=utf-8';
    } catch {
      return 'text/plain; charset=utf-8';
    }
  };

  const notifyRuleMatched = (rule: Rule): void => {
    if (!rule.showNotifications) return;
    const message: Extract<InterceptoMessage, { type: typeof INTERCEPTO_RULE_MATCHED }> = {
      source: INTERCEPTO_MESSAGE_SOURCE,
      type: INTERCEPTO_RULE_MATCHED,
      ruleName: rule.name,
      method: rule.method,
      url: rule.urlMatch,
    };

    window.postMessage(message, '*');
  };

  const notifyRequestCaptured = (
    inputUrl: string,
    method: string,
    source: RequestSource,
    mocked: boolean,
    statusCode?: number,
    responseBody?: string,
    matchedRuleName?: string,
  ): void => {
    const toAbsoluteUrl = (): string => {
      try {
        return new URL(inputUrl, window.location.href).toString();
      } catch {
        return inputUrl;
      }
    };

    const payload: CapturedRequestDraft = {
      method: method.toUpperCase(),
      url: toAbsoluteUrl(),
      pageUrl: window.location.href,
      source,
      capturedAt: Date.now(),
      statusCode,
      responseBody,
      mocked,
      matchedRuleName,
    };

    const message: Extract<InterceptoMessage, { type: typeof INTERCEPTO_REQUEST_CAPTURED }> = {
      source: INTERCEPTO_MESSAGE_SOURCE,
      type: INTERCEPTO_REQUEST_CAPTURED,
      request: payload,
    };

    window.postMessage(message, '*');
  };

  const messageListener = (event: MessageEvent<InterceptoRulesUpdateMessage>) => {
    if (event.source !== window) return;
    if (!event.data || event.data.source !== INTERCEPTO_MESSAGE_SOURCE || event.data.type !== INTERCEPTO_RULES_UPDATE)
      return;

    const state = globalWindow[INTERCEPTO_STATE_KEY];
    if (!state) return;

    state.rules = [...event.data.rules].sort((a, b) => b.updatedAt - a.updatedAt);
  };

  const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

  const originalFetch = window.fetch.bind(window);
  const originalXhrOpen = XMLHttpRequest.prototype.open;
  const originalXhrSend = XMLHttpRequest.prototype.send;

  const xhrMeta = new WeakMap<XMLHttpRequest, XhrMeta>();

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const state = globalWindow[INTERCEPTO_STATE_KEY];
    if (!state) return originalFetch(input, init);

    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    const method = init?.method ?? (typeof input === 'string' || input instanceof URL ? 'GET' : input.method);
    const matchedRule = findMatchingRule(url, method, state.rules);

    if (!matchedRule) {
      const response = await originalFetch(input, init);
      let responseBody: string | undefined;
      try {
        responseBody = await response.clone().text();
      } catch {
        responseBody = undefined;
      }

      notifyRequestCaptured(url, method, 'fetch', false, response.status, responseBody);
      return response;
    }

    notifyRuleMatched(matchedRule);

    const delayMs = Math.max(0, matchedRule.delayMs ?? 0);
    if (delayMs > 0) {
      await sleep(delayMs);
    }

    const body = matchedRule.responseBody ?? '';
    notifyRequestCaptured(url, method, 'fetch', true, matchedRule.statusCode, body, matchedRule.name);

    return new Response(body, {
      status: matchedRule.statusCode,
      headers: {
        'content-type': getContentType(body),
      },
    });
  };

  XMLHttpRequest.prototype.open = function open(method: string, url: string | URL, ...rest: unknown[]) {
    xhrMeta.set(this, { method, url: String(url) });
    return originalXhrOpen.call(
      this,
      method,
      url,
      ...(rest as Parameters<XMLHttpRequest['open']> extends [string, string | URL, ...infer R] ? R : never),
    );
  };

  XMLHttpRequest.prototype.send = function send(body?: Document | XMLHttpRequestBodyInit | null) {
    const state = globalWindow[INTERCEPTO_STATE_KEY];
    const meta = xhrMeta.get(this);

    if (!state || !meta) {
      return originalXhrSend.call(this, body);
    }

    const matchedRule = findMatchingRule(meta.url, meta.method, state.rules);
    if (!matchedRule) {
      this.addEventListener(
        'loadend',
        () => {
          let responseBody: string | undefined;
          try {
            responseBody = typeof this.responseText === 'string' ? this.responseText : undefined;
          } catch {
            responseBody = undefined;
          }

          notifyRequestCaptured(meta.url, meta.method, 'xhr', false, this.status, responseBody);
        },
        { once: true },
      );
      return originalXhrSend.call(this, body);
    }

    notifyRuleMatched(matchedRule);

    const responseBody = matchedRule.responseBody ?? '';
    const contentType = getContentType(responseBody);

    Object.defineProperties(this, {
      readyState: { configurable: true, get: () => 4 },
      status: { configurable: true, get: () => matchedRule.statusCode },
      statusText: { configurable: true, get: () => '' },
      response: { configurable: true, get: () => responseBody },
      responseText: { configurable: true, get: () => responseBody },
      responseURL: { configurable: true, get: () => meta.url },
      responseXML: { configurable: true, get: () => null },
    });

    this.getAllResponseHeaders = () => `content-type: ${contentType}\r\n`;
    this.getResponseHeader = (name: string) => (name.toLowerCase() === 'content-type' ? contentType : null);

    const dispatchMockEvents = () => {
      this.dispatchEvent(new Event('readystatechange'));
      this.dispatchEvent(new ProgressEvent('load'));
      this.dispatchEvent(new ProgressEvent('loadend'));

      this.onreadystatechange?.(new Event('readystatechange'));
      this.onload?.(new ProgressEvent('load'));
      this.onloadend?.(new ProgressEvent('loadend'));

      notifyRequestCaptured(meta.url, meta.method, 'xhr', true, matchedRule.statusCode, responseBody, matchedRule.name);
    };

    const delayMs = Math.max(0, matchedRule.delayMs ?? 0);
    if (delayMs > 0) {
      setTimeout(dispatchMockEvents, delayMs);
    } else {
      queueMicrotask(dispatchMockEvents);
    }

    return undefined;
  };

  window.addEventListener('message', messageListener);

  globalWindow[INTERCEPTO_STATE_KEY] = {
    rules: [],
    originalFetch,
    originalXhrOpen,
    originalXhrSend,
    installed: true,
  };
}
