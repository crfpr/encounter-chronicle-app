import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import CharacterStateManager from './CharacterStateManager';

const HPSection = ({ character, isActive, handleInputChange, handleNumericInputKeyDown, setIsNumericInputActive, updateCharacter }) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleStateChange = (newState) => {
    let updatedCharacter = { ...character, state: newState };
    if (newState === 'ko') {
      updatedCharacter.currentHp = 0;
    } else if (newState === 'stable') {
      updatedCharacter.currentHp = 1;
    } else if (newState === 'dead') {
      updatedCharacter.currentHp = 0;
    }
    updateCharacter(updatedCharacter);
  };

  const getStatusLabel = (state) => {
    switch (state) {
      case 'ko': return 'KO';
      case 'stable': return 'Stable';
      case 'dead': return 'Dead';
      default: return 'Alive';
    }
  };

  return (
    <div className={`w-20 flex-shrink-0 ${isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} border-l border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-between py-2 px-2 transition-colors duration-200`}>
      <div className="flex flex-col items-center space-y-2 w-full">
        <div className="flex flex-col items-center w-full">
          <label className={`text-xs font-semibold mb-1 ${isActive ? 'text-white dark:text-zinc-100' : 'text-black dark:text-zinc-100'}`}>HP</label>
          <Input
            type="text"
            inputMode="numeric"
            value={character.currentHp}
            onChange={(e) => handleInputChange('currentHp', e.target.value)}
            onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentHp', character.currentHp)}
            onFocus={() => setIsNumericInputActive(true)}
            onBlur={() => setIsNumericInputActive(false)}
            className={`w-16 text-center ${isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} h-[30px] border-zinc-300 dark:border-zinc-800 no-spinners text-sm`}
            maxLength={3}
          />
        </div>
        <div className="flex flex-col items-center w-full">
          <label className={`text-xs font-semibold mb-1 ${isActive ? 'text-white dark:text-zinc-100' : 'text-black dark:text-zinc-100'}`}>Max HP</label>
          <Input
            type="text"
            inputMode="numeric"
            value={character.maxHp}
            onChange={(e) => handleInputChange('maxHp', e.target.value)}
            onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxHp', character.maxHp)}
            onFocus={() => setIsNumericInputActive(true)}
            onBlur={() => setIsNumericInputActive(false)}
            className={`w-16 text-center ${isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} h-[30px] border-zinc-300 dark:border-zinc-800 no-spinners text-sm`}
            maxLength={3}
          />
        </div>
        <Select 
          value={character.state} 
          onValueChange={handleStateChange}
          onOpenChange={setIsSelectOpen}
          open={isSelectOpen}
        >
          <SelectTrigger className={`w-full h-[30px] text-xs bg-transparent border-none hover:underline focus:ring-0 ${isActive ? 'text-white' : 'text-black dark:text-zinc-100'}`}>
            <SelectValue placeholder={getStatusLabel(character.state)} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alive">Alive</SelectItem>
            <SelectItem value="ko">KO</SelectItem>
            <SelectItem value="stable">Stable</SelectItem>
            <SelectItem value="dead">Dead</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {character.state === 'ko' && (
        <div className="mt-2 w-full">
          <CharacterStateManager character={character} updateCharacter={updateCharacter} />
        </div>
      )}
    </div>
  );
};

export default HPSection;