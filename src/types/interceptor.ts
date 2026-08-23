import {
  INTERCEPTO_MESSAGE_SOURCE,
  INTERCEPTO_REQUEST_RULES,
  INTERCEPTO_RULE_MATCHED,
  INTERCEPTO_RULES_UPDATE,
} from '@/constants';
import type { Rule } from './rule';

export type InterceptoRulesUpdateMessage = {
  source: typeof INTERCEPTO_MESSAGE_SOURCE;
  type: typeof INTERCEPTO_RULES_UPDATE;
  rules: Rule[];
};

export type InterceptoRequestRulesMessage = {
  source: typeof INTERCEPTO_MESSAGE_SOURCE;
  type: typeof INTERCEPTO_REQUEST_RULES;
};

export type InterceptoRuleMatchedMessage = {
  source: typeof INTERCEPTO_MESSAGE_SOURCE;
  type: typeof INTERCEPTO_RULE_MATCHED;
  ruleName: string;
  method: Rule['method'];
};

export type InterceptoMessage =
  InterceptoRulesUpdateMessage | InterceptoRequestRulesMessage | InterceptoRuleMatchedMessage;

export type XhrMeta = {
  method: string;
  url: string;
};
