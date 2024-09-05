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
      deathSaves: newState === 'unconscious' ? { failures: [], successes: [] } : undefined,
      currentHp: newState === 'stable' ? 1 : character.currentHp
    };
    updateCharacter(updatedCharacter);
  };

  const handleDeathSaveToggle = (type, value) => {
    const updatedDeathSaves = {
      ...character.deathSaves,
      [type]: character.deathSaves[type].includes(value)
        ? character.deathSaves[type].filter(v => v !== value)
        : [...character.deathSaves[type], value]
    };

    // Check if all three failures are toggled on
    if (type === 'failures' && updatedDeathSaves.failures.length === 3) {
      handleStateChange('dead');
      return;
    }

    // Check if all three successes are toggled on
    if (type === 'successes' && updatedDeathSaves.successes.length === 3) {
      handleStateChange('stable');
      return;
    }

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
    const renderSaveButtons = (type) => {
      const isFailure = type === 'failures';
      const color = isFailure ? 'bg-red-500' : 'bg-green-500';
      return (
        <div className="flex space-x-1">
          {[1, 2, 3].map((value) => (
            <Button
              key={`${type}-${value}`}
              onClick={() => handleDeathSaveToggle(type, value)}
              variant="outline"
              size="sm"
              className={cn(
                "w-6 h-6 p-0",
                character.deathSaves?.[type].includes(value) ? color : ''
              )}
            />
          ))}
        </div>
      );
    };

    return (
      <div className="flex items-center space-x-2 mt-2">
        <Label className="text-xs">Failure</Label>
        {renderSaveButtons('failures')}
        <Separator orientation="vertical" className="h-6" />
        {renderSaveButtons('successes')}
        <Label className="text-xs">Success</Label>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {renderStateButton('alive', 'Alive')}
        {renderStateButton('unconscious', 'Unconscious')}
        {renderStateButton('stable', 'Stable')}
        {renderStateButton('dead', 'Dead')}
      </div>
      {character.state === 'unconscious' && renderDeathSaves()}
    </div>
  );
};

export default CharacterStateManager;