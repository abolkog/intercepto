import { INTERCEPTO_MESSAGE_SOURCE, INTERCEPTO_REQUEST_RULES } from '@/constants';
import { installInterceptor } from './installInterceptor';

installInterceptor();

window.postMessage(
  {
    source: INTERCEPTO_MESSAGE_SOURCE,
    type: INTERCEPTO_REQUEST_RULES,
  },
  '*',
);
