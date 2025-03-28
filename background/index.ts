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
  if (!pagespy || !pagespy.domainRules.trim()) return;

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
        const { enableSSL, serviceAddress, offline, project, title } = config;
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
          successCb: () => {},
          errorCb: (e: Event | string) => {
            console.warn(
              '[PageSpy Extension DataHarborPlugin] Load failed: ',
              e
            );
          }
        };
        const rrwebScript = {
          src: plugins[1],
          successCb: () => {},
          errorCb: (e: Event | string) => {
            console.warn('[PageSpy Extension RRWebPlugin] Load failed: ', e);
          }
        };
        const scriptList = [dataHarborScript, rrwebScript];
        Promise.all(
          scriptList.map((i) => createScript(i.src, i.successCb, i.errorCb))
        )
          .then(() => {
            createScript(
              src,
              () => {
                console.log('[PageSpy Extension] Loaded');

                const userCfg = {
                  enableSSL: Boolean(+enableSSL),
                  offline,
                  project,
                  title,
                  api: '',
                  clientOrigin: ''
                };
                const scheme = userCfg.enableSSL ? 'https://' : 'http://';
                if (serviceAddress) {
                  const { pathname, host } = new URL(
                    `${scheme}${serviceAddress}`
                  );
                  const address = pathname.endsWith('/')
                    ? `${host}${pathname.slice(0, -1)}`
                    : `${host}${pathname}`;
                  userCfg.api = address;
                  userCfg.clientOrigin = `${scheme}${address}`;
                }

                window.$harbor = new window.DataHarborPlugin();
                window.$rrweb = new window.RRWebPlugin();
                [window.$harbor, window.$rrweb].forEach((i) => {
                  window.PageSpy.registerPlugin(i);
                });
                window.$pageSpy = new window.PageSpy(userCfg);
              },
              (e) => {
                console.warn('[PageSpy Extension] Load failed: ', e);
              }
            );
          })
          .catch((e) => {
            console.warn('[PageSpy Extension] Load failed: ', e);
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
