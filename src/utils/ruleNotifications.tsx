import { toast } from 'react-toastify';
import RuleMatchedToast from '@/components/RuleMatchedToast';

function getAppLogoUrl(): string {
  return typeof chrome !== 'undefined' && chrome.runtime?.getURL
    ? chrome.runtime.getURL('public/icons/icon16.png')
    : '/public/icons/icon16.png';
}

export function notifyRuleMatched(ruleName: string, method: string): void {
  toast(<RuleMatchedToast ruleName={ruleName} method={method} logoUrl={getAppLogoUrl()} />);
}
