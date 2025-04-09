import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import translations from '../translations';
import { isEqual } from 'lodash-es';
import { toast } from 'react-toastify';

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
      if (result.pagespy) {
        setConfig(result.pagespy);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const cache = await chrome.storage.local.get(['pagespy']);
      const noChanges = isEqual(cache.pagespy, config);
      if (noChanges) {
        toast.info(t.noChanges);
        return;
      }

      await chrome.storage.local.set({ pagespy: config });
      toast.success(t.updateSuccess);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const updateConfig = <T extends keyof I.Config>(
    key: T,
    value: I.Config[T]
  ) => {
    setConfig((prev: any) => ({
      ...prev,
      [key]: value
    }));
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
              onChange={(e) => updateConfig('offline', e.target.checked)}
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
                  onChange={(e) =>
                    updateConfig('enableSSL', !!Number(e.target.value))
                  }
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
                onChange={(e) => updateConfig('serviceAddress', e.target.value)}
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
            onChange={(e) => updateConfig('domainRules', e.target.value)}
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
              onChange={(e) => updateConfig('project', e.target.value)}
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
              onChange={(e) => updateConfig('title', e.target.value)}
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
