import React, { useState, useEffect, useCallback } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import Sparkles from './Sparkles';

const EncounterTracker = () => {
  const [encounterName, setEncounterName] = useState('New Encounter');
  const [round, setRound] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [encounterTime, setEncounterTime] = useState(0);
  const [turnTime, setTurnTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [previousRoundState, setPreviousRoundState] = useState(null);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setEncounterTime((prevTime) => prevTime + 1);
        setTurnTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleNextTurn = useCallback(() => {
    if (characters.length === 0) return;

    setTurnTime(0);
    setActiveCharacterIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % characters.length;
      if (nextIndex === 0) {
        // Save the current state before starting a new round
        setPreviousRoundState(characters);

        setRound((prevRound) => {
          setShowSparkles(true);
          setTimeout(() => setShowSparkles(false), 1000);
          
          // Reset all characters when a new round starts
          setCharacters(prevCharacters => prevCharacters.map(char => ({
            ...char,
            action: false,
            bonusAction: false,
            reaction: false,
            currentMovement: char.maxMovement
          })));
          
          return prevRound + 1;
        });
      }
      return nextIndex;
    });
  }, [characters]);

  const handlePreviousTurn = useCallback(() => {
    if (characters.length === 0) return;

    setTurnTime(0);
    setActiveCharacterIndex((prevIndex) => {
      const nextIndex = (prevIndex - 1 + characters.length) % characters.length;
      if (prevIndex === 0) {
        setRound((prevRound) => {
          if (prevRound > 1 && previousRoundState) {
            // Restore the previous round's state
            setCharacters(previousRoundState);
            setPreviousRoundState(null);
          }
          return Math.max(1, prevRound - 1);
        });
      }
      return nextIndex;
    });
  }, [characters.length, previousRoundState]);

  const toggleEncounter = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        handlePreviousTurn();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        handleNextTurn();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNextTurn, handlePreviousTurn]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 relative">
      <EncounterHeader
        encounterName={encounterName}
        setEncounterName={setEncounterName}
        isRunning={isRunning}
        toggleEncounter={toggleEncounter}
      />
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold flex items-center">
          Round {round}
          {showSparkles && <Sparkles />}
        </div>
        <div>Encounter Time: {formatTime(encounterTime)}</div>
      </div>
      <CharacterList 
        characters={characters} 
        setCharacters={setCharacters} 
        activeCharacterIndex={activeCharacterIndex}
        turnTime={turnTime}
        onNextTurn={handleNextTurn}
        onPreviousTurn={handlePreviousTurn}
      />
    </div>
  );
};

export default EncounterTracker;