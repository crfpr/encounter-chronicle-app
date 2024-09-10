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
    <div className="flex items-center justify-between w-full bg-[hsl(var(--header-bg))]">
      <div className="flex items-center space-x-2">
        <div className="text-lg font-semibold">Round {round}</div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-lg font-semibold">{formatTime(encounterTime)}</div>
        <Button 
          onClick={toggleEncounter} 
          variant="outline" 
          size="icon"
          className="h-8 w-8"
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default EncounterHeader;