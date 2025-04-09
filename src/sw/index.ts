import { matchCurrentTab } from '../utils';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.remove(['pagespy']);
});

chrome.webNavigation.onCommitted.addListener(async (details) => {
  const { url, tabId } = details;
  if (!Number.isFinite(+tabId)) return;
  if (!url.startsWith('http')) return;

  const { pagespy } = (await chrome.storage.local.get('pagespy')) as {
    pagespy: I.Config;
  };
  if (!pagespy || !pagespy.domainRules.trim()) return;

  const isMatched = matchCurrentTab(pagespy.domainRules, url);

  if (isMatched) {
    chrome.action.setBadgeBackgroundColor({
      color: '#17ae49'
    });
    chrome.action.setBadgeText({
      tabId,
      text: 'on'
    });
    chrome.action.setBadgeTextColor({
      color: 'white'
    });
  } else {
    chrome.action.setBadgeText({
      tabId,
      text: ''
    });
  }
});
