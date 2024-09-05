import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";

const CharacterActions = ({ character, updateCharacter, isActive }) => {
  const handleToggleAction = (value) => {
    const updatedCharacter = {
      ...character,
      action: value.includes('action'),
      bonusAction: value.includes('bonusAction'),
      reaction: value.includes('reaction')
    };
    updateCharacter(updatedCharacter);
  };

  const getToggleGroupItemStyle = (isToggled) => {
    return `h-[30px] px-2 text-xs border transition-colors ${
      isToggled
        ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white'
        : 'bg-white text-black hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800'
    } border-zinc-300 dark:border-zinc-800`;
  };

  return (
    <ToggleGroup type="multiple" className="flex flex-wrap gap-1" onValueChange={handleToggleAction}>
      <ToggleGroupItem value="action" className={getToggleGroupItemStyle(character.action)}>
        Action
      </ToggleGroupItem>
      <ToggleGroupItem value="bonusAction" className={getToggleGroupItemStyle(character.bonusAction)}>
        Bonus
      </ToggleGroupItem>
      <ToggleGroupItem value="reaction" className={getToggleGroupItemStyle(character.reaction)}>
        Reaction
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default CharacterActions;