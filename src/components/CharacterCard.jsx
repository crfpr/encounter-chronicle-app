import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Input } from '../components/ui/input';
import CombatantNameType from './CombatantNameType';
import ConditionInput from './ConditionInput';
import { PlusCircle, Trash2 } from 'lucide-react';
import CombatantActions from './CombatantActions';
import HPSection from './HPSection';
import CombatantStateManager from './CombatantStateManager';
import LegendaryFeatures from './LegendaryFeatures';
import { Badge } from "../components/ui/badge";
import { Button } from '../components/ui/button';
import { useNumericInput } from '../hooks/useNumericInput';
import ShieldIcon from './ShieldIcon';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';

const CharacterCard = React.memo(({ 
  combatant, 
  updateCombatant, 
  removeCombatant, 
  isActive, 
  setIsNumericInputActive, 
  onInitiativeBlur, 
  isMobile, 
}) => {
  const [initiative, handleInitiativeChange, handleInitiativeKeyDown, setInitiative] = useNumericInput(combatant.initiative);
  const [ac, handleAcChange, handleAcKeyDown] = useNumericInput(combatant.ac);
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current += 1;
    console.log(`CharacterCard render #${renderCountRef.current} - combatant.id: ${combatant.id}, combatant.initiative: ${combatant.initiative}, local initiative: ${initiative}`);
  });

  const handleAddCondition = useCallback(() => {
    const newCondition = { id: Date.now(), label: 'Condition', conditionDuration: null, isPersistent: true };
    updateCombatant({ ...combatant, conditions: [...combatant.conditions, newCondition] });
  }, [combatant, updateCombatant]);

  const handleRemoveCondition = useCallback((conditionId) => {
    updateCombatant({ ...combatant, conditions: combatant.conditions.filter(condition => condition.id !== conditionId) });
  }, [combatant, updateCombatant]);

  const handleConditionChange = useCallback((conditionId, changes) => {
    updateCombatant({
      ...combatant,
      conditions: combatant.conditions.map(condition => 
        condition.id === conditionId ? { ...condition, ...changes } : condition
      )
    });
  }, [combatant, updateCombatant]);

  const handleInputBlurAndSubmit = useCallback((field, value) => {
    setIsNumericInputActive(false);
    if (field === 'initiative') {
      console.log(`Initiative blur - value: ${value}`);
      onInitiativeBlur(combatant.id, value);
    } else if (field === 'ac') {
      updateCombatant({ ...combatant, ac: value });
    }
  }, [combatant.id, onInitiativeBlur, setIsNumericInputActive, updateCombatant]);

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
    isActive ? 'border-zinc-700 dark:border-zinc-700' : 'border-zinc-300 dark:border-zinc-700'
  , [isActive]);

  const getTabColor = useCallback(() => 
    isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'
  , [isActive]);

  const getInputStyle = useCallback(() => 
    isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'
  , [isActive]);

  const memoizedConditions = useMemo(() => combatant.conditions.map((condition) => (
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
  )), [combatant.conditions, isActive, handleConditionChange, handleRemoveCondition]);

  const renderCombatantContent = () => (
    <>
      <div className="flex-grow space-y-2">
        <div className="flex items-start space-x-2 relative">
          <div className="flex-grow flex items-start">
            <div className={`flex-grow ${isMobile ? 'w-[40vw]' : ''}`}>
              <CombatantNameType
                name={combatant.name || 'New Combatant'}
                type={combatant.type}
                onUpdate={(newName, newType) => {
                  updateCombatant({ ...combatant, name: newName || 'New Combatant', type: newType });
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
                className="w-[40px] h-[30px] text-center bg-transparent text-black dark:text-zinc-100 border-none focus:ring-0 text-sm px-1"
                maxLength={2}
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'textfield',
                }}
                id={`ac-${combatant.id}`}
              />
            </div>
          </div>
        </div>

        {combatant.type !== 'Environment' && combatant.state === 'alive' && (
          <CombatantActions
            combatant={combatant}
            isActive={isActive}
            updateCombatant={updateCombatant}
            setIsNumericInputActive={setIsNumericInputActive}
            isMobile={isMobile}
          />
        )}

        {combatant.type !== 'Environment' && combatant.state === 'ko' && (
          <CombatantStateManager
            combatant={combatant}
            updateCombatant={updateCombatant}
            isMobile={isMobile}
          />
        )}

        {combatant.type === 'Legendary' && (
          <LegendaryFeatures
            character={combatant}
            updateCharacter={updateCombatant}
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
            className={`w-full text-center ${getInputStyle()} h-[30px] border-zinc-300 dark:border-zinc-700 no-spinners text-xs px-1`}
            maxLength={3}
            id={`initiative-${combatant.id}`}
            placeholder="Init."
          />
        </div>
      </div>
      
      <div className={`flex-grow p-2 flex flex-col ${isMobile ? 'px-1' : ''} relative`}>
        {renderCombatantContent()}
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
                This action cannot be undone. This will permanently delete the combatant.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => removeCombatant(combatant.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <HPSection
        combatant={combatant}
        isActive={isActive}
        setIsNumericInputActive={setIsNumericInputActive}
        updateCombatant={updateCombatant}
      />
    </div>
  );
});

export default CharacterCard;