import React from 'react';
import { Input } from '../components/ui/input';
import ShieldIcon from './ShieldIcon';

const CharacterStats = ({ character, handleInputChange, handleNumericInputKeyDown, setIsNumericInputActive, isActive }) => {
  const { ac, currentHp, maxHp } = character;

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <ShieldIcon className="w-10 h-10 text-zinc-800 dark:text-zinc-200" />
        <Input
          type="text"
          inputMode="numeric"
          value={ac}
          onChange={(e) => handleInputChange('ac', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'ac', ac)}
          onFocus={() => setIsNumericInputActive(true)}
          onBlur={() => setIsNumericInputActive(false)}
          className="absolute inset-0 w-full h-full text-center bg-transparent text-black dark:text-zinc-100 border-none focus:ring-0 text-sm"
          maxLength={2}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'textfield',
          }}
        />
      </div>
      <div className="flex flex-col items-center">
        <Input
          type="text"
          inputMode="numeric"
          value={currentHp}
          onChange={(e) => handleInputChange('currentHp', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentHp', currentHp)}
          onFocus={() => setIsNumericInputActive(true)}
          onBlur={() => setIsNumericInputActive(false)}
          className={`w-14 text-center ${isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} h-[30px] border-zinc-300 dark:border-zinc-800 no-spinners text-sm`}
          maxLength={3}
        />
        <span className="text-xs text-zinc-500 dark:text-zinc-400">/</span>
        <Input
          type="text"
          inputMode="numeric"
          value={maxHp}
          onChange={(e) => handleInputChange('maxHp', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxHp', maxHp)}
          onFocus={() => setIsNumericInputActive(true)}
          onBlur={() => setIsNumericInputActive(false)}
          className={`w-14 text-center ${isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} h-[30px] border-zinc-300 dark:border-zinc-800 no-spinners text-sm`}
          maxLength={3}
        />
      </div>
    </div>
  );
};

export default CharacterStats;