import { Rule } from '@/types/rule';
import { getRules, onRulesChanged } from '@/utils/ruleStorage';
import { INTERCEPTO_CAPTURE_ENABLED_KEY } from '@/constants';

function renderActionBadge(rules: Rule[], captureEnabled: boolean): void {
  if (captureEnabled) {
    chrome.action.setBadgeText({ text: 'REC' });
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
    chrome.action.setTitle({ title: 'Intercepto - Capturing requests' });
    return;
  }

  const activeCount = rules.filter(rule => rule.enabled).length;
  chrome.action.setBadgeText({ text: activeCount > 0 ? String(activeCount) : '' });
  chrome.action.setBadgeBackgroundColor({ color: '#0ea5e9' });
  chrome.action.setTitle({ title: 'Intercepto' });
}

async function updateActionIndicator(nextRules?: Rule[]): Promise<void> {
  const rules = nextRules ?? (await getRules());
  const data = await chrome.storage.local.get(INTERCEPTO_CAPTURE_ENABLED_KEY);
  const captureEnabled = data[INTERCEPTO_CAPTURE_ENABLED_KEY] === true;

  renderActionBadge(rules, captureEnabled);
}

chrome.runtime.onInstalled.addListener(() => {
  void updateActionIndicator();
});

chrome.runtime.onStartup.addListener(() => {
  void updateActionIndicator();
});

void updateActionIndicator();

onRulesChanged(rules => {
  void updateActionIndicator(rules);
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local' || !changes[INTERCEPTO_CAPTURE_ENABLED_KEY]) return;
  void updateActionIndicator();
});
