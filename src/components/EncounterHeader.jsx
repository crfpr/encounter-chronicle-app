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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-4 pr-6">
      <Input
        value={encounterName}
        onChange={(e) => setEncounterName(e.target.value)}
        className="text-lg font-bold w-full sm:w-64"
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="text-lg font-semibold">{formatTime(encounterTime)}</div>
        <Button onClick={toggleEncounter} variant="outline" className="h-[30px] px-3 text-sm w-full sm:w-auto">
          {isRunning ? 'Pause Encounter' : 'Start Encounter'}
        </Button>
      </div>
    </div>
  );
};

export default EncounterHeader;