import React from 'react';
import CharacterCard from './CharacterCard';
import { Button } from '../components/ui/button';

const CharacterList = ({ characters, setCharacters, activeCharacterIndex, turnTime, onNextTurn, onPreviousTurn }) => {
  const addCharacter = () => {
    const newCharacter = {
      id: Date.now(),
      initiative: 10,
      name: 'New Character',
      type: 'PC',
      currentHp: 10,
      maxHp: 10,
      ac: 10,
      action: false,
      bonusAction: false,
      currentMovement: 30,
maxMovement: 30,
      reaction: false,
      conditions: []
    };
    setCharacters(prevCharacters => [...prevCharacters, newCharacter].sort((a, b) => b.initiative - a.initiative));
  };

  const removeCharacter = (id) => {
    setCharacters(prevCharacters => prevCharacters.filter(c => c.id !== id).sort((a, b) => b.initiative - a.initiative));
  };

  const updateCharacter = (updatedCharacter) => {
    setCharacters(prevCharacters => 
      prevCharacters.map(c => c.id === updatedCharacter.id ? updatedCharacter : c)
        .sort((a, b) => b.initiative - a.initiative)
    );
  };

  return (
    <div className="space-y-4 mb-4">
      {characters.map((character, index) => (
        <CharacterCard
          key={character.id}
          character={character}
          updateCharacter={updateCharacter}
          removeCharacter={removeCharacter}
          isActive={index === activeCharacterIndex}
          turnTime={turnTime}
          onNextTurn={onNextTurn}
          onPreviousTurn={onPreviousTurn}
        />
      ))}
      <div className="flex">
        <div className="w-16 mr-2"></div>
        <Button onClick={addCharacter} className="flex-grow">Add Character</Button>
      </div>
    </div>
  );
};

export default CharacterList;