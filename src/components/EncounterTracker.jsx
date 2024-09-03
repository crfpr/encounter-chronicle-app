import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import CharacterStats from './CharacterStats';
import NotesSection from './NotesSection';
import MobileMenu from './MobileMenu';
import SwipeHandler from './SwipeHandler';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';

const EncounterTracker = forwardRef(({ encounterName, setEncounterName, exportEncounterData, uploadEncounterData, isMobile, contentHeight, loadedEncounterData }, ref) => {
  const [round, setRound] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [encounterTime, setEncounterTime] = useState(0);
  const [turnTime, setTurnTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState('');
  const [activePage, setActivePage] = useState('tracker');
  const [isNumericInputActive, setIsNumericInputActive] = useState(false);
  const [lastResetIndex, setLastResetIndex] = useState(-1);
  const [encounterLog, setEncounterLog] = useState([]);

  useImperativeHandle(ref, () => ({
    getEncounterData: () => ({
      encounterName,
      characters,
      round,
      encounterTime,
      notes,
      log: encounterLog,
      activeCharacterIndex,
      isRunning
    })
  }));

  useEffect(() => {
    if (loadedEncounterData) {
      setRound(loadedEncounterData.round || 1);
      setCharacters(loadedEncounterData.characters || []);
      setActiveCharacterIndex(loadedEncounterData.activeCharacterIndex || 0);
      setEncounterTime(loadedEncounterData.encounterTime || 0);
      setNotes(loadedEncounterData.notes || '');
      setEncounterLog(loadedEncounterData.log || []);
      setEncounterName(loadedEncounterData.encounterName || 'New Encounter');
      setIsRunning(loadedEncounterData.isRunning || false);
      logEvent('Encounter data loaded');
    }
  }, [loadedEncounterData, setEncounterName]);

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

  const resetCharacterActions = (characterIndex) => {
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
  };

  const handlePreviousTurn = () => {
    setActiveCharacterIndex(prevIndex => {
      const newIndex = prevIndex === 0 ? characters.length - 1 : prevIndex - 1;
      logEvent(`Turn changed to ${characters[newIndex].name}`);
      return newIndex;
    });
    setTurnTime(0);
  };

  const handleNextTurn = () => {
    setActiveCharacterIndex(prevIndex => {
      const newIndex = prevIndex === characters.length - 1 ? 0 : prevIndex + 1;
      
      if (newIndex > lastResetIndex || (lastResetIndex === characters.length - 1 && newIndex === 0)) {
        resetCharacterActions(newIndex);
        setLastResetIndex(newIndex);
      }
      
      logEvent(`Turn changed to ${characters[newIndex].name}`);
      return newIndex;
    });

    setTurnTime(0);

    setCharacters(prevCharacters => {
      const updatedCharacters = prevCharacters.map((char, index) => {
        if (index === activeCharacterIndex) {
          return {
            ...char,
            cumulativeTurnTime: (char.cumulativeTurnTime || 0) + turnTime,
          };
        }
        return char;
      });

      if (activeCharacterIndex === characters.length - 1) {
        setRound(prevRound => {
          logEvent(`Round ${prevRound + 1} started`);
          return prevRound + 1;
        });
        setLastResetIndex(-1);
        return updatedCharacters.map(char => ({
          ...char,
          hasActedThisRound: false
        }));
      }

      return updatedCharacters;
    });
  };

  useEffect(() => {
    setCharacters(prevCharacters => prevCharacters.map((char, index) => {
      if (index === activeCharacterIndex && !char.hasActedThisRound) {
        return {
          ...char,
          turnCount: (char.turnCount || 0) + 1,
          roundCount: round,
          hasActedThisRound: true
        };
      }
      return char;
    }));
  }, [activeCharacterIndex, round]);

  const handleSwipeLeft = () => {
    if (isMobile) {
      setActivePage(prevPage => {
        switch (prevPage) {
          case 'tracker':
            return 'notes';
          case 'notes':
            return 'stats';
          default:
            return prevPage;
        }
      });
    }
  };

  const handleSwipeRight = () => {
    if (isMobile) {
      setActivePage(prevPage => {
        switch (prevPage) {
          case 'notes':
            return 'tracker';
          case 'stats':
            return 'notes';
          default:
            return prevPage;
        }
      });
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (!isMobile && characters.length > 1 && !isNumericInputActive) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePreviousTurn();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextTurn();
      }
    }
  }, [isMobile, characters.length, isNumericInputActive, handlePreviousTurn, handleNextTurn]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const logEvent = (event) => {
    setEncounterLog(prevLog => [
      ...prevLog,
      {
        timestamp: new Date().toISOString(),
        event: event,
        encounterTime: encounterTime,
        round: round
      }
    ]);
  };

  const updateCharacter = (updatedCharacter) => {
    setCharacters(prevCharacters => 
      prevCharacters.map(c => {
        if (c.id === updatedCharacter.id) {
          logEvent(`Updated ${c.name}: ${JSON.stringify(updatedCharacter)}`);
          return { ...c, ...updatedCharacter };
        }
        return c;
      })
    );
  };

  const addCharacter = (newCharacter) => {
    setCharacters(prevCharacters => [...prevCharacters, newCharacter]);
    logEvent(`Added new character: ${newCharacter.name}`);
  };

  const removeCharacter = (id) => {
    const characterToRemove = characters.find(c => c.id === id);
    setCharacters(prevCharacters => prevCharacters.filter(c => c.id !== id));
    logEvent(`Removed character: ${characterToRemove.name}`);
  };

  const renderContent = () => {
    if (isMobile) {
      switch (activePage) {
        case 'tracker':
          return (
            <div className="flex-grow overflow-hidden flex flex-col h-full">
              <div className="mb-4">
                <EncounterHeader
                  isRunning={isRunning}
                  toggleEncounter={toggleEncounter}
                  encounterTime={encounterTime}
                  round={round}
                />
              </div>
              <div className="flex-grow overflow-y-auto pb-20">
                <CharacterList 
                  characters={characters} 
                  setCharacters={setCharacters} 
                  activeCharacterIndex={activeCharacterIndex}
                  turnTime={turnTime}
                  onPreviousTurn={handlePreviousTurn}
                  onNextTurn={handleNextTurn}
                  setIsNumericInputActive={setIsNumericInputActive}
                  updateCharacter={updateCharacter}
                  addCharacter={addCharacter}
                  removeCharacter={removeCharacter}
                  round={round}
                />
              </div>
            </div>
          );
        case 'notes':
          return (
            <div className="h-full flex flex-col pb-20">
              <div className="flex-grow">
                <NotesSection key={`notes-section-${activePage}-${isMobile}`} notes={notes} setNotes={(newNotes) => {
                  setNotes(newNotes);
                  logEvent(`Notes updated`);
                }} isMobile={true} />
              </div>
            </div>
          );
        case 'stats':
          return (
            <div className="h-full flex flex-col">
              <div className="flex-grow overflow-y-auto pb-20">
                <CharacterStats characters={characters} round={round} key={round} />
              </div>
            </div>
          );
        default:
          return null;
      }
    } else {
      return (
        <div className="flex flex-col lg:flex-row w-full h-full space-y-6 lg:space-y-0 lg:space-x-6">
          <div className="lg:w-2/3 h-full flex flex-col">
            <div className="bg-white border border-zinc-300 dark:border-zinc-700 rounded-lg flex flex-col overflow-hidden h-full shadow-md dark:shadow-none">
              <div className="p-4">
                <EncounterHeader
                  isRunning={isRunning}
                  toggleEncounter={toggleEncounter}
                  encounterTime={encounterTime}
                  round={round}
                />
              </div>
              <div className="flex-grow overflow-hidden" style={{ maxHeight: 'calc(100% - 88px)' }}>
                <div className="h-full overflow-y-auto px-4 pb-4">
                  <CharacterList 
                    characters={characters} 
                    setCharacters={setCharacters} 
                    activeCharacterIndex={activeCharacterIndex}
                    turnTime={turnTime}
                    onPreviousTurn={handlePreviousTurn}
                    onNextTurn={handleNextTurn}
                    setIsNumericInputActive={setIsNumericInputActive}
                    updateCharacter={updateCharacter}
                    addCharacter={addCharacter}
                    removeCharacter={removeCharacter}
                    round={round}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 h-full flex flex-col space-y-6">
            <div className="bg-white border border-zinc-300 dark:border-zinc-700 rounded-lg p-4 flex-1 overflow-hidden flex flex-col shadow-md dark:shadow-none">
              <div className="flex-grow">
                <NotesSection notes={notes} setNotes={(newNotes) => {
                  setNotes(newNotes);
                  logEvent(`Notes updated`);
                }} isMobile={false} />
              </div>
            </div>
            <div className="bg-white border border-zinc-300 dark:border-zinc-700 rounded-lg p-4 flex-1 overflow-hidden flex flex-col shadow-md dark:shadow-none">
              <h2 className="text-xl font-semibold mb-2">Character Stats</h2>
              <div className="flex-grow overflow-y-auto">
                <CharacterStats characters={characters} round={round} />
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-hidden">
        {renderContent()}
      </div>
      {isMobile && <MobileMenu activePage={activePage} setActivePage={setActivePage} onExport={exportEncounterData} />}
      {isMobile && <SwipeHandler onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} />}
    </div>
  );
});

export default EncounterTracker;