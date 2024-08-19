import React, { useState } from 'react';
import EncounterTracker from '../components/EncounterTracker';
import { Input } from '../components/ui/input';

const Index = () => {
  const [encounterName, setEncounterName] = useState('New Encounter');

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <Input
            value={encounterName}
            onChange={(e) => setEncounterName(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none text-white placeholder-gray-400 focus:outline-none focus:ring-0"
            placeholder="Enter encounter name..."
          />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 overflow-hidden">
        <EncounterTracker encounterName={encounterName} setEncounterName={setEncounterName} />
      </main>
    </div>
  );
};

export default Index;