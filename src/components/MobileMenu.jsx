import React from 'react';
import MobileButton from './MobileButton';

const MobileMenu = ({ activePage, setActivePage }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 md:hidden">
      <MobileButton
        variant={activePage === 'tracker' ? 'default' : 'ghost'}
        onClick={() => setActivePage('tracker')}
      >
        Tracker
      </MobileButton>
      <MobileButton
        variant={activePage === 'notes' ? 'default' : 'ghost'}
        onClick={() => setActivePage('notes')}
      >
        Notes
      </MobileButton>
      <MobileButton
        variant={activePage === 'stats' ? 'default' : 'ghost'}
        onClick={() => setActivePage('stats')}
      >
        Stats
      </MobileButton>
    </div>
  );
};

export default MobileMenu;