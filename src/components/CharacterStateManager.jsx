import React from 'react';
import { Button } from './ui/button';
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
      return [1, 2, 3].map((value) => (
        <Button
          key={`${type}-${value}`}
          onClick={() => handleDeathSaveToggle(type, value)}
          variant="outline"
          size="sm"
          className={cn(
            "w-4 h-4 p-0 rounded-full",
            character.deathSaves[type].includes(value) 
              ? (type === 'failures' ? 'bg-red-500' : 'bg-green-500') 
              : 'bg-zinc-200 dark:bg-zinc-700'
          )}
        />
      ));
    };

    return (
      <div className="flex items-center space-x-2 text-xs">
        <Label className="text-[10px]">Failure</Label>
        <div className="flex space-x-1">
          {renderSaveButtons('failures')}
        </div>
        <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
        <div className="flex space-x-1">
          {renderSaveButtons('successes')}
        </div>
        <Label className="text-[10px]">Success</Label>
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