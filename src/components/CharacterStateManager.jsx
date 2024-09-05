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

  const getToggleGroupItemStyle = (type, isToggled) => {
    return cn(
      "w-5 h-5 p-0 rounded-full",
      isToggled
        ? type === 'failures'
          ? 'bg-red-800 dark:bg-red-900 text-white'
          : 'bg-green-800 dark:bg-green-900 text-white'
        : 'bg-zinc-200 dark:bg-zinc-700'
    );
  };

  const renderDeathSaves = () => {
    const renderSaveButtons = (type) => {
      return [1, 2, 3].map((value) => (
        <Button
          key={`${type}-${value}`}
          onClick={() => handleDeathSaveToggle(type, value)}
          variant="outline"
          size="sm"
          className={getToggleGroupItemStyle(type, character.deathSaves[type].includes(value))}
        />
      ));
    };

    return (
      <div className="flex flex-col items-center justify-center space-y-2 text-xs py-2">
        <div className="flex items-center space-x-2">
          <Label className="text-sm font-semibold w-14">Failure</Label>
          <div className="flex space-x-1">
            {renderSaveButtons('failures')}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Label className="text-sm font-semibold w-14">Success</Label>
          <div className="flex space-x-1">
            {renderSaveButtons('successes')}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {renderDeathSaves()}
    </div>
  );
};

export default CharacterStateManager;