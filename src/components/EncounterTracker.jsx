import React, { useState, useEffect, useCallback, useRef } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import CharacterStats from './CharacterStats';
import NotesSection from './NotesSection';
import MobileMenu from './MobileMenu';
import SwipeHandler from './SwipeHandler';

const EncounterTracker = ({ encounterName, setEncounterName, exportEncounterData, uploadEncounterData, isMobile, contentHeight }) => {
  const [round, setRound] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [encounterTime, setEncounterTime] = useState(0);
  const [turnTime, setTurnTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState('');
  const [activePage, setActivePage] = useState('tracker');
  const characterListRef = useRef(null);
  const [isNumericInputActive, setIsNumericInputActive] = useState(false);

  const toggleEncounter = useCallback(() => {
    setIsRunning(prevIsRunning => !prevIsRunning);
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

  const resetCharacterActions = (characterIndex) => {
    setCharacters(prevCharacters => prevCharacters.map((char, index) => {
      if (index === characterIndex) {
        return {
          ...char,
          action: false,
          bonusAction: false,
          reaction: false,
          currentMovement: char.maxMovement
        };
      }
      return char;
    }));
  };

  const handlePreviousTurn = () => {
    setActiveCharacterIndex(prevIndex => {
      const newIndex = prevIndex === 0 ? characters.length - 1 : prevIndex - 1;
      resetCharacterActions(newIndex);
      return newIndex;
    });
    setTurnTime(0);
  };

  const handleNextTurn = () => {
    setActiveCharacterIndex(prevIndex => {
      const newIndex = prevIndex === characters.length - 1 ? 0 : prevIndex + 1;
      resetCharacterActions(newIndex);
      return newIndex;
    });

    setTurnTime(0);

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

    if (activeCharacterIndex === characters.length - 1) {
      setRound(prevRound => prevRound + 1);
    }
  };

  useEffect(() => {
    if (activeCharacterIndex === 0) {
      setCharacters(prevCharacters => prevCharacters.map(char => ({
        ...char,
        roundCount: (char.roundCount || 0) + 1
      })));
    }
  }, [round]);

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
  }, [isMobile, characters.length, isNumericInputActive]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isMobile && characterListRef.current) {
      const activeCard = characterListRef.current.querySelector(`[data-index="${activeCharacterIndex}"]`);
      if (activeCard) {
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeCharacterIndex, isMobile]);

  const renderContent = () => {
    if (isMobile) {
      const titleStyle = "text-xl font-semibold mb-4";
      
      switch (activePage) {
        case 'tracker':
          return (
            <div className="flex-grow overflow-hidden flex flex-col h-full">
              <h2 className={titleStyle}>Turn Tracker</h2>
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium">
                    Round {round}
                  </div>
                  <EncounterHeader
                    isRunning={isRunning}
                    toggleEncounter={toggleEncounter}
                    encounterTime={encounterTime}
                  />
                </div>
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
                />
              </div>
            </div>
          );
        case 'notes':
          return (
            <div className="h-full flex flex-col pb-20">
              <h2 className={titleStyle}>Notes</h2>
              <div className="flex-grow">
                <NotesSection key={`notes-section-${activePage}-${isMobile}`} notes={notes} setNotes={setNotes} isMobile={true} />
              </div>
            </div>
          );
        case 'stats':
          return (
            <div className="h-full flex flex-col">
              <h2 className={titleStyle}>Character Stats</h2>
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
            <div className="bg-white border border-black rounded-lg flex flex-col overflow-hidden h-full">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xl font-semibold">
                    Round {round}
                  </div>
                  <EncounterHeader
                    isRunning={isRunning}
                    toggleEncounter={toggleEncounter}
                    encounterTime={encounterTime}
                  />
                </div>
              </div>
              <div className="flex-grow overflow-hidden" style={{ maxHeight: 'calc(100% - 88px)' }}>
                <div ref={characterListRef} className="h-full overflow-y-auto px-4 pb-4">
                  <CharacterList 
                    characters={characters} 
                    setCharacters={setCharacters} 
                    activeCharacterIndex={activeCharacterIndex}
                    turnTime={turnTime}
                    onPreviousTurn={handlePreviousTurn}
                    onNextTurn={handleNextTurn}
                    setIsNumericInputActive={setIsNumericInputActive}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 h-full flex flex-col space-y-6">
            <div className="bg-white border border-black rounded-lg p-4 flex-1 overflow-hidden flex flex-col">
              <NotesSection notes={notes} setNotes={setNotes} isMobile={false} />
            </div>
            <div className="bg-white border border-black rounded-lg p-4 flex-1 overflow-hidden flex flex-col">
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
      {isMobile && <MobileMenu activePage={activePage} setActivePage={setActivePage} />}
      {isMobile && <SwipeHandler onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} />}
    </div>
  );
};

export default EncounterTracker;
