import React from 'react';
import { Input } from '../components/ui/input';
import ShieldIcon from './ShieldIcon';

const CharacterStats = ({ character, handleInputChange, handleNumericInputKeyDown, setIsNumericInputActive }) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={character.currentHp}
          onChange={(e) => handleInputChange('currentHp', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentHp', character.currentHp)}
          onFocus={() => setIsNumericInputActive(true)}
          className="w-12 h-[30px] text-center bg-white text-black dark:bg-zinc-950 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 no-spinners"
          placeholder="HP"
        />
        <span>/</span>
        <Input
          type="number"
          value={character.maxHp}
          onChange={(e) => handleInputChange('maxHp', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxHp', character.maxHp)}
          onFocus={() => setIsNumericInputActive(true)}
          className="w-12 h-[30px] text-center bg-white text-black dark:bg-zinc-950 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 no-spinners"
          placeholder="Max"
        />
      </div>
      <div className="flex items-center space-x-1">
        <ShieldIcon className="w-5 h-5" />
        <Input
          type="number"
          value={character.ac}
          onChange={(e) => handleInputChange('ac', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'ac', character.ac)}
          onFocus={() => setIsNumericInputActive(true)}
          className="w-12 h-[30px] text-center bg-white text-black dark:bg-zinc-950 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 no-spinners"
          placeholder="AC"
        />
      </div>
      <div className="flex items-center space-x-1">
        <Input
          type="number"
          value={character.currentMovement}
          onChange={(e) => handleInputChange('currentMovement', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentMovement', character.currentMovement)}
          onFocus={() => setIsNumericInputActive(true)}
          className="w-12 h-[30px] text-center bg-white text-black dark:bg-zinc-950 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 no-spinners"
          placeholder="Move"
        />
        <span>/</span>
        <Input
          type="number"
          value={character.maxMovement}
          onChange={(e) => handleInputChange('maxMovement', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxMovement', character.maxMovement)}
          onFocus={() => setIsNumericInputActive(true)}
          className="w-12 h-[30px] text-center bg-white text-black dark:bg-zinc-950 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 no-spinners"
          placeholder="Max"
        />
      </div>
    </>
  );
};

export default CharacterStats;