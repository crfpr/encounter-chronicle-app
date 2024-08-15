import React from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const EncounterHeader = ({ encounterName, setEncounterName, round, onNextTurn, onPreviousTurn, isRunning, toggleEncounter }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Input
        value={encounterName}
        onChange={(e) => setEncounterName(e.target.value)}
        className="text-2xl font-bold w-64"
      />
      <div className="flex items-center space-x-2">
        <Button onClick={toggleEncounter} variant="outline">
          {isRunning ? 'Pause Encounter' : 'Start Encounter'}
        </Button>
        <Button onClick={onPreviousTurn} variant="outline">Previous</Button>
        <Button onClick={onNextTurn} variant="outline">Next</Button>
        <span className="text-xl font-semibold">Round {round}</span>
      </div>
    </div>
  );
};

export default EncounterHeader;