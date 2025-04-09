import { matchCurrentTab } from '../utils';
import { PAGE_SPY_EXTENSION_CONFIG_KEY } from './constant';
import { isEqual } from 'lodash-es';

chrome.storage.local.get('pagespy', ({ pagespy }) => {
  const cache = JSON.parse(
    sessionStorage.getItem(PAGE_SPY_EXTENSION_CONFIG_KEY) || '{}'
  );
  if (pagespy) {
    if (isEqual(pagespy, cache)) return;

    sessionStorage.setItem(
      PAGE_SPY_EXTENSION_CONFIG_KEY,
      JSON.stringify(pagespy)
    );
    window.location.reload();
  } else {
    sessionStorage.removeItem(PAGE_SPY_EXTENSION_CONFIG_KEY);
    sessionStorage.removeItem('page-spy-room');
  }
});

chrome.storage.local.onChanged.addListener((changes) => {
  if (changes.pagespy) {
    const { newValue } = changes.pagespy;
    sessionStorage.setItem(
      PAGE_SPY_EXTENSION_CONFIG_KEY,
      JSON.stringify(newValue)
    );

    const isMatched = matchCurrentTab(newValue.domainRules, location.origin);
    const isRunning =
      sessionStorage.getItem('page-spy-room') ||
      document.querySelector('#__pageSpy');

    if (!isMatched && isRunning) {
      sessionStorage.removeItem('page-spy-room');
    }
    if (isMatched || isRunning) {
      window.location.reload();
    }
  }
});
