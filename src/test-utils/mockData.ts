import { Rule, RuleDraft } from '@/types/rule';

export const mockRule: Rule = {
  id: 'r-1',
  name: 'Mock tv shows',
  enabled: true,
  showNotifications: true,
  urlMatch: '/shows',
  method: 'GET',
  statusCode: 200,
  responseBody: '{"ok":true}',
  createdAt: 1,
  updatedAt: 1,
  delayMs: 0,
};

export const mockRuleDraft: RuleDraft = {
  name: 'Mock empty cart',
  enabled: true,
  showNotifications: true,
  urlMatch: '/cart',
  method: 'GET',
  statusCode: 200,
  responseBody: '{"items":[]}',
  delayMs: 0,
};
