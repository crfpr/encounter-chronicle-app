import { useState, useCallback } from 'react';

export const useCharacterManagement = (loadedEncounterData) => {
  const [characters, setCharacters] = useState(() => {
    if (loadedEncounterData && loadedEncounterData.characters) {
      return loadedEncounterData.characters.map(char => ({
        ...char,
        hasActed: false,
        state: char.state || 'alive',
        deathSaves: char.deathSaves || { successes: [], failures: [] }
      }));
    }
    return [];
  });

  const addCharacter = useCallback((newCharacter) => {
    setCharacters(prevCharacters => [
      ...prevCharacters,
      {
        ...newCharacter,
        hasActed: false,
        state: 'alive',
        deathSaves: { successes: [], failures: [] }
      }
    ]);
  }, []);

  const removeCharacter = useCallback((id) => {
    setCharacters(prevCharacters => prevCharacters.filter(c => c.id !== id));
  }, []);

  const updateCharacter = useCallback((updatedCharacter) => {
    setCharacters(prevCharacters => 
      prevCharacters.map(c => {
        if (c.id === updatedCharacter.id) {
          return {
            ...c,
            ...updatedCharacter,
            deathSaves: updatedCharacter.deathSaves || c.deathSaves || { successes: [], failures: [] }
          };
        }
        return c;
      })
    );
  }, []);

  return {
    characters,
    setCharacters,
    addCharacter,
    removeCharacter,
    updateCharacter
  };
};