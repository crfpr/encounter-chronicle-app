import React from 'react';
import { Button } from '../components/ui/button';
import { Play, Pause } from 'lucide-react';

const EncounterHeader = ({ isRunning, toggleEncounter, encounterTime, round }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="text-lg font-semibold">Round {round}</div>
        <div className="text-lg font-semibold">{formatTime(encounterTime)}</div>
      </div>
      <Button 
        onClick={toggleEncounter} 
        variant="outline" 
        size="icon"
        className="h-8 w-8"
      >
        {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default EncounterHeader;