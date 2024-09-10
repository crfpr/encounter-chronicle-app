import { useState, useCallback } from 'react';

export const useCharacterManagement = (loadedEncounterData) => {
  const [characters, setCharacters] = useState(() => {
    if (loadedEncounterData && loadedEncounterData.characters) {
      return loadedEncounterData.characters.map(char => ({
        ...char,
        hasActed: false,
        state: char.state || 'alive',
        deathSaves: char.deathSaves || { successes: [], failures: [] },
        legendaryActions: char.legendaryActions || [false, false, false],
        legendaryResistances: char.legendaryResistances || [false, false, false]
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
        deathSaves: { successes: [], failures: [] },
        legendaryActions: [false, false, false],
        legendaryResistances: [false, false, false],
        ...(newCharacter.type === 'Environment' ? {
          action: undefined,
          bonusAction: undefined,
          reaction: undefined,
          currentMovement: undefined,
          maxMovement: undefined
        } : {})
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
          const baseUpdate = {
            ...c,
            ...updatedCharacter,
            deathSaves: updatedCharacter.deathSaves || c.deathSaves || { successes: [], failures: [] },
            legendaryActions: updatedCharacter.legendaryActions || c.legendaryActions || [false, false, false],
            legendaryResistances: updatedCharacter.legendaryResistances || c.legendaryResistances || [false, false, false]
          };

          if (updatedCharacter.type === 'Environment') {
            const { action, bonusAction, reaction, currentMovement, maxMovement, ...rest } = baseUpdate;
            return rest;
          }

          return baseUpdate;
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