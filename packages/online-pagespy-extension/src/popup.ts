import { isEqual } from 'lodash-es';
import './popup.less';
import { getVersion } from './version';

(function () {
  const defaultValue: I.FormFields = {
    'deploy-url': '',
    ssl: 'on',
    offline: 'off',
    api: '',
    clientOrigin: '',
    project: '',
    title: '',
    autoRender: 'on',
    rules: '',
    open: 'on',
    dataHarborOpen: 'on',
    dataHarborMaximum: 10 * 1024 * 1024,
    dataHarborCaredData: '',
    rrwebOpen: 'on'
  };
  const form = document.querySelector('#form') as HTMLFormElement;
  const deployUrlEl = document.querySelector('#deploy-url') as HTMLInputElement;
  const sslEl = document.querySelector('#enable-ssl') as HTMLInputElement;
  const offlineEl = document.querySelector('#offline') as HTMLInputElement;
  const apiEl = document.querySelector('#api') as HTMLInputElement;
  const clientOriginEl = document.querySelector('#clientOrigin') as HTMLInputElement;
  const projectEl = document.querySelector('#project') as HTMLInputElement;
  const titleEl = document.querySelector('#title') as HTMLInputElement;
  const autoRenderEl = document.querySelector('#yes') as HTMLInputElement;
  const manualRenderEl = document.querySelector('#no') as HTMLInputElement;
  const rulesEl = document.querySelector('#rules') as HTMLTextAreaElement;
  const openEl = document.querySelector('#enable-open') as HTMLInputElement;

  const dataHarborOpenEl = document.querySelector('#dataHarborOpen') as HTMLInputElement;
  const dataHarborMaximumEl = document.querySelector('#dataHarborMaximum') as HTMLInputElement;
  const dataHarborCaredDataEl = document.querySelector('#dataHarborCaredData') as HTMLInputElement;
  const rrwebOpenEl = document.querySelector('#rrwebOpen') as HTMLInputElement;

  const storage = {
    get: (cb: (data: I.FormFields) => void) => {
      chrome.storage.local.get(['pagespy'], (result) => {
        cb(result.pagespy);
      });
    },
    set: (value: I.FormFields, cb = () => {}) => {
      chrome.storage.local.set(
        {
          pagespy: value
        },
        () => {
          cb();
        }
      );
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const result: I.FormFields = [...data.entries()].reduce((acc, cur) => {
      const [key, value] = cur;
      acc[key as keyof I.FormFields] = value;
      return acc;
    }, {} as any);

    storage.get((cache) => {
      const noChanges = isEqual(cache, result);
      if (noChanges) return;

      chrome.runtime.sendMessage('remove-cache');
      storage.set(result);
    });
  });

  function setupFormFields(initialValue = defaultValue) {
    const {
      ssl,
      offline,
      api,
      clientOrigin,
      project,
      title,
      autoRender,
      rules,
      open,
      dataHarborOpen,
      dataHarborMaximum,
      dataHarborCaredData,
      rrwebOpen
    } = initialValue;
    deployUrlEl.value = initialValue['deploy-url'];
    sslEl.checked = ssl === 'on';
    openEl.checked = open === 'on';
    offlineEl.checked = offline === 'on';
    apiEl.value = api;
    clientOriginEl.value = clientOrigin;
    projectEl.value = project;
    titleEl.value = title;
    if (autoRender === 'on') {
      autoRenderEl.checked = true;
    } else {
      manualRenderEl.checked = true;
    }
    rulesEl.value = rules;
    dataHarborOpenEl.checked = dataHarborOpen === 'on';
    dataHarborMaximumEl.value = dataHarborMaximum.toString();
    dataHarborCaredDataEl.value = dataHarborCaredData;
    rrwebOpenEl.checked = rrwebOpen === 'on';
  }

  function restoreCounter() {
    storage.get((value: any) => {
      if (typeof value === 'undefined') {
        storage.set(defaultValue);
        setupFormFields(defaultValue);
      } else {
        setupFormFields(value);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    restoreCounter();
    getVersion();
  });
})();
