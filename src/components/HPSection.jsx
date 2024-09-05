import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Separator } from "../components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';

const HPSection = ({ character, isActive, handleInputChange, handleNumericInputKeyDown, setIsNumericInputActive, updateCharacter, removeCharacter }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleStateChange = (newState) => {
    let updatedCharacter = { ...character, state: newState };
    if (newState === 'ko') {
      updatedCharacter.currentHp = 0;
      updatedCharacter.deathSaves = { successes: [], failures: [] };
    } else if (newState === 'stable') {
      updatedCharacter.currentHp = 1;
    } else if (newState === 'dead') {
      updatedCharacter.currentHp = 0;
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

  return (
    <div className={`w-20 flex-shrink-0 ${isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} border-l border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-between py-2 px-2 transition-colors duration-200`}>
      <div className="flex flex-col items-center space-y-2 w-full">
        <div className="flex flex-col items-center w-full">
          <label className={`text-xs font-semibold mb-1 ${isActive ? 'text-white dark:text-zinc-100' : 'text-black dark:text-zinc-100'}`}>HP</label>
          <div className="relative w-16 border border-zinc-300 dark:border-zinc-700 rounded">
            <Input
              type="text"
              inputMode="numeric"
              value={character.currentHp}
              onChange={(e) => handleInputChange('currentHp', e.target.value)}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentHp', character.currentHp)}
              onFocus={() => setIsNumericInputActive(true)}
              onBlur={() => setIsNumericInputActive(false)}
              className={`w-full text-center ${isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} h-[30px] border-none no-spinners text-sm`}
              maxLength={3}
            />
            <Separator className="my-0" />
            <Input
              type="text"
              inputMode="numeric"
              value={character.maxHp}
              onChange={(e) => handleInputChange('maxHp', e.target.value)}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxHp', character.maxHp)}
              onFocus={() => setIsNumericInputActive(true)}
              onBlur={() => setIsNumericInputActive(false)}
              className={`w-full text-center ${isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} h-[30px] border-none no-spinners text-sm`}
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
    </div>
  );
};

export default HPSection;