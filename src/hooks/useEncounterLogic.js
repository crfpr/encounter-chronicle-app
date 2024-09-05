import { useState, useCallback, useEffect } from 'react';

export const useEncounterLogic = (characters, setCharacters) => {
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
          currentMovement: char.maxMovement
        };
        logEvent(`Reset actions for ${char.name}`);
        return updatedChar;
      }
      return char;
    }));
  }, []);

  const handlePreviousTurn = useCallback(() => {
    setActiveCharacterIndex(prevIndex => {
      const newIndex = prevIndex === 0 ? characters.length - 1 : prevIndex - 1;
      logEvent(`Turn changed to ${characters[newIndex].name}`);
      return newIndex;
    });
    setTurnTime(0);
  }, [characters]);

  const handleNextTurn = useCallback(() => {
    setCharacters(prevCharacters => {
      const updatedCharacters = prevCharacters.map((char, index) => {
        if (index === activeCharacterIndex) {
          const updatedTokens = char.tokens.map(token => {
            if (!token.isPersistent && token.tokenDuration !== null) {
              return {
                ...token,
                tokenDuration: token.tokenDuration > 0 ? token.tokenDuration - 1 : 0
              };
            }
            return token;
          }).filter(token => token.isPersistent || token.tokenDuration > 0);

          return {
            ...char,
            cumulativeTurnTime: (char.cumulativeTurnTime || 0) + turnTime,
            tokens: updatedTokens,
            hasActed: true,
            turnCount: (char.turnCount || 0) + 1
          };
        }
        return char;
      });

      const newActiveIndex = (activeCharacterIndex + 1) % characters.length;

      const allHaveActed = updatedCharacters.every(char => char.hasActed);

      if (allHaveActed) {
        setRound(prevRound => {
          logEvent(`Round ${prevRound + 1} started`);
          return prevRound + 1;
        });
        return updatedCharacters.map(char => ({
          ...char,
          hasActed: false
        }));
      }

      return updatedCharacters;
    });

    setActiveCharacterIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % characters.length;
      resetCharacterActions(newIndex);
      logEvent(`Turn changed to ${characters[newIndex].name}`);
      return newIndex;
    });

    setTurnTime(0);
  }, [characters, activeCharacterIndex, turnTime, resetCharacterActions]);

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