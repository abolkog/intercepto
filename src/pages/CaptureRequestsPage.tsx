import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '@/components/ui/Button';
import useCapturedRequests from '@/hooks/useCapturedRequests';
import { INTERCEPTO_CAPTURE_ENABLED_KEY, INTERCEPTO_SELECTED_RULE_ID_KEY } from '@/constants';
import { clx } from '@/utils/common';
import type { HttpMethod, RuleDraft } from '@/types/rule';
import { addRule } from '@/utils/ruleStorage';

function formatCapturedAt(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

function statusLabel(statusCode: number | undefined): string {
  return typeof statusCode === 'number' ? String(statusCode) : '-';
}

function toHttpMethod(method: string): HttpMethod {
  const normalizedMethod = method.toUpperCase();
  const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
  return methods.includes(normalizedMethod as HttpMethod) ? (normalizedMethod as HttpMethod) : '*';
}

function deriveUrlMatch(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}` || parsed.pathname || url;
  } catch {
    return url;
  }
}

function buildRuleName(method: string, urlMatch: string): string {
  return `Mock ${method.toUpperCase()} ${urlMatch}`;
}

function defaultResponseBody(responseBody: string | undefined): string {
  if (!responseBody || !responseBody.trim()) {
    return '{\n  \n}';
  }

  try {
    return JSON.stringify(JSON.parse(responseBody), null, 2);
  } catch {
    return responseBody;
  }
}

export default function CaptureRequestsPage() {
  const { requests, clearAll } = useCapturedRequests();
  const navigate = useNavigate();
  const [captureEnabled, setCaptureEnabled] = useState(false);
  const [creatingRequestId, setCreatingRequestId] = useState<string | null>(null);
  const hasRequests = (requests?.length ?? 0) > 0;

  useEffect(() => {
    void chrome.storage.local.get(INTERCEPTO_CAPTURE_ENABLED_KEY).then(data => {
      setCaptureEnabled(data[INTERCEPTO_CAPTURE_ENABLED_KEY] === true);
    });

    const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName !== 'local' || !changes[INTERCEPTO_CAPTURE_ENABLED_KEY]) return;
      setCaptureEnabled(changes[INTERCEPTO_CAPTURE_ENABLED_KEY].newValue === true);
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  const toggleCapture = async () => {
    await chrome.storage.local.set({ [INTERCEPTO_CAPTURE_ENABLED_KEY]: !captureEnabled });
  };

  const createAndEditRuleFromRequest = async (requestId: string) => {
    const request = requests?.find(item => item.id === requestId);
    if (!request) return;

    const urlMatch = deriveUrlMatch(request.url);
    const ruleDraft: RuleDraft = {
      name: buildRuleName(request.method, urlMatch),
      enabled: false,
      showNotifications: false,
      urlMatch,
      method: toHttpMethod(request.method),
      statusCode: request.statusCode ?? 200,
      delayMs: 0,
      responseBody: defaultResponseBody(request.responseBody),
    };

    setCreatingRequestId(requestId);
    try {
      const createdRule = await addRule(ruleDraft);
      await chrome.storage.local.set({ [INTERCEPTO_SELECTED_RULE_ID_KEY]: createdRule.id });
      navigate('/');
    } finally {
      setCreatingRequestId(null);
    }
  };

  return (
    <>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-white">Capture Requests</h1>
            <span
              className={clx(
                captureEnabled ? 'bg-emerald-500/20 text-emerald-200' : 'bg-slate-500/20 text-slate-300',
                'inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ring-white/10',
              )}
            >
              <span
                className={clx(
                  captureEnabled ? 'bg-emerald-300 shadow-[0_0_8px_#6ee7b7]' : 'bg-slate-400',
                  'mr-2 inline-block size-1.5 rounded-full',
                )}
              />
              {captureEnabled ? 'Capturing ON' : 'Capturing OFF'}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-300">Requests captured from active tabs where Intercepto is injected.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 flex gap-2">
          <Button onClick={toggleCapture}>{captureEnabled ? 'Stop Capturing' : 'Start Capturing'}</Button>
          <Button variant="secondary" onClick={clearAll} disabled={!hasRequests}>
            Clear Captured Requests
          </Button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/5">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">
                      Method
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">
                      URL
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">
                      Source
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-white">
                      Captured At
                    </th>
                    <th scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-black/10">
                  {requests === undefined && (
                    <tr>
                      <td className="px-4 py-6 text-sm text-gray-400" colSpan={6}>
                        Loading captured requests...
                      </td>
                    </tr>
                  )}

                  {requests !== undefined && requests.length === 0 && (
                    <tr>
                      <td className="px-4 py-6 text-sm text-gray-400" colSpan={6}>
                        No captured requests yet. Keep this extension enabled, use your app, then come back here.
                      </td>
                    </tr>
                  )}

                  {requests?.map(request => (
                    <tr key={request.id}>
                      <td className="px-4 py-4 text-sm text-white">
                        <span
                          className={clx(
                            request.mocked ? 'bg-purple-500/20 text-purple-200' : 'bg-slate-500/20 text-slate-200',
                            'inline-flex items-center rounded-md px-2 py-1 font-mono text-xs font-semibold ring-1 ring-inset ring-white/10',
                          )}
                        >
                          {request.method}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-200">
                        <div className="max-w-xl truncate font-mono" title={request.url}>
                          {request.url}
                        </div>
                        {request.pageUrl && (
                          <p className="mt-1 max-w-xl truncate text-xs text-gray-500" title={request.pageUrl}>
                            From: {request.pageUrl}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-200">{statusLabel(request.statusCode)}</td>
                      <td className="px-4 py-4 text-sm text-gray-200">
                        <span className="capitalize">{request.source}</span>
                        {request.mocked && request.matchedRuleName && (
                          <p className="text-xs text-purple-300">Mocked by: {request.matchedRuleName}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-300">{formatCapturedAt(request.capturedAt)}</td>
                      <td className="px-4 py-4 text-right text-sm">
                        <Button
                          variant="secondary"
                          onClick={() => createAndEditRuleFromRequest(request.id)}
                          disabled={creatingRequestId === request.id}
                          className="text-xs px-2 py-1"
                        >
                          {creatingRequestId === request.id ? 'Opening...' : 'Create & Edit'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
