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
    <div className="flex flex-col items-center justify-center w-16 mr-2">
      <Button onClick={onPreviousTurn} variant="ghost" size="icon" className="p-0 mb-2">
        <ChevronUp className="h-6 w-6" />
      </Button>
      <div className="text-sm font-semibold">{formatTime(turnTime)}</div>
      <Button onClick={onNextTurn} variant="ghost" size="icon" className="p-0 mt-2">
        <ChevronDown className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default TurnNavigator;