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
    type Switch = 'on' | 'off';

    interface FormFields {
      'deploy-url': '';
      ssl: Switch;
      offline: Switch;
      api: string;
      clientOrigin: string;
      project: string;
      title: string;
      autoRender: Switch;
      rules: string;
      open: Switch;
      dataHarborOpen: Switch;
      dataHarborMaximum: number;
      dataHarborCaredData: string;
      rrwebOpen: Switch;
    }
  }
}
