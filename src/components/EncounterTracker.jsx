import React, { useState, useEffect, useCallback } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import CharacterStats from './CharacterStats';
import NotesSection from './NotesSection';
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
  const [roundStates, setRoundStates] = useState([]);
  const [notes, setNotes] = useState('');

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

    setCharacters(prevCharacters => prevCharacters.map((char, index) => {
      if (index === activeCharacterIndex) {
        return {
          ...char,
          turnCount: (char.turnCount || 0) + 1,
          cumulativeTurnTime: (char.cumulativeTurnTime || 0) + turnTime
        };
      }
      return char;
    }));

    setTurnTime(0);
    setActiveCharacterIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % characters.length;
      if (nextIndex === 0) {
        setRoundStates(prevStates => [...prevStates, characters]);

        setRound((prevRound) => {
          setShowSparkles(true);
          setTimeout(() => setShowSparkles(false), 1000);
          return prevRound + 1;
        });

        setCharacters(prevCharacters => prevCharacters.map(char => ({
          ...char,
          action: false,
          bonusAction: false,
          reaction: false,
          currentMovement: char.maxMovement,
          conditions: char.conditions
            .map(condition => ({
              ...condition,
              duration: condition.duration === 'P' ? 'P' : 
                (parseInt(condition.duration) > 1 ? (parseInt(condition.duration) - 1).toString() : '0')
            }))
            .filter(condition => condition.duration !== '0')
        })));
      }
      return nextIndex;
    });
  }, [characters, activeCharacterIndex, turnTime]);

  const handlePreviousTurn = useCallback(() => {
    if (characters.length === 0) return;

    setTurnTime(0);
    setActiveCharacterIndex((prevIndex) => {
      const nextIndex = (prevIndex - 1 + characters.length) % characters.length;
      if (prevIndex === 0) {
        setRound((prevRound) => {
          if (prevRound > 1) {
            const previousState = roundStates[prevRound - 2];
            if (previousState) {
              setCharacters(previousState);
              setRoundStates(prevStates => prevStates.slice(0, -1));
            }
          }
          return Math.max(1, prevRound - 1);
        });
      }
      return nextIndex;
    });
  }, [characters.length, roundStates]);

  const toggleEncounter = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
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
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6 relative">
        <EncounterHeader
          encounterName={encounterName}
          setEncounterName={setEncounterName}
          isRunning={isRunning}
          toggleEncounter={toggleEncounter}
          encounterTime={encounterTime}
        />
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-semibold flex items-center">
            Round {round}
            {showSparkles && <Sparkles />}
          </div>
        </div>
        <div className="flex">
          <div className="w-16 mr-2"></div>
          <div className="flex-grow flex flex-col">
            <CharacterList 
              characters={characters} 
              setCharacters={setCharacters} 
              activeCharacterIndex={activeCharacterIndex}
              turnTime={turnTime}
              onNextTurn={handleNextTurn}
              onPreviousTurn={handlePreviousTurn}
            />
          </div>
        </div>
      </div>
      <NotesSection notes={notes} setNotes={setNotes} />
      <div className="bg-white shadow-md rounded-lg p-6">
        <CharacterStats characters={characters} round={round} />
      </div>
    </div>
  );
};

export default EncounterTracker;