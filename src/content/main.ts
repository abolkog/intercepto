import { createRoot } from 'react-dom/client';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { getRules, onRulesChanged } from '@/utils/ruleStorage';
import {
  type InterceptoRequestRulesMessage,
  type InterceptoRuleMatchedMessage,
  type InterceptoRulesUpdateMessage,
} from '@/types/interceptor';
import {
  INTERCEPTO_MESSAGE_SOURCE,
  INTERCEPTO_REQUEST_RULES,
  INTERCEPTO_RULE_MATCHED,
  INTERCEPTO_RULES_UPDATE,
} from '@/constants';
import { notifyRuleMatched } from '@/utils/ruleNotifications';

import 'react-toastify/dist/ReactToastify.css';

const container = document.createElement('div');
container.id = 'intercepto-toast-root';
document.documentElement.appendChild(container);

createRoot(container).render(
  React.createElement(ToastContainer, {
    position: 'top-center',
    closeOnClick: true,
    pauseOnHover: true,
    theme: 'dark',
  }),
);

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

window.addEventListener('message', (event: MessageEvent<InterceptoRuleMatchedMessage>) => {
  if (event.source !== window) return;
  if (!event.data || event.data.source !== INTERCEPTO_MESSAGE_SOURCE) return;
  if (event.data.type !== INTERCEPTO_RULE_MATCHED) return;

  notifyRuleMatched(event.data.ruleName, event.data.method, event.data.url);
});

onRulesChanged(rules => {
  postRulesUpdateMessage({
    source: INTERCEPTO_MESSAGE_SOURCE,
    type: INTERCEPTO_RULES_UPDATE,
    rules,
  });
});
