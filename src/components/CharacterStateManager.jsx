import React from 'react';
import { Button } from './ui/button';
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { cn } from "../lib/utils";

const CharacterStateManager = ({ character, updateCharacter }) => {
  const handleDeathSaveToggle = (type, value) => {
    const updatedDeathSaves = {
      ...character.deathSaves,
      [type]: character.deathSaves[type].includes(value)
        ? character.deathSaves[type].filter(v => v !== value)
        : [...character.deathSaves[type], value]
    };

    if (type === 'failures' && updatedDeathSaves.failures.length === 3) {
      updateCharacter({ ...character, state: 'dead', currentHp: 0, deathSaves: updatedDeathSaves });
      return;
    }

    if (type === 'successes' && updatedDeathSaves.successes.length === 3) {
      updateCharacter({ ...character, state: 'stable', currentHp: 1, deathSaves: updatedDeathSaves });
      return;
    }

    updateCharacter({
      ...character,
      deathSaves: updatedDeathSaves
    });
  };

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
                "w-4 h-4 p-0",
                character.deathSaves[type].includes(value) ? color : ''
              )}
            />
          ))}
        </div>
      );
    };

    return (
      <div className="flex flex-col items-center space-y-1 mt-2">
        <div className="flex items-center space-x-1">
          <Label className="text-[10px]">Failure</Label>
          {renderSaveButtons('failures')}
        </div>
        <div className="flex items-center space-x-1">
          <Label className="text-[10px]">Success</Label>
          {renderSaveButtons('successes')}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {renderDeathSaves()}
    </div>
  );
};

export default CharacterStateManager;