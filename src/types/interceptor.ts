import { INTERCEPTO_MESSAGE_SOURCE, INTERCEPTO_REQUEST_RULES, INTERCEPTO_RULES_UPDATE } from '@/constants';
import type { Rule } from './rule';

export type InterceptoRule = Pick<
  Rule,
  'id' | 'enabled' | 'urlMatch' | 'method' | 'statusCode' | 'responseBody' | 'updatedAt'
>;

export type InterceptoRulesUpdateMessage = {
  source: typeof INTERCEPTO_MESSAGE_SOURCE;
  type: typeof INTERCEPTO_RULES_UPDATE;
  rules: InterceptoRule[];
};

export type InterceptoRequestRulesMessage = {
  source: typeof INTERCEPTO_MESSAGE_SOURCE;
  type: typeof INTERCEPTO_REQUEST_RULES;
};

export type InterceptoMessage = InterceptoRulesUpdateMessage | InterceptoRequestRulesMessage;

export type XhrMeta = {
  method: string;
  url: string;
};
