import React from 'react';
import { Button } from './ui/button';

const CharacterStateManager = ({ character, updateCharacter }) => {
  const handleStateChange = (newState) => {
    updateCharacter({ ...character, state: newState });
  };

  const renderStateButton = (state, label) => (
    <Button
      onClick={() => handleStateChange(state)}
      variant={character.state === state ? 'default' : 'outline'}
      size="sm"
      className="text-xs"
    >
      {label}
    </Button>
  );

  return (
    <div className="flex items-center space-x-2">
      {renderStateButton('alive', 'Alive')}
      {renderStateButton('unconscious', 'Unconscious')}
      {renderStateButton('dead', 'Dead')}
    </div>
  );
};

export default CharacterStateManager;