/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import PageSpy from '@huolala-tech/page-spy-browser';
import DataHarborPlugin from '@huolala-tech/page-spy-plugin-data-harbor';
import RRWebPlugin from '@huolala-tech/page-spy-plugin-rrweb';

declare global {
  interface Window {
    PageSpy: typeof PageSpy;
    $pageSpy: PageSpy;

    DataHarborPlugin: typeof DataHarborPlugin;
    $harbor: DataHarborPlugin;

    RRWebPlugin: typeof RRWebPlugin;
    $rrweb: RRWebPlugin;
  }

  declare namespace I {
    interface Config {
      offline: boolean;
      enableSSL: boolean;
      serviceAddress: string;
      domainRules: string;
      project: string;
      title: string;
    }

    interface InjectMessage {
      type: 'inject';
      url: string;
      tabId: number;
    }

    type MessageType = InjectMessage;
  }
}
