import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { useNumericInput } from '../hooks/useNumericInput';

const HPSection = ({ combatant, isActive, updateCombatant, setIsNumericInputActive }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [currentHp, handleCurrentHpChange, handleCurrentHpKeyDown, setCurrentHp] = useNumericInput(combatant.currentHp);
  const [maxHp, handleMaxHpChange, handleMaxHpKeyDown] = useNumericInput(combatant.maxHp);
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current += 1;
    console.log(`HPSection useEffect #${renderCountRef.current} - combatant.id: ${combatant.id}, combatant.currentHp: ${combatant.currentHp}, local currentHp: ${currentHp}`);
    setCurrentHp(combatant.currentHp);
  }, [combatant.currentHp, setCurrentHp, combatant.id]);

  const handleStateChange = (newState) => {
    console.log(`State change from ${combatant.state} to ${newState}`);
    console.log(`Before state change - currentHp: ${currentHp}, combatant.currentHp: ${combatant.currentHp}`);
    let updatedCombatant = { ...combatant, state: newState };
    if (newState === 'ko') {
      updatedCombatant.currentHp = '0';
      updatedCombatant.deathSaves = { successes: [], failures: [] };
    } else if (newState === 'stable') {
      updatedCombatant.currentHp = '1';
    } else if (newState === 'dead') {
      updatedCombatant.currentHp = '0';
    } else if (newState === 'alive' && updatedCombatant.currentHp === '0') {
      updatedCombatant.currentHp = '1';
    }
    console.log(`After state change - updatedCombatant.currentHp: ${updatedCombatant.currentHp}`);
    updateCombatant(updatedCombatant);
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

  const handleHPChange = (type, value) => {
    console.log(`handleHPChange - type: ${type}, value: ${value}, current state: ${combatant.state}`);
    const numericValue = value === '' ? '' : Number(value);
    let newState = combatant.state;

    if (numericValue !== '') {
      if (numericValue <= 0 && Number(combatant.maxHp) > 0) {
        newState = 'ko';
      } else if (numericValue > 0) {
        if (combatant.state === 'ko' || combatant.state === 'dead' || (combatant.state === 'stable' && numericValue > 1)) {
          newState = 'alive';
        }
      }
    }

    console.log(`New state after HP change: ${newState}`);
    updateCombatant({
      ...combatant,
      [type]: value,
      state: newState,
      deathSaves: newState === 'ko' ? { successes: [], failures: [] } : combatant.deathSaves
    });
  };

  const handleCurrentHpBlur = () => {
    console.log(`handleCurrentHpBlur - currentHp: ${currentHp}`);
    handleHPChange('currentHp', currentHp);
    setIsNumericInputActive(false);
  };

  const handleMaxHpBlur = () => {
    console.log(`handleMaxHpBlur - maxHp: ${maxHp}`);
    handleHPChange('maxHp', maxHp);
    setIsNumericInputActive(false);
  };

  const handleKeyDown = (e, field, value) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
      if (field === 'currentHp') {
        handleCurrentHpBlur();
      } else if (field === 'maxHp') {
        handleMaxHpBlur();
      }
    } else {
      if (field === 'currentHp') {
        handleCurrentHpKeyDown(e);
      } else if (field === 'maxHp') {
        handleMaxHpKeyDown(e);
      }
    }
  };

  const getInputStyle = () => 
    isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100';

  const renderHPInputs = () => (
    <div className="flex flex-col items-center w-full space-y-2">
      <Input
        id={`current-hp-${combatant.id}`}
        type="text"
        inputMode="numeric"
        value={currentHp}
        onChange={handleCurrentHpChange}
        onKeyDown={(e) => handleKeyDown(e, 'currentHp', currentHp)}
        onFocus={() => setIsNumericInputActive(true)}
        onBlur={handleCurrentHpBlur}
        className={`w-full text-center ${getInputStyle()} h-[30px] border-zinc-300 dark:border-zinc-700 no-spinners text-xs`}
        placeholder="Current HP"
      />
      <Input
        id={`max-hp-${combatant.id}`}
        type="text"
        inputMode="numeric"
        value={maxHp}
        onChange={handleMaxHpChange}
        onKeyDown={(e) => handleKeyDown(e, 'maxHp', maxHp)}
        onFocus={() => setIsNumericInputActive(true)}
        onBlur={handleMaxHpBlur}
        className={`w-full text-center ${getInputStyle()} h-[30px] border-zinc-300 dark:border-zinc-700 no-spinners text-xs`}
        placeholder="Max HP"
      />
    </div>
  );

  const renderStateButton = () => (
    combatant.type !== 'Environment' ? (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full h-[30px] text-xs ${getInputStyle()} border-zinc-300 dark:border-zinc-700`}
          >
            {getStatusLabel(combatant.state)}
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
          </div>
        </PopoverContent>
      </Popover>
    ) : null
  );

  return (
    <div className={`w-20 flex-shrink-0 ${isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} border-l border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-between py-2 px-2 transition-colors duration-200`}>
      <div className="flex flex-col items-center space-y-2 w-full">
        {renderHPInputs()}
        {renderStateButton()}
      </div>
    </div>
  );
};

export default HPSection;