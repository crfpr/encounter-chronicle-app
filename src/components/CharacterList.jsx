import React from 'react';
import CharacterCard from './CharacterCard';
import { Button } from '../components/ui/button';

const CharacterList = ({ characters, setCharacters, activeCharacterIndex, turnTime, onPreviousTurn, onNextTurn, setIsNumericInputActive }) => {
  const addCharacter = () => {
    const newCharacter = {
      id: Date.now(),
      initiative: '',
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
      conditions: [],
      turnCount: 0,
      roundCount: 0,
      cumulativeTurnTime: 0
    };
    setCharacters(prevCharacters => [...prevCharacters, newCharacter]);
  };

  const removeCharacter = (id) => {
    setCharacters(prevCharacters => prevCharacters.filter(c => c.id !== id));
  };

  const updateCharacter = (updatedCharacter) => {
    setCharacters(prevCharacters => 
      prevCharacters.map(c => c.id === updatedCharacter.id ? { ...c, ...updatedCharacter } : c)
    );
  };

  const sortCharacters = () => {
    setCharacters(prevCharacters => 
      [...prevCharacters].sort((a, b) => {
        if (a.initiative === '' && b.initiative === '') return 0;
        if (a.initiative === '') return 1;
        if (b.initiative === '') return -1;
        return Number(b.initiative) - Number(a.initiative);
      })
    );
  };

  const handleInitiativeBlur = (id, initiative) => {
    updateCharacter({ id, initiative });
    sortCharacters();
  };

  const handleInitiativeSubmit = (id, initiative) => {
    updateCharacter({ id, initiative });
    sortCharacters();
  };

  return (
    <div className="space-y-4">
      {characters.map((character, index) => (
        <div key={character.id} className={`relative ${index === activeCharacterIndex ? 'z-10' : 'z-0'}`} data-index={index}>
          <CharacterCard
            character={character}
            updateCharacter={updateCharacter}
            removeCharacter={removeCharacter}
            isActive={index === activeCharacterIndex}
            turnTime={turnTime}
            onPreviousTurn={onPreviousTurn}
            onNextTurn={onNextTurn}
            setIsNumericInputActive={setIsNumericInputActive}
            onInitiativeBlur={handleInitiativeBlur}
            onInitiativeSubmit={handleInitiativeSubmit}
          />
        </div>
      ))}
      <div className="pb-6">
        <Button 
          onClick={addCharacter} 
          className="w-full bg-black hover:bg-gray-800 text-white dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors duration-200"
        >
          Add Character
        </Button>
      </div>
    </div>
  );
};

export default CharacterList;