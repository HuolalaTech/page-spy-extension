import React, { useEffect, useState } from 'react';
import DownSvg from '../assets/img/down.svg?react';
import { useLanguage } from '../contexts/LanguageContext';
import translations from '../translations';
import { cloneDeep, isEqual, set } from 'lodash-es';
import { toast } from 'react-toastify';

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const defaultConfig: I.Config = {
  offline: true,
  enableSSL: true,
  serviceAddress: 'pagespy.jikejishu.com',
  domainRules: '',
  project: '--',
  title: 'PageSpy Extension'
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
      if (!id || !url) return;

      const injectRules = data.domainRules
        .split('\n')
        .map((d) => {
          const rule = d.trim();
          if (!rule) return null;
          return new RegExp(d.trim());
        })
        .filter(Boolean);

      const matchCurrentTab = injectRules.some((r) => r!.test(tab.url!));

      if (injectRules.length > 0 && matchCurrentTab) {
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
            const hasCache = sessionStorage.getItem('page-spy-room');
            const hasPageSpy = document.querySelector('#__pageSpy');
            if (hasCache || hasPageSpy) {
              sessionStorage.removeItem('page-spy-room');
              window.location.reload();
            }
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
    <form
      onSubmit={handleSubmit}
      className="space-y-2 text-stone-900 text-sm font-medium"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-3 space-y-3">
        {/* 离线模式开关 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">{t.offline}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              name="offline"
              onChange={handleChange}
              checked={config.offline}
            />
            <div
              className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                        peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                        after:bg-white after:border-gray-300 after:border after:rounded-full 
                        after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9333EA]"
            ></div>
          </label>
        </div>

        {/* 服务器地址配置 */}
        <div className={`space-y-4 ${config.offline && 'hidden'}`}>
          <div className="space-y-2">
            <label className="block text-gray-700">{t.serviceAddress}</label>
            <div className="flex gap-4">
              {/* Protocol 选择 */}
              <div className="w-32">
                <select
                  name="enableSSL"
                  value={Number(config.enableSSL)}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                         focus:ring-2 focus:ring-[#9333EA] focus:border-transparent 
                         bg-white"
                >
                  <option value={1}>https://</option>
                  <option value={0}>http://</option>
                </select>
              </div>
              {/* Host 输入 */}
              <input
                type="text"
                name="serviceAddress"
                value={config.serviceAddress}
                required={config.offline === false}
                onChange={handleChange}
                placeholder="Example：pagespy.jikejishu.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                       focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 在哪些域名下启用 */}
        <div className="space-y-2">
          <label className="block text-gray-700">{t.matchingDomainRules}</label>
          <textarea
            placeholder={t.matchingDomainRulesPlaceholder}
            value={config.domainRules}
            name="domainRules"
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                   focus:ring-2 focus:ring-[#9333EA] focus:border-transparent resize-none"
          ></textarea>
        </div>

        {/* 项目配置 */}
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <label className="block text-gray-700">{t.project}</label>
            <input
              type="text"
              name="project"
              value={config.project}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                     focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
            />
          </div>

          <div className="flex-1 space-y-2">
            <label className="block text-gray-700">{t.title}</label>
            <input
              type="text"
              name="title"
              value={config.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                     focus:ring-2 focus:ring-[#9333EA] focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-[#8e26d9] text-white rounded-md hover:bg-[#7a20b8] transition duration-300"
        >
          <b>{t.saveConfiguration}</b>
        </button>
      </div>
    </form>
  );
};

export default ConfigForm;
