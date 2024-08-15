import React from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const EncounterHeader = ({ encounterName, setEncounterName, isRunning, toggleEncounter }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Input
        value={encounterName}
        onChange={(e) => setEncounterName(e.target.value)}
        className="text-2xl font-bold w-64"
      />
      <Button onClick={toggleEncounter} variant="outline">
        {isRunning ? 'Pause Encounter' : 'Start Encounter'}
      </Button>
    </div>
  );
};

export default EncounterHeader;