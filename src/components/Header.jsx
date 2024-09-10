import React from 'react';
import { Input } from '../components/ui/input';
import MobileMenuButton from '../components/MobileMenuButton';
import ThemeToggle from '../components/ThemeToggle';

const Header = ({ encounterName, setEncounterName, isMobile, isDarkMode, toggleTheme, toggleMobileMenu }) => (
  <header className={`py-2 ${isMobile ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-[9999] border-b border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950`}>
    <div className="container mx-auto px-4 flex items-center justify-between">
      <div className="flex items-center flex-grow">
        <Input
          value={encounterName}
          onChange={(e) => setEncounterName(e.target.value)}
          className={`font-bold bg-transparent border-none placeholder-zinc-400 focus:outline-none focus:ring-0 ${isMobile ? 'text-xl flex-grow' : 'text-2xl'}`}
          placeholder="Enter encounter name..."
        />
      </div>
      <div className="flex items-center">
        {!isMobile && <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
        {isMobile && <MobileMenuButton onClick={toggleMobileMenu} />}
      </div>
    </div>
  </header>
);

export default Header;