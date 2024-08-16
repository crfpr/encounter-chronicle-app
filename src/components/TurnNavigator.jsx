import React from 'react';
import { Button } from './ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

const TurnNavigator = ({ turnTime, onPreviousTurn, onNextTurn }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-16">
      <Button onClick={onPreviousTurn} variant="ghost" size="icon" className="p-0">
        <ChevronUp className="h-4 w-4" />
      </Button>
      <div className="text-xs font-semibold my-2">
        {formatTime(turnTime)}
      </div>
      <Button onClick={onNextTurn} variant="ghost" size="icon" className="p-0">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TurnNavigator;