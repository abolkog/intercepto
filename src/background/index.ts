import { Rule } from '@/types/rule';
import { getRules, onRulesChanged } from '@/utils/ruleStorage';

function updateBadge(rules: Rule[]): void {
  const activeCount = rules.filter(rule => rule.enabled).length;
  void chrome.action.setBadgeText({ text: activeCount > 0 ? String(activeCount) : '' });
  void chrome.action.setBadgeBackgroundColor({ color: '#0ea5e9' });
}

chrome.runtime.onInstalled.addListener(() => {
  getRules().then(updateBadge);
});

chrome.runtime.onStartup.addListener(() => {
  getRules().then(updateBadge);
});

onRulesChanged(updateBadge);
