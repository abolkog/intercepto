export type RequestSource = 'fetch' | 'xhr';

export type CapturedRequest = {
  id: string;
  method: string;
  url: string;
  pageUrl: string;
  source: RequestSource;
  capturedAt: number;
  statusCode?: number;
  responseBody?: string;
  mocked: boolean;
  matchedRuleName?: string;
};

export type CapturedRequestDraft = Omit<CapturedRequest, 'id'>;
