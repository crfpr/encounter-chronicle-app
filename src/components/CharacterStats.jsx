import React from 'react';
import { Input } from '../components/ui/input';

const CharacterStats = ({ character, handleInputChange, handleNumericInputKeyDown }) => {
  return (
    <>
      <div className="flex space-x-2">
        <Input
          type="number"
          value={character.currentHp}
          onChange={(e) => handleInputChange('currentHp', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentHp', character.currentHp)}
          className="w-16 h-[30px] text-center bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
          placeholder="HP"
        />
        <span className="flex items-center">/</span>
        <Input
          type="number"
          value={character.maxHp}
          onChange={(e) => handleInputChange('maxHp', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxHp', character.maxHp)}
          className="w-16 h-[30px] text-center bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
          placeholder="Max"
        />
        <Input
          type="number"
          value={character.ac}
          onChange={(e) => handleInputChange('ac', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'ac', character.ac)}
          className="w-12 h-[30px] text-center bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
          placeholder="AC"
        />
      </div>
      <div className="flex space-x-2 items-center">
        <Input
          type="number"
          value={character.currentMovement}
          onChange={(e) => handleInputChange('currentMovement', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentMovement', character.currentMovement)}
          className="w-12 h-[30px] text-center bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
          placeholder="Move"
        />
        <span className="flex items-center">/</span>
        <Input
          type="number"
          value={character.maxMovement}
          onChange={(e) => handleInputChange('maxMovement', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxMovement', character.maxMovement)}
          className="w-12 h-[30px] text-center bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
          placeholder="Max"
        />
        <span className="text-sm">ft.</span>
      </div>
    </>
  );
};

export default CharacterStats;