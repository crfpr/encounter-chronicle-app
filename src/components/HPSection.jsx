import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Separator } from "../components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { useNumericInput } from '../hooks/useNumericInput';
import CharacterStateManager from './CharacterStateManager';

const HPSection = ({ character, isActive, updateCharacter, removeCharacter, setIsNumericInputActive, isMobile }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [currentHp, handleCurrentHpChange, handleCurrentHpKeyDown, setCurrentHp] = useNumericInput(character.currentHp || 0);
  const [maxHp, handleMaxHpChange, handleMaxHpKeyDown] = useNumericInput(character.maxHp || 0);

  useEffect(() => {
    setCurrentHp(character.currentHp || 0);
  }, [character.currentHp, setCurrentHp]);

  const handleStateChange = (newState) => {
    let updatedCharacter = { ...character, state: newState };
    if (newState === 'ko') {
      updatedCharacter.currentHp = 0;
      updatedCharacter.deathSaves = { successes: [], failures: [] };
    } else if (newState === 'stable') {
      updatedCharacter.currentHp = 1;
    } else if (newState === 'dead') {
      updatedCharacter.currentHp = 0;
    } else if (newState === 'alive' && updatedCharacter.currentHp === 0) {
      updatedCharacter.currentHp = 1;
    }
    updateCharacter(updatedCharacter);
    setIsPopoverOpen(false);
  };

  const getStatusLabel = (state) => {
    switch (state) {
      case 'ko': return 'KO';
      case 'stable': return 'Stable';
      case 'dead': return 'Dead';
      default: return 'Alive';
    }
  };

  const handleHPChange = (value) => {
    const numericValue = Number(value);
    let newState = character.state;

    if (numericValue <= 0 && Number(character.maxHp) > 0) {
      newState = 'ko';
    } else if (numericValue > 0) {
      if (character.state === 'ko' || character.state === 'dead' || (character.state === 'stable' && numericValue > 1)) {
        newState = 'alive';
      }
    }

    updateCharacter({
      ...character,
      currentHp: numericValue,
      state: newState,
      deathSaves: newState === 'ko' ? { successes: [], failures: [] } : character.deathSaves
    });
  };

  const handleCurrentHpBlur = () => {
    handleHPChange(currentHp);
    setIsNumericInputActive(false);
  };

  const handleMaxHpBlur = () => {
    updateCharacter({ ...character, maxHp: Number(maxHp) });
    setIsNumericInputActive(false);
  };

  const handleKeyDown = (e, blurHandler) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      blurHandler();
      e.target.blur();
    } else {
      if (e.target.id === 'currentHp') {
        handleCurrentHpKeyDown(e);
      } else if (e.target.id === 'maxHp') {
        handleMaxHpKeyDown(e);
      }
    }
  };

  return (
    <div className={`${isMobile ? 'w-auto flex-shrink-0' : 'w-20 flex-shrink-0'} ${isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} border-l border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-between py-2 px-2 transition-colors duration-200`}>
      <div className="flex flex-col items-center space-y-2 w-full">
        <div className="flex flex-col items-center w-full">
          <label className={`text-xs font-semibold mb-1 ${isActive ? 'text-white dark:text-zinc-100' : 'text-black dark:text-zinc-100'}`}>HP</label>
          <div className="relative w-16 border border-zinc-300 dark:border-zinc-700 rounded overflow-hidden">
            <Input
              id="currentHp"
              type="text"
              inputMode="numeric"
              value={currentHp}
              onChange={handleCurrentHpChange}
              onKeyDown={(e) => handleKeyDown(e, handleCurrentHpBlur)}
              onFocus={() => setIsNumericInputActive(true)}
              onBlur={handleCurrentHpBlur}
              className={`w-full text-center ${isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-white' : 'bg-white text-black dark:bg-zinc-800 dark:text-zinc-100'} h-[30px] border-none no-spinners text-sm`}
              maxLength={3}
            />
            <Separator className="my-0 bg-zinc-300 dark:bg-zinc-700" />
            <Input
              id="maxHp"
              type="text"
              inputMode="numeric"
              value={maxHp}
              onChange={handleMaxHpChange}
              onKeyDown={(e) => handleKeyDown(e, handleMaxHpBlur)}
              onFocus={() => setIsNumericInputActive(true)}
              onBlur={handleMaxHpBlur}
              className={`w-full text-center ${isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-white' : 'bg-white text-black dark:bg-zinc-800 dark:text-zinc-100'} h-[30px] border-none no-spinners text-sm`}
              maxLength={3}
            />
          </div>
        </div>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full h-[30px] text-xs ${isActive ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-white text-black hover:bg-zinc-100'} dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 border-zinc-300 dark:border-zinc-700`}
            >
              {getStatusLabel(character.state)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <div className="flex flex-col">
              {['alive', 'ko', 'stable', 'dead'].map((state) => (
                <Button
                  key={state}
                  variant="ghost"
                  onClick={() => handleStateChange(state)}
                  className="justify-start"
                >
                  {getStatusLabel(state)}
                </Button>
              ))}
              <Separator className="my-0" />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-red-900 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the character.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => removeCharacter(character.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {character.state === 'ko' && (
        <CharacterStateManager
          character={character}
          updateCharacter={updateCharacter}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default HPSection;