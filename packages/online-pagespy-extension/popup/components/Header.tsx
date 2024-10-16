import LanguageToggle from './LanguageToggle';
import LogoSvg from '../assets/img/logo.svg?react';

const Header = () => {
  return (
    <header className="bg-[#8e26d9] text-white p-4 flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <LogoSvg className="text- text-white" />
        <h1 className="text-2xl font-bold">PageSpy</h1>
      </div>
      <LanguageToggle />
    </header>
  );
};

export default Header;