import React from 'react';
import { Button } from './ui/button';
import { Label } from "./ui/label";
import { cn } from "../lib/utils";

const CharacterStateManager = ({ character, updateCharacter, isMobile }) => {
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
          className={getToggleGroupItemStyle(type, character.deathSaves && character.deathSaves[type].includes(value))}
        />
      ));
    };

    const deathSaveContainerClass = "flex items-center space-x-2 h-[30px]";
    const labelClass = "text-sm font-semibold";

    if (isMobile) {
      return (
        <div className="flex flex-col space-y-2">
          <div className={deathSaveContainerClass}>
            <Label className={`${labelClass} w-16`}>Failure</Label>
            <div className="flex space-x-1">
              {renderSaveButtons('failures')}
            </div>
          </div>
          <div className={deathSaveContainerClass}>
            <Label className={`${labelClass} w-16`}>Success</Label>
            <div className="flex space-x-1">
              {renderSaveButtons('successes')}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-4 h-[30px]">
          <div className={deathSaveContainerClass}>
            <Label className={labelClass}>Failure</Label>
            <div className="flex space-x-1 ml-2">
              {renderSaveButtons('failures')}
            </div>
          </div>
          <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700" />
          <div className={deathSaveContainerClass}>
            <Label className={labelClass}>Success</Label>
            <div className="flex space-x-1 ml-2">
              {renderSaveButtons('successes')}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-1">
      {character.deathSaves && renderDeathSaves()}
    </div>
  );
};

export default CharacterStateManager;