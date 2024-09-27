import React, { useState, useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { Input } from '../components/ui/input';
import { useNumericInput } from '../hooks/useNumericInput';

const CombatantActions = ({ combatant, isActive, updateCombatant, setIsNumericInputActive, isMobile }) => {
  const [currentMovement, handleCurrentMovementChange, handleCurrentMovementKeyDown, setCurrentMovement] = useNumericInput(combatant.currentMovement, 0, 999);
  const [maxMovement, handleMaxMovementChange, handleMaxMovementKeyDown] = useNumericInput(combatant.maxMovement, 0, 999);

  useEffect(() => {
    setCurrentMovement(combatant.currentMovement);
  }, [combatant.currentMovement, setCurrentMovement]);

  const handleToggleAction = (value) => {
    const updatedCombatant = {
      ...combatant,
      action: value.includes('action'),
      bonusAction: value.includes('bonusAction'),
      reaction: value.includes('reaction')
    };
    updateCombatant(updatedCombatant);
  };

  const getToggleGroupItemStyle = (isActive, isToggled) => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    return `h-[30px] px-2 text-xs border transition-colors ${
      isToggled
        ? isDarkMode
          ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white'
          : 'bg-zinc-700 text-white'
        : 'bg-white text-black hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800'
        ? isLightMode
          ? 'bg-zinc-700 text-white dark:bg-zinc-700 light:text-white'
          : 'bg-zinc-700 text-white'
        : 'bg-white text-black hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800'
    } border-zinc-300 dark:border-zinc-800`;
  };

  const handleMovementChange = (type, value) => {
    updateCombatant({ ...combatant, [type]: value });
  };

  const handleKeyDown = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleMovementChange(type, e.target.value);
      setIsNumericInputActive(false);
      e.target.blur();
    } else {
      if (type === 'currentMovement') {
        handleCurrentMovementKeyDown(e);
      } else if (type === 'maxMovement') {
        handleMaxMovementKeyDown(e);
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleGroup 
        type="multiple" 
        value={[
          combatant.action && 'action',
          combatant.bonusAction && 'bonusAction',
          combatant.reaction && 'reaction'
        ].filter(Boolean)}
        onValueChange={handleToggleAction}
        className="flex"
      >
        <ToggleGroupItem 
          value="action" 
          className={getToggleGroupItemStyle(isActive, combatant.action)}
        >
          Action
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="bonusAction" 
          className={getToggleGroupItemStyle(isActive, combatant.bonusAction)}
        >
          Bonus
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="reaction" 
          className={getToggleGroupItemStyle(isActive, combatant.reaction)}
        >
          Reaction
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          inputMode="numeric"
          value={currentMovement}
          onChange={(e) => {
            handleCurrentMovementChange(e);
            handleMovementChange('currentMovement', e.target.value);
          }}
          onKeyDown={(e) => handleKeyDown(e, 'currentMovement')}
          onFocus={() => setIsNumericInputActive(true)}
          onBlur={() => {
            setIsNumericInputActive(false);
            handleMovementChange('currentMovement', currentMovement);
          }}
          className="w-16 text-center bg-white dark:bg-zinc-950 text-black dark:text-zinc-100 h-[30px] border-zinc-300 dark:border-zinc-800 no-spinners text-sm px-1"
          placeholder="Current"
          maxLength={3}
          id={`current-movement-${combatant.id}`}
        />
        <span className="self-center text-xs">/</span>
        <div className="flex items-center">
          <Input
            type="text"
            inputMode="numeric"
            value={maxMovement}
            onChange={(e) => {
              handleMaxMovementChange(e);
              handleMovementChange('maxMovement', e.target.value);
            }}
            onKeyDown={(e) => handleKeyDown(e, 'maxMovement')}
            onFocus={() => setIsNumericInputActive(true)}
            onBlur={() => {
              setIsNumericInputActive(false);
              handleMovementChange('maxMovement', maxMovement);
            }}
            className="w-16 text-center h-[30px] bg-white dark:bg-zinc-950 text-black dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 no-spinners text-sm px-1"
            placeholder="Max"
            maxLength={3}
            id={`max-movement-${combatant.id}`}
          />
          <span className="text-xs ml-1">ft</span>
        </div>
      </div>
    </div>
  );
};

export default CombatantActions;