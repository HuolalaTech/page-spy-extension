'use strict';

const src = chrome.runtime.getURL('sdk/index.min.js');
const dataHarborSrc = chrome.runtime.getURL('sdk/plugins/data-harbor.min.js');
const rrwebSrc = chrome.runtime.getURL('sdk/plugins/rrweb.min.js');
const pluginSrcs = [dataHarborSrc, rrwebSrc];

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
    const { rules, open, ...config } = result.pagespy;
    if (open !== 'on' || !rules) return;
    const ruleReg = rules.split('\n').map((i) => new RegExp(i));
    const isMatched = ruleReg.some((i) => i.test(currentUrl));
    if (isMatched) {
      chrome.action.setBadgeBackgroundColor({
        color: '#17ae49'
      });
      chrome.action.setBadgeText({
        tabId: details.tabId,
        text: 'on'
      });
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        world: 'MAIN',
        func: (src, config, pluginSrcs) => {
          const { dataHarborOpen, rrwebOpen } = config;
          const isDataHarborOpen = dataHarborOpen === 'on';
          const isRrwebOpen = rrwebOpen === 'on';
          function createScript(src, successCb, errorCb) {
            return new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = src;
              script.crossOrigin = 'anonymous';
              script.onload = () => {
                successCb(script);
                resolve(script);
              };
              script.onerror = (e) => {
                errorCb(e);
                reject(new Error('Failed to load script' + src));
              };
              document.head.appendChild(script);
            });
          }
          const dataHarborScript = {
            src: pluginSrcs[0],
            successCb: (script) => {
              console.log('[PageSpy DataHarborPlugin] 加载成功');
            },
            errorCb: (e) => {
              console.warn('[PageSpy DataHarborPlugin] 加载失败: ', e);
            }
          };
          const rrwebScript = {
            src: pluginSrcs[1],
            successCb: (script) => {
              console.log('[PageSpy RRWebPlugin] 加载成功');
            },
            errorCb: (e) => {
              console.warn('[PageSpy RRWebPlugin] 加载失败: ', e);
            }
          };
          const scriptList = [];
          if (isRrwebOpen) {
            scriptList.push(rrwebScript);
          }
          if (isDataHarborOpen) {
            scriptList.push(dataHarborScript);
          }
          Promise.all(
            scriptList.map((i) => createScript(i.src, i.successCb, i.errorCb))
          )
            .then(() => {
              createScript(
                src,
                (script) => {
                  console.log('[PageSpy Extension] 加载成功');
                  const {
                    ssl,
                    offline,
                    api,
                    clientOrigin,
                    project,
                    title,
                    autoRender,
                    dataHarborMaximum,
                    dataHarborCaredData
                  } = config;
                  const deployUrl = config['deploy-url'];
                  const enableSSL = ssl === 'on';
                  const isOffline = offline === 'on';
                  const userCfg = {
                    api: '',
                    offline: isOffline,
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
                  if (isDataHarborOpen) {
                    const caredData = dataHarborCaredData
                      ? dataHarborCaredData.split(',')
                      : [
                          'console',
                          'network',
                          'system',
                          'storage',
                          'rrweb-event'
                        ];
                    const config = {
                      maximum: Number(dataHarborMaximum),
                      caredData: caredData.reduce((acc, cur) => {
                        acc[cur.trim()] = true;
                        return acc;
                      }, {})
                    };
                    window.$harbor = new window.DataHarborPlugin(config);
                    window.PageSpy.registerPlugin(window.$harbor);
                    if (isRrwebOpen) {
                      window.$rrweb = new window.RRWebPlugin();
                      window.PageSpy.registerPlugin(window.$rrweb);
                    }
                  }
                  window.$pageSpy = new window.PageSpy(userCfg);
                },
                (e) => {
                  console.warn('[PageSpy Extension] 加载失败: ', e);
                }
              );
            })
            .catch((e) => {
              console.warn('[PageSpy Extension] 加载失败: ', e);
            });
        },
        args: [src, config, pluginSrcs]
      });
    } else {
      chrome.action.setBadgeText({
        tabId: details.tabId,
        text: ''
      });
    }
  });
});
