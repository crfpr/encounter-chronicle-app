import React, { useState, useCallback, useMemo } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { Badge } from "../components/ui/badge";
import TurnNavigator from './TurnNavigator';
import CharacterNameType from './CharacterNameType';
import TokenInput from './TokenInput';
import { PlusCircle, X, Clock } from 'lucide-react';
import CharacterActions from './CharacterActions';
import CharacterStats from './CharacterStats';
import TokenManagement from './TokenManagement';

const CharacterCard = React.memo(({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn, setIsNumericInputActive, onInitiativeBlur, onInitiativeSubmit, round }) => {
  const handleInputChange = useCallback((field, value) => {
    if (['initiative', 'ac', 'currentHp', 'maxHp', 'currentMovement', 'maxMovement'].includes(field)) {
      if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 999)) {
        updateCharacter({ ...character, [field]: value });
      }
    } else {
      updateCharacter({ ...character, [field]: value });
    }
  }, [character, updateCharacter]);

  const handleNumericInputKeyDown = useCallback((e, field, currentValue) => {
    if (!/[0-9]/.test(e.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputSubmit(field, currentValue);
      e.target.blur();
    }
  }, []);

  const handleInputSubmit = useCallback((field, value) => {
    setIsNumericInputActive(false);
    if (field === 'initiative') {
      onInitiativeSubmit(character.id, value);
    } else {
      handleInputChange(field, value);
    }
  }, [character.id, handleInputChange, onInitiativeSubmit, setIsNumericInputActive]);

  const handleInitiativeBlur = useCallback(() => {
    onInitiativeBlur(character.id, character.initiative);
  }, [character.id, character.initiative, onInitiativeBlur]);

  const getBorderStyle = useCallback(() => {
    return isActive ? 'border-zinc-800 dark:border-zinc-800' : 'border-zinc-300 dark:border-zinc-800';
  }, [isActive]);

  const getTabColor = useCallback(() => {
    return isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100';
  }, [isActive]);

  return (
    <div className={`bg-white dark:bg-zinc-950 border ${getBorderStyle()} rounded-lg overflow-hidden mb-4 transition-all duration-300 ease-in-out`}>
      <div className={`${getTabColor()} p-2 flex justify-between items-center`}>
        <div className="flex-grow">
          <CharacterNameType
            name={character.name}
            type={character.type}
            onUpdate={(name, type) => updateCharacter({ ...character, name, type })}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={character.initiative}
            onChange={(e) => handleInputChange('initiative', e.target.value)}
            onKeyDown={(e) => handleNumericInputKeyDown(e, 'initiative', character.initiative)}
            onBlur={handleInitiativeBlur}
            className="w-12 h-[30px] text-center bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
            placeholder="Init"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="h-[30px] px-2 bg-red-500 hover:bg-red-600 text-white">
                <X className="h-4 w-4" />
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
      </div>
      <div className="p-4 grid grid-cols-12 gap-4">
        <div className="col-span-9 space-y-4">
          <CharacterStats
            character={character}
            handleInputChange={handleInputChange}
            handleNumericInputKeyDown={handleNumericInputKeyDown}
          />
          <CharacterActions
            character={character}
            updateCharacter={updateCharacter}
            isActive={isActive}
          />
          <TokenManagement
            tokens={character.tokens}
            updateCharacter={updateCharacter}
            isActive={isActive}
            setIsNumericInputActive={setIsNumericInputActive}
          />
        </div>
        <div className="col-span-3">
          <TurnNavigator
            turnTime={turnTime}
            onPreviousTurn={onPreviousTurn}
            onNextTurn={onNextTurn}
          />
        </div>
      </div>
    </div>
  );
});

export default CharacterCard;