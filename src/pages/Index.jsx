import React from 'react';
import EncounterTracker from '../components/EncounterTracker';

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">D&D 5e Encounter Tracker</h1>
      <EncounterTracker />
    </div>
  );
};

export default Index;