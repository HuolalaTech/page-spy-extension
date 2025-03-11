import React, { useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import translations from '../translations';
import packageInfo from '@huolala-tech/page-spy-browser/package.json';
import compareVersion from 'compare-version';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const currentYear = new Date().getFullYear();
  const [isLatest, setIsLatest] = useState(false);
  useMemo(async () => {
    try {
      const res = await Promise.any([
        fetch('https://registry.npmmirror.com/@huolala-tech/page-spy-browser'),
        fetch('https://registry.npmjs.org/@huolala-tech/page-spy-browser')
      ]);
      const info = await res.clone().json();
      const { latest } = info['dist-tags'];
      setIsLatest(compareVersion(packageInfo.version, latest) >= 0);
    } catch (e) {
      //
    }
  }, []);

  return (
    
    <footer className="bg-gray-200 py-4 px-6 text-center text-xs text-gray-600">
      <p>
        {t.version}: <b className={isLatest ? 'text-green-600' : 'text-red-600'}>{packageInfo.version}</b>
      </p>
      <p>Copyright &copy; 2022-{currentYear} Blucas.</p>
    </footer>
  );
};

export default Footer;
