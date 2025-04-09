import { PAGE_SPY_EXTENSION_CONFIG_KEY } from './constant';
import { matchCurrentTab } from '../utils';

function main() {
  const cache = sessionStorage.getItem(PAGE_SPY_EXTENSION_CONFIG_KEY);

  if (cache) {
    const config = JSON.parse(cache);
    const { domainRules, enableSSL, serviceAddress, offline, project, title } =
      config;
    if (
      !window.PageSpy ||
      !window.DataHarborPlugin ||
      !window.RRWebPlugin ||
      [domainRules, enableSSL, serviceAddress, offline, project, title].some(
        (v) => v === undefined
      )
    ) {
      console.warn('[PageSpy Extension] Pre-check failed', {
        PageSpy: window.PageSpy,
        DataHarborPlugin: window.DataHarborPlugin,
        RRWebPlugin: window.RRWebPlugin,
        config
      });
      return;
    }

    const isMatched = matchCurrentTab(domainRules, location.origin);
    if (!isMatched) return;

    const userCfg = {
      enableSSL,
      offline,
      project,
      title,
      api: '',
      clientOrigin: ''
    };
    const scheme = userCfg.enableSSL ? 'https://' : 'http://';
    if (serviceAddress) {
      const { pathname, host } = new URL(`${scheme}${serviceAddress}`);
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
  }
}

main();
