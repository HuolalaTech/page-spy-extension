chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.remove(['pagespy']);
});

const pageSpyUrl = chrome.runtime.getURL('sdk/index.min.js');
const dataHarborUrl = chrome.runtime.getURL('sdk/plugins/data-harbor.min.js');
const rrwebUrl = chrome.runtime.getURL('sdk/plugins/rrweb.min.js');
const plugins = [dataHarborUrl, rrwebUrl];

async function handleInjectPageSpy(data: { url: string; tabId: number }) {
  const { url, tabId } = data;
  if (!Number.isFinite(+tabId)) return;
  if (!url.startsWith('http')) return;

  const { pagespy } = (await chrome.storage.local.get('pagespy')) as {
    pagespy: I.Config;
  };
  if (!pagespy || !pagespy.enabled || !pagespy.domainRules.trim()) return;

  const isMatched = pagespy.domainRules
    .split('\n')
    .map((d) => new RegExp(d.trim()))
    .some((r) => r.test(url));

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
    chrome.scripting.executeScript({
      target: { tabId },
      world: 'MAIN',
      func: (src: string, config: I.Config, plugins: string[]) => {
        const {
          enableSSL,
          serviceAddress,
          offline,
          api,
          clientOrigin,
          project,
          title,
          autoRender,
          dataHarborPlugin,
          rrWebPlugin
        } = config;
        function createScript(
          src: string,
          successCb: (s: HTMLScriptElement) => void,
          errorCb: (e: Event | string) => void
        ) {
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
          src: plugins[0],
          successCb: () => {
            console.log('[PageSpy DataHarborPlugin] 加载成功');
          },
          errorCb: (e: Event | string) => {
            console.warn('[PageSpy DataHarborPlugin] 加载失败: ', e);
          }
        };
        const rrwebScript = {
          src: plugins[1],
          successCb: () => {
            console.log('[PageSpy RRWebPlugin] 加载成功');
          },
          errorCb: (e: Event | string) => {
            console.warn('[PageSpy RRWebPlugin] 加载失败: ', e);
          }
        };
        const scriptList = [];
        if (rrWebPlugin.enabled) {
          scriptList.push(rrwebScript);
        }
        if (dataHarborPlugin.enabled) {
          scriptList.push(dataHarborScript);
        }
        Promise.all(
          scriptList.map((i) => createScript(i.src, i.successCb, i.errorCb))
        )
          .then(() => {
            createScript(
              src,
              () => {
                console.log('[PageSpy Extension] 加载成功');
                const userCfg = {
                  api,
                  clientOrigin,
                  enableSSL,
                  offline,
                  project,
                  title,
                  autoRender
                };
                const scheme = enableSSL ? 'https://' : 'http://';
                if (serviceAddress) {
                  const url = new URL(`${scheme}${serviceAddress}`);
                  userCfg.api = url.host;
                  userCfg.clientOrigin = url.origin;
                }
                if (dataHarborPlugin.enabled) {
                  const config = {
                    maximum: Number(dataHarborPlugin.maximum)
                  };
                  window.$harbor = new window.DataHarborPlugin(config);
                  window.PageSpy.registerPlugin(window.$harbor);
                  if (rrWebPlugin.enabled) {
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
      args: [pageSpyUrl, pagespy, plugins]
    });
  } else {
    chrome.action.setBadgeText({
      tabId,
      text: ''
    });
  }
}

chrome.webNavigation.onCompleted.addListener(async (details) => {
  const { url, tabId } = details;
  handleInjectPageSpy({ url, tabId });
});
