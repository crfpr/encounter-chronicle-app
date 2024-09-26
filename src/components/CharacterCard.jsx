import React, { useState, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import CharacterNameType from './CharacterNameType';
import ConditionInput from './ConditionInput';
import { PlusCircle, Trash2 } from 'lucide-react';
import CharacterActions from './CharacterActions';
import HPSection from './HPSection';
import CombatantStateManager from './CombatantStateManager';
import LegendaryFeatures from './LegendaryFeatures';
import { Badge } from "../components/ui/badge";
import { Button } from '../components/ui/button';
import { useNumericInput } from '../hooks/useNumericInput';
import ShieldIcon from './ShieldIcon';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Input } from '../components/ui/input';

const CharacterCard = forwardRef(({ 
  character = {}, // Provide default empty object
  updateCharacter, 
  removeCharacter, 
  isActive, 
  turnTime, 
  onPreviousTurn, 
  onNextTurn, 
  setIsNumericInputActive, 
  onInitiativeBlur, 
  isMobile, 
}, ref) => {
  const [initiative, handleInitiativeChange, handleInitiativeKeyDown, setInitiative] = useNumericInput(character.initiative || '');
  const [ac, handleAcChange, handleAcKeyDown] = useNumericInput(character.ac || '');

  const handleAddCondition = useCallback(() => {
    const newCondition = { id: Date.now(), label: 'Condition', conditionDuration: null, isPersistent: true };
    updateCharacter({ ...character, conditions: [...(character.conditions || []), newCondition] });
  }, [character, updateCharacter]);

  const handleRemoveCondition = useCallback((conditionId) => {
    updateCharacter({ ...character, conditions: (character.conditions || []).filter(condition => condition.id !== conditionId) });
  }, [character, updateCharacter]);

  const handleConditionChange = useCallback((conditionId, changes) => {
    updateCharacter({
      ...character,
      conditions: (character.conditions || []).map(condition => 
        condition.id === conditionId ? { ...condition, ...changes } : condition
      )
    });
  }, [character, updateCharacter]);

  const handleInputBlurAndSubmit = useCallback((field, value) => {
    setIsNumericInputActive(false);
    if (field === 'initiative') {
      onInitiativeBlur(character.id, value);
    } else if (field === 'ac') {
      updateCharacter({ ...character, ac: value });
    }
  }, [character.id, onInitiativeBlur, setIsNumericInputActive, updateCharacter]);

  const handleInputKeyDown = useCallback((e, field, value) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
      handleInputBlurAndSubmit(field, value);
    } else {
      if (field === 'initiative') {
        handleInitiativeKeyDown(e);
      } else if (field === 'ac') {
        handleAcKeyDown(e);
      }
    }
  }, [handleInitiativeKeyDown, handleAcKeyDown, handleInputBlurAndSubmit]);

  const getBorderStyle = useCallback(() => 
    isActive ? 'border-zinc-50 border-2 -m-0.5' : 'border-zinc-300 dark:border-zinc-700'
  , [isActive]);

  const getTabColor = useCallback(() => 
    isActive ? 'bg-zinc-900 text-white dark:bg-zinc-900 dark:text-zinc-100' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'
  , [isActive]);

  const getInputStyle = useCallback(() => 
    isActive ? 'bg-zinc-900 text-white dark:bg-zinc-900 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'
  , [isActive]);

  const memoizedConditions = useMemo(() => (character.conditions || []).map((condition) => (
    <Badge
      key={condition.id}
      className={`h-[30px] px-1 flex items-center space-x-1 ${
        isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100' : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
      } hover:text-white transition-colors`}
    >
      <ConditionInput 
        condition={condition}
        onLabelChange={(newLabel) => handleConditionChange(condition.id, { label: newLabel })}
        onDurationChange={(newDuration) => handleConditionChange(condition.id, { conditionDuration: newDuration })}
        onRemove={() => handleRemoveCondition(condition.id)}
        onTogglePersistent={() => handleConditionChange(condition.id, { isPersistent: !condition.isPersistent })}
      />
    </Badge>
  )), [character.conditions, isActive, handleConditionChange, handleRemoveCondition]);

  const renderCharacterContent = () => (
    <>
      <div className="flex-grow space-y-2">
        <div className="flex items-start space-x-2 relative">
          <div className="flex-grow flex items-start">
            <div className={`flex-grow ${isMobile ? 'w-[40vw]' : ''}`}>
              <CharacterNameType
                name={character.name || 'New Character'}
                type={character.type}
                onUpdate={(newName, newType) => {
                  updateCharacter({ ...character, name: newName || 'New Character', type: newType });
                }}
                isMobile={isMobile}
              />
            </div>
            <div className="flex items-center ml-2 relative">
              <ShieldIcon className="absolute pointer-events-none" />
              <Input
                type="text"
                inputMode="numeric"
                value={ac}
                onChange={handleAcChange}
                onKeyDown={(e) => handleInputKeyDown(e, 'ac', ac)}
                onFocus={() => setIsNumericInputActive(true)}
                onBlur={() => handleInputBlurAndSubmit('ac', ac)}
                className={`w-[40px] h-[40px] text-center ${getInputStyle()} border-none focus:ring-0 text-sm`}
                maxLength={2}
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                }}
                id={`ac-${character.id}`}
              />
            </div>
          </div>
        </div>

        {character.type !== 'Environment' && character.state === 'alive' && (
          <CharacterActions
            character={character}
            isActive={isActive}
            updateCharacter={updateCharacter}
            setIsNumericInputActive={setIsNumericInputActive}
            isMobile={isMobile}
          />
        )}

        {character.type !== 'Environment' && character.state === 'ko' && (
          <CombatantStateManager
            character={character}
            updateCharacter={updateCharacter}
            isMobile={isMobile}
          />
        )}

        {character.type === 'Legendary' && (
          <LegendaryFeatures
            character={character}
            updateCharacter={updateCharacter}
            isMobile={isMobile}
          />
        )}

        <div className="flex items-center flex-wrap gap-2">
          {memoizedConditions}
          <Button
            onClick={handleAddCondition}
            className={`h-[30px] px-2 text-xs border transition-colors bg-white text-black hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800 border-zinc-300 dark:border-zinc-700 ${isMobile ? 'text-[10px]' : ''}`}
          >
            <PlusCircle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
            Add condition
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className={`flex bg-white dark:bg-zinc-950 relative overflow-hidden rounded-lg border ${getBorderStyle()} box-content transition-all duration-200 ease-in-out ${isMobile ? 'mx-0' : ''} min-h-[150px]`}>
      <div className={`w-[80px] flex-shrink-0 ${getTabColor()} border-r ${getBorderStyle()} flex flex-col items-center justify-between py-2 px-2 transition-colors duration-200`}>
        <div className="relative w-full">
          <Input
            type="text"
            inputMode="numeric"
            value={initiative}
            onChange={handleInitiativeChange}
            onKeyDown={(e) => handleInputKeyDown(e, 'initiative', initiative)}
            onFocus={() => setIsNumericInputActive(true)}
            onBlur={() => handleInputBlurAndSubmit('initiative', initiative)}
            className={`w-full text-center ${getInputStyle()} h-[40px] border-zinc-300 dark:border-zinc-700 no-spinners text-sm overflow-visible`}
            maxLength={3}
            id={`initiative-${character.id}`}
          />
          {!initiative && (
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-zinc-500 dark:text-zinc-400">
              Initiative
            </span>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center mt-2 h-[90px]">
          {isActive ? (
            <TurnNavigator
              turnTime={turnTime}
              onPreviousTurn={onPreviousTurn}
              onNextTurn={onNextTurn}
            />
          ) : (
            <PlaceholderTurnNavigator />
          )}
        </div>
      </div>
      
      <div className={`flex-grow p-2 flex flex-col ${isMobile ? 'px-1' : ''} relative`}>
        {renderCharacterContent()}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 p-0 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              <Trash2 className="h-4 w-4" />
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

      <HPSection
        character={character}
        isActive={isActive}
        setIsNumericInputActive={setIsNumericInputActive}
        updateCharacter={updateCharacter}
      />
    </div>
  );
});

export default CharacterCard;
