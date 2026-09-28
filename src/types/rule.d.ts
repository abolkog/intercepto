export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | '*';

export type Rule = {
  id: string;
  name: string;
  group?: string;
  enabled: boolean;
  showNotifications: boolean;
  urlMatch: string;
  method: HttpMethod;
  statusCode: number;
  delayMs: number;
  responseBody: string;
  createdAt: number;
  updatedAt: number;
};

export type RuleDraft = Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>;

export type Group = {
  name: string;
  description?: string;
};
