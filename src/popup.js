'use strict';

import './popup.less';
import { getVersion } from './version';

(function () {
  const defaultValue = {
    'deploy-url': '',
    ssl: 'on',
    offline: 'off',
    api: '',
    clientOrigin: '',
    project: '',
    title: '',
    autoRender: 'yes',
    rules: '',
    open: 'on',
    dataHarborOpen: 'on',
    dataHarborMaximum: 0,
    dataHarborCaredData: '',
    rrwebOpen: 'on'
  };
  const form = document.querySelector('#form');
  const deployUrlEl = document.querySelector('#deploy-url');
  const sslEl = document.querySelector('#enable-ssl');
  const offlineEl = document.querySelector('#offline');
  const apiEl = document.querySelector('#api');
  const clientOriginEl = document.querySelector('#clientOrigin');
  const projectEl = document.querySelector('#project');
  const titleEl = document.querySelector('#title');
  const autoRenderEl = document.querySelector('#yes');
  const manualRenderEl = document.querySelector('#no');
  const rulesEl = document.querySelector('#rules');
  const openEl = document.querySelector('#enable-open');

  const dataHarborOpenEl = document.querySelector('#dataHarborOpen');
  const dataHarborMaximumEl = document.querySelector('#dataHarborMaximum');
  const dataHarborCaredDataEl = document.querySelector('#dataHarborCaredData');
  const rrwebOpenEl = document.querySelector('#rrwebOpen');

  const storage = {
    get: (cb) => {
      chrome.storage.local.get(['pagespy'], (result) => {
        cb(result.pagespy);
      });
    },
    set: (value, cb = () => {}) => {
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

  // 比较两个对象的指定键对应的值是否相同
  const isSameValue = (objA, objB, keys) => {
    return Object.values(keys).every((i) => objA[i] === objB[i]);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const result = {};
    data.forEach((value, key) => {
      result[key] = value.trim();
    });
    storage.get((cache) => {
      const noChanges = isSameValue(cache, result, [
        'deploy-url',
        'offline',
        'api',
        'clientOrigin',
        'project',
        'title',
        'autoRender',
        'dataHarborMaximum',
        'dataHarborCaredData'
      ]);
      if (!noChanges) {
        chrome.runtime.sendMessage('remove-cache');
      }
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
    offlineEl.checked = offline === 'on'
    apiEl.value = api;
    clientOriginEl.value = clientOrigin;
    projectEl.value = project;
    titleEl.value = title;
    if (autoRender === 'yes') {
      autoRenderEl.checked = true;
    } else {
      manualRenderEl.checked = true;
    }
    rulesEl.value = rules;
    dataHarborOpenEl.checked = dataHarborOpen === 'on';
    dataHarborMaximumEl.value = dataHarborMaximum;
    dataHarborCaredDataEl.value = dataHarborCaredData;
    rrwebOpenEl.checked = rrwebOpen === 'on';
  }

  function restoreCounter() {
    storage.get((value) => {
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
