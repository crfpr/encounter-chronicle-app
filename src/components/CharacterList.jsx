import React from 'react';
import CharacterCard from './CharacterCard';

const CharacterList = ({ characters, setCharacters, activeCharacterIndex, turnTime, onNextTurn, onPreviousTurn }) => {
  const updateCharacter = (updatedCharacter) => {
    setCharacters(prevCharacters => 
      prevCharacters.map(c => c.id === updatedCharacter.id ? updatedCharacter : c)
        .sort((a, b) => b.initiative - a.initiative)
    );
  };

  const removeCharacter = (id) => {
    setCharacters(prevCharacters => prevCharacters.filter(c => c.id !== id).sort((a, b) => b.initiative - a.initiative));
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default CharacterList;