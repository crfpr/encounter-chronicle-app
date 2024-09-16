import { useState, useCallback, useEffect } from 'react';

export const useEncounterLogic = (combatants, setCombatants, autoSaveEncounter) => {
  const [round, setRound] = useState(1);
  const [activeCombatantIndex, setActiveCombatantIndex] = useState(0);
  const [encounterTime, setEncounterTime] = useState(0);
  const [turnTime, setTurnTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [encounterLog, setEncounterLog] = useState([]);

  const toggleEncounter = useCallback(() => {
    setIsRunning(prevIsRunning => {
      const newIsRunning = !prevIsRunning;
      logEvent(newIsRunning ? 'Encounter started' : 'Encounter paused');
      return newIsRunning;
    });
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setEncounterTime(prevTime => prevTime + 1);
        setTurnTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const resetCombatantActions = useCallback((combatantIndex) => {
    setCombatants(prevCombatants => prevCombatants.map((combatant, index) => {
      if (index === combatantIndex) {
        const updatedCombatant = {
          ...combatant,
          action: false,
          bonusAction: false,
          reaction: false,
          currentMovement: combatant.maxMovement,
        };
        console.log(`Resetting actions and movement for ${combatant.name}:`, updatedCombatant);
        logEvent(`Reset actions and movement for ${combatant.name}. Current movement set to ${updatedCombatant.currentMovement}`);
        return updatedCombatant;
      }
      return combatant;
    }));
  }, [setCombatants]);

  const changeTurn = useCallback((newIndex) => {
    setActiveCombatantIndex(newIndex);
    console.log(`Changing turn to combatant: ${combatants[newIndex].name}`);
    logEvent(`Turn changed to ${combatants[newIndex].name}`);
    resetCombatantActions(newIndex);
    setTurnTime(0);
    autoSaveEncounter(round, newIndex + 1);
  }, [combatants, resetCombatantActions, round, autoSaveEncounter]);

  const handlePreviousTurn = useCallback(() => {
    const newIndex = activeCombatantIndex === 0 ? combatants.length - 1 : activeCombatantIndex - 1;
    changeTurn(newIndex);
  }, [activeCombatantIndex, combatants.length, changeTurn]);

  const handleNextTurn = useCallback(() => {
    setCombatants(prevCombatants => {
      const updatedCombatants = prevCombatants.map((combatant, index) => {
        if (index === activeCombatantIndex) {
          const updatedTokens = combatant.tokens ? combatant.tokens.map(token => {
            if (!token.isPersistent && token.tokenDuration !== null && !combatant.hasActed) {
              const newDuration = token.tokenDuration > 0 ? token.tokenDuration - 1 : 0;
              if (newDuration !== token.tokenDuration) {
                logEvent(`Token "${token.label}" for ${combatant.name} decremented to ${newDuration}`);
              }
              return { ...token, tokenDuration: newDuration };
            }
            return token;
          }).filter(token => token.isPersistent || token.tokenDuration > 0) : [];

          return {
            ...combatant,
            cumulativeTurnTime: combatant.hasActed ? combatant.cumulativeTurnTime : (combatant.cumulativeTurnTime || 0) + turnTime,
            turnCount: combatant.hasActed ? combatant.turnCount : (combatant.turnCount || 0) + 1,
            hasActed: true,
            tokens: updatedTokens
          };
        }
        return combatant;
      });

      const allHaveActed = updatedCombatants.every(combatant => combatant.hasActed);

      if (allHaveActed) {
        setRound(prevRound => {
          console.log(`Starting new round: ${prevRound + 1}`);
          logEvent(`Round ${prevRound + 1} started`);
          return prevRound + 1;
        });
        return updatedCombatants.map(combatant => ({
          ...combatant,
          hasActed: false,
          roundCount: (combatant.roundCount || 0) + 1,
          legendaryActions: combatant.type === 'Legendary' ? [false, false, false] : combatant.legendaryActions
        }));
      }

      return updatedCombatants;
    });

    const newIndex = (activeCombatantIndex + 1) % combatants.length;
    changeTurn(newIndex);
  }, [combatants, activeCombatantIndex, turnTime, changeTurn]);

  const logEvent = useCallback((event) => {
    setEncounterLog(prevLog => [
      ...prevLog,
      {
        timestamp: new Date().toISOString(),
        event: event,
        encounterTime: encounterTime,
        round: round
      }
    ]);
    console.log(`Event logged: ${event}`);
  }, [encounterTime, round]);

  return {
    round,
    setRound,
    activeCombatantIndex,
    setActiveCombatantIndex,
    encounterTime,
    setEncounterTime,
    turnTime,
    setTurnTime,
    isRunning,
    setIsRunning,
    encounterLog,
    setEncounterLog,
    toggleEncounter,
    handlePreviousTurn,
    handleNextTurn,
    resetCombatantActions,
    logEvent
  };
};
