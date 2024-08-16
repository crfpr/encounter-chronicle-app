import React from 'react';
import CharacterCard from './CharacterCard';

const CharacterList = ({ characters, setCharacters, activeCharacterIndex, turnTime, onPreviousTurn, onNextTurn }) => {
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
  );
};

export default CharacterList;