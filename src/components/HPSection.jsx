import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { useNumericInput } from '../hooks/useNumericInput';

const HPSection = ({ combatant, isActive, updateCombatant, setIsNumericInputActive }) => {
  const [currentHp, setCurrentHp] = useState(combatant.currentHp);
  const [maxHp, setMaxHp] = useState(combatant.maxHp);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const renderCountRef = useRef(0);

  useEffect(() => {
    renderCountRef.current += 1;
    console.log(`HPSection useEffect #${renderCountRef.current} - combatant.id: ${combatant.id}, combatant.currentHp: ${combatant.currentHp}, local currentHp: ${currentHp}`);
    setCurrentHp(combatant.currentHp);
  }, [combatant.currentHp, setCurrentHp, combatant.id]);

  const handleHPChange = (type, value) => {
    console.log(`handleHPChange - type: ${type}, value: ${value}, current state: ${combatant.state}`);
    updateCombatant({ ...combatant, [type]: value });
  };

  const handleCurrentHpChange = (e) => {
    const value = e.target.value;
    setCurrentHp(value);
    console.log(`Current HP changed to: ${value}`);
  };

  const handleMaxHpChange = (e) => {
    const value = e.target.value;
    setMaxHp(value);
    console.log(`Max HP changed to: ${value}`);
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

  const getStatusLabel = (state) => {
    switch (state) {
      case 'ko': return 'KO';
      case 'stable': return 'Stable';
      case 'dead': return 'Dead';
      default: return 'Alive';
    }
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
        value={currentHp === '' ? '' : currentHp}
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
        value={maxHp === '' ? '' : maxHp}
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