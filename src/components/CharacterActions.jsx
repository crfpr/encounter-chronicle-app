import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { Input } from '../components/ui/input';

const CharacterActions = ({ character, isActive, updateCharacter, handleInputChange, handleNumericInputKeyDown, setIsNumericInputActive, isMobile }) => {
  const handleToggleAction = (value) => {
    const updatedCharacter = {
      ...character,
      action: value.includes('action'),
      bonusAction: value.includes('bonusAction'),
      reaction: value.includes('reaction')
    };
    updateCharacter(updatedCharacter);
  };

  const getToggleGroupItemStyle = (isActive, isToggled) => {
    return `h-[30px] px-2 text-xs border transition-colors ${
      isToggled
        ? isActive
          ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white'
          : 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white'
        : 'bg-white text-black hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800'
    } border-zinc-300 dark:border-zinc-800`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToggleGroup 
        type="multiple" 
        value={[
          character.action && 'action',
          character.bonusAction && 'bonusAction',
          character.reaction && 'reaction'
        ].filter(Boolean)}
        onValueChange={handleToggleAction}
        className="flex"
      >
        <ToggleGroupItem 
          value="action" 
          className={getToggleGroupItemStyle(isActive, character.action)}
        >
          {isMobile ? 'A' : 'Action'}
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="bonusAction" 
          className={getToggleGroupItemStyle(isActive, character.bonusAction)}
        >
          {isMobile ? 'B' : 'Bonus'}
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="reaction" 
          className={getToggleGroupItemStyle(isActive, character.reaction)}
        >
          {isMobile ? 'R' : 'Reaction'}
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          inputMode="numeric"
          value={character.currentMovement}
          onChange={(e) => handleInputChange('currentMovement', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentMovement', character.currentMovement)}
          onFocus={() => setIsNumericInputActive(true)}
          onBlur={() => setIsNumericInputActive(false)}
          className="w-16 text-center bg-white dark:bg-zinc-950 text-black dark:text-zinc-100 h-[30px] border-zinc-300 dark:border-zinc-800 no-spinners text-sm"
          placeholder="Current"
          maxLength={3}
        />
        <span className="self-center text-xs">/</span>
        <div className="flex items-center">
          <Input
            type="text"
            inputMode="numeric"
            value={character.maxMovement}
            onChange={(e) => handleInputChange('maxMovement', e.target.value)}
            onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxMovement', character.maxMovement)}
            onFocus={() => setIsNumericInputActive(true)}
            onBlur={() => setIsNumericInputActive(false)}
            className="w-16 text-center h-[30px] bg-white dark:bg-zinc-950 text-black dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 no-spinners text-sm"
            placeholder="Max"
            maxLength={3}
          />
          <span className="text-xs ml-1">ft</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterActions;