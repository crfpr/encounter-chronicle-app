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
            "w-6 h-6 p-0 rounded-full",
            character.deathSaves[type].includes(value) 
              ? (type === 'failures' ? 'bg-red-500 dark:bg-red-900' : 'bg-green-500 dark:bg-green-900') 
              : 'bg-zinc-200 dark:bg-zinc-700'
          )}
        />
      ));
    };

    return (
      <div className="flex items-center justify-center space-x-4 text-sm py-4">
        <Label className="text-base font-semibold">Failure</Label>
        <div className="flex space-x-2">
          {renderSaveButtons('failures')}
        </div>
        <div className="h-8 w-px bg-zinc-300 dark:bg-zinc-700" />
        <div className="flex space-x-2">
          {renderSaveButtons('successes')}
        </div>
        <Label className="text-base font-semibold">Success</Label>
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