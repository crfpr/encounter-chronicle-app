import React from 'react';
import EncounterTracker from '../components/EncounterTracker';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">D&D 5e Encounter Tracker</h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <EncounterTracker />
      </main>
    </div>
  );
};

export default Index;