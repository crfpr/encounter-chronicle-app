import React from 'react';
import { Button } from './ui/button';

const MobileMenu = ({ activePage, setActivePage }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2">
      <Button
        variant={activePage === 'tracker' ? 'default' : 'ghost'}
        onClick={() => setActivePage('tracker')}
      >
        Tracker
      </Button>
      <Button
        variant={activePage === 'notes' ? 'default' : 'ghost'}
        onClick={() => setActivePage('notes')}
      >
        Notes
      </Button>
      <Button
        variant={activePage === 'stats' ? 'default' : 'ghost'}
        onClick={() => setActivePage('stats')}
      >
        Stats
      </Button>
    </div>
  );
};

export default MobileMenu;