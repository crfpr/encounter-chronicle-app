import React from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const EncounterHeader = ({ encounterName, setEncounterName, isRunning, toggleEncounter, encounterTime }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <Input
        value={encounterName}
        onChange={(e) => setEncounterName(e.target.value)}
        className="text-2xl font-bold w-64"
      />
      <div className="flex items-center space-x-4">
        <div className="text-xl font-semibold">{formatTime(encounterTime)}</div>
        <Button onClick={toggleEncounter} variant="outline">
          {isRunning ? 'Pause Encounter' : 'Start Encounter'}
        </Button>
      </div>
    </div>
  );
};

export default EncounterHeader;