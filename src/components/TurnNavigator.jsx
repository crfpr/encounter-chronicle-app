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
    <div className="flex flex-col items-center justify-between h-full w-full">
      <Button onClick={onPreviousTurn} variant="ghost" size="sm" className="p-0 h-[30px] w-full">
        <ChevronUp className="h-4 w-4" />
      </Button>
      <div className="text-sm font-semibold">
        {formatTime(turnTime)}
      </div>
      <Button onClick={onNextTurn} variant="ghost" size="sm" className="p-0 h-[30px] w-full">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TurnNavigator;
