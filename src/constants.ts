import { HttpMethod } from './types/rule';

export const HTTP_METHODS: HttpMethod[] = ['*', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export const INTERCEPTO_STATE_KEY = '__interceptoMockingState__';

export const INTERCEPTO_MESSAGE_SOURCE = 'intercepto-extension';
export const INTERCEPTO_RULES_UPDATE = 'INTERCEPTO_RULES_UPDATE';
export const INTERCEPTO_REQUEST_RULES = 'INTERCEPTO_REQUEST_RULES';
export const INTERCEPTO_RULE_MATCHED = 'INTERCEPTO_RULE_MATCHED';

export const INTERCEPTO_SELECTED_RULE_ID_KEY = 'intercepto:selectedRuleId';
