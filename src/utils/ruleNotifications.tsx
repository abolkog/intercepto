import { toast } from 'react-toastify';
import RuleMatchedToast from '@/components/RuleMatchedToast';

function getAppLogoUrl(): string {
  return typeof chrome !== 'undefined' && chrome.runtime?.getURL
    ? chrome.runtime.getURL('public/icons/icon16.png')
    : '/public/icons/icon16.png';
}

export function notifyRuleMatched(ruleName: string, method: string, url: string): void {
  toast(<RuleMatchedToast ruleName={ruleName} method={method} url={url} logoUrl={getAppLogoUrl()} />);
}
