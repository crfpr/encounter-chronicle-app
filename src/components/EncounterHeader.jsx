import React from 'react';
import { Button } from '../components/ui/button';
import { Play, Pause } from 'lucide-react';

const EncounterHeader = ({ isRunning, toggleEncounter, encounterTime, turnTime, round }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between w-full bg-white dark:bg-zinc-950">
      <div className="flex items-center space-x-2">
        <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100" aria-live="polite">Round {round}</div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-lg font-light text-zinc-700 dark:text-zinc-300 w-16 text-right" aria-live="polite">{formatTime(turnTime)}</div>
        <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700"></div>
        <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 w-16 text-right" aria-live="polite">{formatTime(encounterTime)}</div>
        <Button 
          onClick={toggleEncounter} 
          variant="outline" 
          size="icon"
          className="h-8 w-8 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100"
          aria-label={isRunning ? "Pause encounter" : "Start encounter"}
        >
          {isRunning ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </div>
    </div>
  );
};

export default EncounterHeader;
