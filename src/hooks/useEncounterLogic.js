import { useState, useCallback, useEffect } from 'react';

export const useEncounterLogic = (characters, setCharacters, autoSaveEncounter) => {
  const [round, setRound] = useState(1);
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [encounterTime, setEncounterTime] = useState(0);
  const [turnTime, setTurnTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [encounterLog, setEncounterLog] = useState([]);

  const toggleEncounter = useCallback(() => {
    setIsRunning(prevIsRunning => !prevIsRunning);
    logEvent(isRunning ? 'Encounter paused' : 'Encounter started');
  }, [isRunning]);

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

  const resetCharacterActions = useCallback((characterIndex) => {
    setCharacters(prevCharacters => prevCharacters.map((char, index) => {
      if (index === characterIndex) {
        const updatedChar = {
          ...char,
          action: false,
          bonusAction: false,
          reaction: false,
          currentMovement: char.maxMovement,
        };
        if (char.type === 'Legendary') {
          updatedChar.legendaryActions = [false, false, false];
        }
        console.log(`Resetting actions for ${char.name}:`, updatedChar);
        logEvent(`Reset actions and movement for ${char.name}. Current movement set to ${updatedChar.currentMovement}`);
        return updatedChar;
      }
      return char;
    }));
  }, []);

  const changeTurn = useCallback((newIndex) => {
    setActiveCharacterIndex(newIndex);
    console.log(`Changing turn to character: ${characters[newIndex].name}`);
    logEvent(`Turn changed to ${characters[newIndex].name}`);
    resetCharacterActions(newIndex);
    setTurnTime(0);
    autoSaveEncounter(round, newIndex + 1);
  }, [characters, resetCharacterActions, round, autoSaveEncounter]);

  const handlePreviousTurn = useCallback(() => {
    const newIndex = activeCharacterIndex === 0 ? characters.length - 1 : activeCharacterIndex - 1;
    changeTurn(newIndex);
  }, [activeCharacterIndex, characters.length, changeTurn]);

  const handleNextTurn = useCallback(() => {
    setCharacters(prevCharacters => {
      const updatedCharacters = prevCharacters.map((char, index) => {
        if (index === activeCharacterIndex) {
          const updatedTokens = char.tokens.map(token => {
            if (!token.isPersistent && token.tokenDuration !== null && !char.hasActed) {
              const newDuration = token.tokenDuration > 0 ? token.tokenDuration - 1 : 0;
              if (newDuration !== token.tokenDuration) {
                logEvent(`Token "${token.label}" for ${char.name} decremented to ${newDuration}`);
              }
              return { ...token, tokenDuration: newDuration };
            }
            return token;
          }).filter(token => token.isPersistent || token.tokenDuration > 0);

          return {
            ...char,
            cumulativeTurnTime: char.hasActed ? char.cumulativeTurnTime : (char.cumulativeTurnTime || 0) + turnTime,
            turnCount: char.hasActed ? char.turnCount : (char.turnCount || 0) + 1,
            hasActed: true,
            tokens: updatedTokens
          };
        }
        return char;
      });

      const allHaveActed = updatedCharacters.every(char => char.hasActed);

      if (allHaveActed) {
        setRound(prevRound => {
          console.log(`Starting new round: ${prevRound + 1}`);
          logEvent(`Round ${prevRound + 1} started`);
          return prevRound + 1;
        });
        return updatedCharacters.map(char => ({
          ...char,
          hasActed: false,
          roundCount: (char.roundCount || 0) + 1,
          legendaryActions: char.type === 'Legendary' ? [false, false, false] : char.legendaryActions
        }));
      }

      return updatedCharacters;
    });

    const newIndex = (activeCharacterIndex + 1) % characters.length;
    changeTurn(newIndex);
  }, [characters, activeCharacterIndex, turnTime, changeTurn]);

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
    activeCharacterIndex,
    setActiveCharacterIndex,
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
    resetCharacterActions,
    logEvent
  };
};