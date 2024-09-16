import { useState, useCallback } from 'react';

export const useCombatantManagement = (loadedEncounterData) => {
  const [combatants, setCombatants] = useState(() => {
    if (loadedEncounterData && loadedEncounterData.combatants) {
      return loadedEncounterData.combatants.map(char => ({
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

  const addCombatant = useCallback((newCombatant) => {
    setCombatants(prevCombatants => [
      ...prevCombatants,
      {
        ...newCombatant,
        hasActed: false,
        state: 'alive',
        deathSaves: { successes: [], failures: [] },
        legendaryActions: [false, false, false],
        legendaryResistances: [false, false, false],
        ...(newCombatant.type === 'Environment' ? {
          action: undefined,
          bonusAction: undefined,
          reaction: undefined,
          currentMovement: undefined,
          maxMovement: undefined
        } : {})
      }
    ]);
  }, []);

  const removeCombatant = useCallback((id) => {
    setCombatants(prevCombatants => prevCombatants.filter(c => c.id !== id));
  }, []);

  const updateCombatant = useCallback((updatedCombatant) => {
    setCombatants(prevCombatants => 
      prevCombatants.map(c => {
        if (c.id === updatedCombatant.id) {
          const baseUpdate = {
            ...c,
            ...updatedCombatant,
            deathSaves: updatedCombatant.deathSaves || c.deathSaves || { successes: [], failures: [] },
            legendaryActions: updatedCombatant.legendaryActions || c.legendaryActions || [false, false, false],
            legendaryResistances: updatedCombatant.legendaryResistances || c.legendaryResistances || [false, false, false]
          };

          if (updatedCombatant.type === 'Environment') {
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
    combatants,
    setCombatants,
    addCombatant,
    removeCombatant,
    updateCombatant
  };
};