import React from 'react';
import { Button } from './ui/button';
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { cn } from "../lib/utils";

const CharacterStateManager = ({ character, updateCharacter }) => {
  const handleStateChange = (newState) => {
    const updatedCharacter = { 
      ...character, 
      state: newState,
      deathSaves: newState === 'unconscious' ? { failures: 0, successes: 0 } : undefined
    };
    updateCharacter(updatedCharacter);
  };

  const handleDeathSaveChange = (type, value) => {
    const updatedDeathSaves = {
      ...character.deathSaves,
      [type]: value
    };
    updateCharacter({
      ...character,
      deathSaves: updatedDeathSaves
    });
  };

  const renderStateButton = (state, label) => (
    <Button
      onClick={() => handleStateChange(state)}
      variant={character.state === state ? 'default' : 'outline'}
      size="sm"
      className="text-xs"
    >
      {label}
    </Button>
  );

  const renderDeathSaves = () => {
    const renderSaveButtons = (type, count) => {
      const isFailure = type === 'failures';
      const color = isFailure ? 'bg-red-500' : 'bg-green-500';
      return (
        <div className="flex space-x-1">
          {[1, 2, 3].map((value) => (
            <Button
              key={`${type}-${value}`}
              onClick={() => handleDeathSaveChange(type, value)}
              variant="outline"
              size="sm"
              className={cn(
                "w-6 h-6 p-0",
                character.deathSaves?.[type] >= value ? color : ''
              )}
            />
          ))}
        </div>
      );
    };

    return (
      <div className="flex items-center space-x-2 mt-2">
        <Label className="text-xs">Failure</Label>
        {renderSaveButtons('failures', character.deathSaves?.failures || 0)}
        <Separator orientation="vertical" className="h-6" />
        {renderSaveButtons('successes', character.deathSaves?.successes || 0)}
        <Label className="text-xs">Success</Label>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {renderStateButton('alive', 'Alive')}
        {renderStateButton('unconscious', 'Unconscious')}
        {renderStateButton('dead', 'Dead')}
      </div>
      {character.state === 'unconscious' && renderDeathSaves()}
    </div>
  );
};

export default CharacterStateManager;