import React, { useEffect, useRef } from 'react';
import CharacterCard from './CharacterCard';
import { Button } from '../components/ui/button';

const CharacterList = ({ characters, setCharacters, activeCharacterIndex, turnTime, onPreviousTurn, onNextTurn, setIsNumericInputActive, round }) => {
  const activeCharacterRef = useRef(null);

  useEffect(() => {
    if (activeCharacterRef.current) {
      activeCharacterRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [activeCharacterIndex]);

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
      cumulativeTurnTime: 0,
      tokens: []
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
        <div 
          key={character.id} 
          className={`relative transition-all duration-300 ease-in-out ${index === activeCharacterIndex ? 'z-10' : 'z-0'}`} 
          data-index={index}
          ref={index === activeCharacterIndex ? activeCharacterRef : null}
        >
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
            round={round}
          />
        </div>
      ))}
      <div className="pb-6">
        <Button 
          onClick={addCharacter} 
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors duration-200"
        >
          Add Character
        </Button>
      </div>
    </div>
  );
};

export default CharacterList;