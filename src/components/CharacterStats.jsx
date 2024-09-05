import React from 'react';
import { Input } from '../components/ui/input';
import ShieldIcon from './ShieldIcon';

const CharacterStats = ({ character, handleInputChange, handleNumericInputKeyDown, setIsNumericInputActive, isActive }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center relative">
        <ShieldIcon className="absolute pointer-events-none" />
        <Input
          type="text"
          inputMode="numeric"
          value={character.ac}
          onChange={(e) => handleInputChange('ac', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'ac', character.ac)}
          onFocus={() => setIsNumericInputActive(true)}
          onBlur={() => setIsNumericInputActive(false)}
          className="w-[40px] h-[40px] text-center bg-transparent text-black dark:text-zinc-100 border-none focus:ring-0 text-sm"
          maxLength={2}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'textfield',
          }}
        />
      </div>
      <div className="flex flex-col items-center">
        <label className={`text-xs font-semibold mb-1 ${isActive ? 'text-white dark:text-zinc-100' : 'text-black dark:text-zinc-100'}`}>HP</label>
        <Input
          type="text"
          inputMode="numeric"
          value={character.currentHp}
          onChange={(e) => handleInputChange('currentHp', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentHp', character.currentHp)}
          onFocus={() => setIsNumericInputActive(true)}
          onBlur={() => setIsNumericInputActive(false)}
          className={`w-11 text-center ${isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} h-[30px] border-zinc-300 dark:border-zinc-800 no-spinners text-sm`}
          maxLength={3}
        />
      </div>
      <div className="flex flex-col items-center">
        <label className={`text-xs font-semibold mb-1 ${isActive ? 'text-white dark:text-zinc-100' : 'text-black dark:text-zinc-100'}`}>Max HP</label>
        <Input
          type="text"
          inputMode="numeric"
          value={character.maxHp}
          onChange={(e) => handleInputChange('maxHp', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxHp', character.maxHp)}
          onFocus={() => setIsNumericInputActive(true)}
          onBlur={() => setIsNumericInputActive(false)}
          className={`w-11 text-center ${isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} h-[30px] border-zinc-300 dark:border-zinc-800 no-spinners text-sm`}
          maxLength={3}
        />
      </div>
    </div>
  );
};

export default CharacterStats;