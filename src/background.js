'use strict';

const src = chrome.runtime.getURL('sdk/index.min.js');

chrome.webNavigation.onCompleted.addListener((details) => {
  // 如果关键配置变更：删除缓存、刷新后应用新配置
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg === 'remove-cache') {
      chrome.scripting.executeScript({
        target: {
          tabId: details.tabId
        },
        func: () => {
          sessionStorage.setItem(
            'page-spy-room',
            JSON.stringify({ usable: false })
          );
        }
      });
    }
  });
  chrome.storage.local.get('pagespy', function (result) {
    // 当前页面 URL
    const currentUrl = details.url;
    if (!result.pagespy) return;
    const { rules, ...config } = result.pagespy;
    if (!rules) return;
    const ruleReg = rules.split('\n').map((i) => new RegExp(i));

    const isMatched = ruleReg.some((i) => i.test(currentUrl));
    console.log({ isMatched, currentUrl });
    if (isMatched) {
      chrome.action.setBadgeBackgroundColor({
        color: '#17ae49'
      });
      chrome.action.setBadgeText({
        tabId: details.tabId,
        text: 'on'
      });
      chrome.action.setBadgeTextColor({
        color: 'white'
      });
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        world: 'MAIN',
        func: (src, config) => {
          const script = document.createElement('script');
          script.src = src;
          script.crossOrigin = 'anonymous';

          script.onload = () => {
            const { ssl, api, clientOrigin, project, title, autoRender } =
              config;

            const deployUrl = config['deploy-url'];
            const enableSSL = ssl === 'on';
            const userCfg = {
              api: '',
              clientOrigin: '',
              project: project || 'default',
              title: title || '--',
              autoRender: autoRender === 'yes',
              enableSSL
            };
            const scheme = enableSSL ? 'https://' : 'http://';
            if (deployUrl) {
              const url = new URL(`${scheme}${deployUrl}`);
              userCfg.api = url.host;
              userCfg.clientOrigin = url.origin;
            }
            if (api) {
              userCfg.api = api;
            }
            if (clientOrigin) {
              userCfg.clientOrigin = clientOrigin;
            }
            window.$pageSpy = new window.PageSpy(userCfg);
          };

          script.onerror = (e) => {
            console.warn('[PageSpy Extension] 加载失败: ', e);
          };

          document.head.appendChild(script);
        },
        args: [src, config]
      });
    } else {
      chrome.action.setBadgeText({
        tabId: details.tabId,
        text: ''
      });
    }
  });
});
