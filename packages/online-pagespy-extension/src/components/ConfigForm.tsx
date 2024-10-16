import React, { useEffect, useState } from 'react';
import DownSvg from '../assets/img/down.svg?react';
import { useLanguage } from '../contexts/LanguageContext';
import translations from '../translations';
import { cloneDeep, isEqual, set } from 'lodash-es';
import { toast } from 'react-toastify';

type InputElement = HTMLInputElement | HTMLTextAreaElement;

const defaultConfig: I.Config = {
  enabled: true,
  enableSSL: true,
  serviceAddress: 'pagespy.jikejishu.com',
  domainRules: '',
  offline: false,
  api: '',
  clientOrigin: '',
  project: 'Default',
  title: 'PageSpy Extension',
  autoRender: true,
  dataHarborPlugin: {
    enabled: true,
    maximum: (10 * 1024 * 1024).toString()
  },
  rrWebPlugin: {
    enabled: true
  }
};

const ConfigForm = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const [config, setConfig] = useState(defaultConfig);
  useEffect(() => {
    chrome.storage.local.get(['pagespy'], (result) => {
      if (!result.pagespy) {
        chrome.storage.local.set({ pagespy: defaultConfig });
      } else {
        setConfig(result.pagespy);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const checkboxes =
        form.querySelectorAll<HTMLInputElement>('[type="checkbox"]');

      // merge the submitted value
      const data: I.Config = [...formData.entries()].reduce((acc, cur) => {
        const [key, value] = cur;
        return set(acc, key, value);
      }, cloneDeep(defaultConfig));

      // handle checkboxes
      checkboxes.forEach((ele) => {
        set(data, ele.name, ele.checked);
      });

      const cache = await chrome.storage.local.get(['pagespy']);
      const noChanges = isEqual(cache.pagespy, data);
      if (noChanges) {
        toast.info(t.noChanges);
        return;
      }

      await chrome.storage.local.set({ pagespy: data });
      toast.success(t.updateSuccess);

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });
      if (!tab) return;

      const { id, url } = tab;
      if (!id || !url || !url.startsWith('http')) return;

      const matchCurrentTab = data.domainRules
        .split('\n')
        .map((d) => new RegExp(d.trim()))
        .some((r) => r.test(tab.url!));

      if (matchCurrentTab) {
        chrome.scripting.executeScript({
          target: {
            tabId: id
          },
          func: () => {
            const isRunning = sessionStorage.getItem('page-spy-room');
            if (isRunning) return;

            window.location.reload();
          }
        });
      } else {
        chrome.scripting.executeScript({
          target: {
            tabId: id
          },
          func: () => {
            sessionStorage.removeItem('page-spy-room');
          }
        });
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<InputElement>) => {
    const { name, value, type } = e.target;
    setConfig((prev: any) =>
      set(
        {
          ...prev
        },
        name,
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      )
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-stone-900">
      {/* 是否启用 */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="enabled"
          name="enabled"
          checked={config.enabled}
          onChange={handleChange}
          className="form-checkbox h-5 w-5"
        />
        <label htmlFor="enabled" className="font-medium">
          {t.enableExtension}
        </label>
      </div>

      {/* 是否 HTTPS */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="enableSSL"
          name="enableSSL"
          checked={config.enableSSL}
          onChange={handleChange}
          className="form-checkbox h-5 w-5 text-[#8e26d9]"
        />
        <label htmlFor="enableSSL" className="font-medium">
          {t.enableSSL}
        </label>
      </div>

      {/* PageSpy 服务所在地址，不用填 schema（通过 enableSSL 决定） */}
      <div>
        <label htmlFor="serviceAddress" className="block font-medium mb-1">
          {t.serviceAddress}
        </label>
        <input
          type="text"
          id="serviceAddress"
          name="serviceAddress"
          value={config.serviceAddress}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          placeholder={t.serviceAddressPlaceholder}
        />
      </div>

      {/* 正则匹配域名，决定哪些页面需要注入 PageSpy */}
      <div>
        <label className="block font-medium mb-1">
          {t.matchingDomainRules}
        </label>
        <textarea
          name="domainRules"
          id="domainRules"
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
          placeholder={t.matchingDomainRulesPlaceholder}
          value={config.domainRules}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* 实例化参数（可选的） */}
      <details className="bg-white rounded-md shadow-sm">
        <summary className="cursor-pointer p-4 flex justify-between items-center">
          <span className="font-semibold text-stone-500">
            {t.instantiationParameters}
          </span>
          <DownSvg className="h-5 w-5 text-gray-500" />
        </summary>
        <div className="p-4 space-y-4 border-t">
          {/* offline */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="offline"
              name="offline"
              checked={config.offline}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-[#8e26d9]"
            />
            <label htmlFor="offline" className="font-medium">
              <code>offline</code>
            </label>
          </div>

          {/* autoRender */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoRender"
              name="autoRender"
              checked={config.autoRender}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-[#8e26d9]"
            />
            <label htmlFor="autoRender" className="font-medium">
              <code>autoRender</code>
            </label>
          </div>

          {/* project */}
          <div>
            <label htmlFor="project" className="block font-medium mb-1">
              <code>project</code>
            </label>
            <input
              type="text"
              id="project"
              name="project"
              value={config.project}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* title */}
          <div>
            <label htmlFor="title" className="block font-medium mb-1">
              <code>title</code>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={config.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* api */}
          <div>
            <label htmlFor="api" className="block font-medium mb-1">
              <code>api</code>
            </label>
            <input
              type="text"
              id="api"
              name="api"
              value={config.api}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* clientOrigin */}
          <div>
            <label htmlFor="clientOrigin" className="block font-medium mb-1">
              <code>clientOrigin</code>
            </label>
            <input
              type="text"
              id="clientOrigin"
              name="clientOrigin"
              value={config.clientOrigin}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </details>

      {/* 插件参数配置（可选的） */}
      <details className="bg-white rounded-md shadow-sm">
        <summary className="cursor-pointer p-4 flex justify-between items-center">
          <span className="font-semibold text-stone-500">
            {t.pluginConfigurations}
          </span>
          <DownSvg className="h-5 w-5 text-gray-500" />
        </summary>
        <div className="p-4 space-y-6 border-t">
          {/* DataHarborPlugin */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium text-lg mb-3 text-[#8e26d9]">
              {t.dataHarborPlugin}
            </h3>
            <div className="space-y-3">
              {/* enabled */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="dataHarborPlugin.enabled"
                  name="dataHarborPlugin.enabled"
                  checked={config.dataHarborPlugin?.enabled}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-[#8e26d9]"
                />
                <label
                  htmlFor="dataHarborPlugin.enabled"
                  className="font-medium"
                >
                  {t.enable}
                </label>
              </div>

              {/* maximum */}
              <div>
                <label
                  htmlFor="dataHarborPlugin.maximum"
                  className="block font-medium mb-1"
                >
                  <code>maximum</code>
                </label>
                <input
                  type="number"
                  min={0}
                  id="dataHarborPlugin.maximum"
                  name="dataHarborPlugin.maximum"
                  value={config.dataHarborPlugin?.maximum}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder={t.maximumPlaceholder}
                />
              </div>
            </div>
          </div>

          {/* RRWebPlugin */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium text-lg mb-3 text-[#8e26d9]">
              {t.rrWebPlugin}
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rrWebPlugin.enabled"
                name="rrWebPlugin.enabled"
                checked={config.rrWebPlugin?.enabled}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-[#8e26d9]"
              />
              <label htmlFor="rrWebPlugin.enabled" className="font-medium">
                {t.enable}
              </label>
            </div>
          </div>
        </div>
      </details>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-[#8e26d9] text-white rounded-md hover:bg-[#7a20b8] transition duration-300"
      >
        <b>{t.saveConfiguration}</b>
      </button>
    </form>
  );
};

export default ConfigForm;
