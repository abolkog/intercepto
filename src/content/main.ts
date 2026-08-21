import { getRules, onRulesChanged } from '@/utils/ruleStorage';
import { type InterceptoRequestRulesMessage, type InterceptoRulesUpdateMessage } from '@/types/interceptor';
import { INTERCEPTO_MESSAGE_SOURCE, INTERCEPTO_REQUEST_RULES, INTERCEPTO_RULES_UPDATE } from '@/constants';

function postRulesUpdateMessage(message: InterceptoRulesUpdateMessage): void {
  window.postMessage(message, '*');
}

function pushRulesToPage(): void {
  void getRules().then(rules => {
    postRulesUpdateMessage({
      source: INTERCEPTO_MESSAGE_SOURCE,
      type: INTERCEPTO_RULES_UPDATE,
      rules,
    });
  });
}

pushRulesToPage();

window.addEventListener('message', (event: MessageEvent<InterceptoRequestRulesMessage>) => {
  if (event.source !== window) return;
  if (!event.data || event.data.source !== INTERCEPTO_MESSAGE_SOURCE) return;
  if (event.data.type !== INTERCEPTO_REQUEST_RULES) return;

  pushRulesToPage();
});

onRulesChanged(rules => {
  postRulesUpdateMessage({
    source: INTERCEPTO_MESSAGE_SOURCE,
    type: INTERCEPTO_RULES_UPDATE,
    rules,
  });
});
