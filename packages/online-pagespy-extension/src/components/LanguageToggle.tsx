import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <button onClick={toggleLanguage} className="bg-white text-[#8e26d9] px-3 py-1 rounded-md hover:bg-gray-100 transition duration-300">
      <b>{language === 'en' ? '中文' : 'English'}</b>
    </button>
  );
};

export default LanguageToggle;
