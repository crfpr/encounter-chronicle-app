import React from 'react';
import CharacterCard from './CharacterCard';
import { Button } from '../components/ui/button';

const CharacterList = ({ characters, setCharacters, activeCharacterIndex, turnTime, onPreviousTurn, onNextTurn }) => {
  const addCharacter = () => {
    const newCharacter = {
      id: Date.now(),
      initiative: 10,
      name: 'New Character',
      type: 'PC',
      currentHp: 0,
      maxHp: 0,
      tempHp: 0,
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
    <div className="space-y-4 mb-4 pr-4">
      <div className="space-y-4">
        {characters.map((character, index) => (
          <div key={character.id} className={`relative ${index === activeCharacterIndex ? 'z-10' : 'z-0'}`}>
            <CharacterCard
              character={character}
              updateCharacter={updateCharacter}
              removeCharacter={removeCharacter}
              isActive={index === activeCharacterIndex}
              turnTime={turnTime}
              onPreviousTurn={onPreviousTurn}
              onNextTurn={onNextTurn}
            />
          </div>
        ))}
      </div>
      <Button onClick={addCharacter} className="w-full bg-black hover:bg-gray-800 text-white">Add Character</Button>
    </div>
  );
};

export default CharacterList;