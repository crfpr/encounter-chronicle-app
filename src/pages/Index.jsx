import React, { useState, useEffect } from 'react';
import EncounterTracker from '../components/EncounterTracker';
import { Input } from '../components/ui/input';

const Index = () => {
  const [encounterName, setEncounterName] = useState('New Encounter');
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const updateFooterHeight = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        setFooterHeight(footer.offsetHeight);
      }
    };

    updateFooterHeight();
    window.addEventListener('resize', updateFooterHeight);

    return () => window.removeEventListener('resize', updateFooterHeight);
  }, []);

  return (
    <div className="flex flex-col" style={{ minHeight: `calc(100vh + ${footerHeight}px)` }}>
      <header className="bg-black text-white py-4" style={{ height: `${footerHeight}px` }}>
        <div className="container mx-auto px-4 h-full flex items-center">
          <Input
            value={encounterName}
            onChange={(e) => setEncounterName(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none text-white placeholder-gray-400 focus:outline-none focus:ring-0"
            placeholder="Enter encounter name..."
          />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 overflow-y-auto">
        <EncounterTracker encounterName={encounterName} setEncounterName={setEncounterName} />
      </main>
    </div>
  );
};

export default Index;