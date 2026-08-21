export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | '*';

export type Rule = {
  id: string;
  name: string;
  enabled: boolean;
  urlMatch: string;
  method: HttpMethod;
  statusCode: number;
  responseBody: string;
  createdAt: number;
  updatedAt: number;
};

export type RuleDraft = Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>;
