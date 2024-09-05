import React from 'react';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

const CharacterStateManager = ({ character, updateCharacter }) => {
  const handleStateChange = (newState) => {
    updateCharacter({ ...character, state: newState });
  };

  const handleDeathSaveChange = (type, value) => {
    updateCharacter({
      ...character,
      deathSaves: {
        ...character.deathSaves,
        [type]: value
      }
    });
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

  const renderDeathSaves = () => (
    <div className="flex items-center space-x-2 mt-2">
      <Label className="text-xs">Failure</Label>
      <RadioGroup
        value={character.deathSaves.failures}
        onValueChange={(value) => handleDeathSaveChange('failures', parseInt(value))}
        className="flex space-x-1"
      >
        {[1, 2, 3].map((value) => (
          <RadioGroupItem key={`fail-${value}`} value={value} id={`fail-${value}`} />
        ))}
      </RadioGroup>
      <Separator orientation="vertical" className="h-6" />
      <RadioGroup
        value={character.deathSaves.successes}
        onValueChange={(value) => handleDeathSaveChange('successes', parseInt(value))}
        className="flex space-x-1"
      >
        {[1, 2, 3].map((value) => (
          <RadioGroupItem key={`success-${value}`} value={value} id={`success-${value}`} />
        ))}
      </RadioGroup>
      <Label className="text-xs">Success</Label>
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        {renderStateButton('alive', 'Alive')}
        {renderStateButton('unconscious', 'Unconscious')}
        {renderStateButton('dead', 'Dead')}
      </div>
      {character.state === 'unconscious' && renderDeathSaves()}
    </div>
  );
};

export default CharacterStateManager;