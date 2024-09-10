import React from 'react';
import MobileButton from './MobileButton';

const MobileMenu = ({ activePage, setActivePage }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 flex justify-around p-2 md:hidden">
      <MobileButton
        variant={activePage === 'tracker' ? 'default' : 'ghost'}
        onClick={() => setActivePage('tracker')}
        className={`text-zinc-900 dark:text-zinc-100 ${activePage === 'tracker' ? 'bg-zinc-800 dark:bg-zinc-500 text-white' : ''}`}
      >
        Tracker
      </MobileButton>
      <MobileButton
        variant={activePage === 'notes' ? 'default' : 'ghost'}
        onClick={() => setActivePage('notes')}
        className={`text-zinc-900 dark:text-zinc-100 ${activePage === 'notes' ? 'bg-zinc-800 dark:bg-zinc-500 text-white' : ''}`}
      >
        Notes
      </MobileButton>
      <MobileButton
        variant={activePage === 'stats' ? 'default' : 'ghost'}
        onClick={() => setActivePage('stats')}
        className={`text-zinc-900 dark:text-zinc-100 ${activePage === 'stats' ? 'bg-zinc-800 dark:bg-zinc-500 text-white' : ''}`}
      >
        Stats
      </MobileButton>
    </div>
  );
};

export default MobileMenu;