import React, { useState, useEffect, useCallback, useRef } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import CharacterStats from './CharacterStats';
import NotesSection from './NotesSection';
import MobileMenu from './MobileMenu';
import SwipeHandler from './SwipeHandler';

const EncounterTracker = ({ 
  encounterName, 
  setEncounterName, 
  exportEncounterData, 
  uploadEncounterData, 
  isMobile, 
  contentHeight,
  characters,
  setCharacters,
  round,
  setRound,
  notes,
  setNotes
}) => {
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [encounterTime, setEncounterTime] = useState(0);
  const [turnTime, setTurnTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activePage, setActivePage] = useState('tracker');
  const characterListRef = useRef(null);

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

  const handlePreviousTurn = () => {
    setActiveCharacterIndex(prevIndex => 
      prevIndex === 0 ? characters.length - 1 : prevIndex - 1
    );
    setTurnTime(0);
  };

  const handleNextTurn = () => {
    setActiveCharacterIndex(prevIndex => 
      prevIndex === characters.length - 1 ? 0 : prevIndex + 1
    );
    setTurnTime(0);
    if (activeCharacterIndex === characters.length - 1) {
      setRound(prevRound => prevRound + 1);
    }
  };

  const handleSwipeLeft = () => {
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
  };

  const handleSwipeRight = () => {
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
  };

  const handleKeyDown = useCallback((e) => {
    if (characters.length > 1) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveCharacterIndex(prevIndex => 
          prevIndex === 0 ? characters.length - 1 : prevIndex - 1
        );
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveCharacterIndex(prevIndex => 
          prevIndex === characters.length - 1 ? 0 : prevIndex + 1
        );
      }
    }
  }, [characters.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (characterListRef.current) {
      const activeCard = characterListRef.current.querySelector(`[data-index="${activeCharacterIndex}"]`);
      if (activeCard) {
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeCharacterIndex]);

  const renderContent = () => {
    const titleStyle = "text-xl font-semibold mb-4 px-4 pt-4";
    
    switch (activePage) {
      case 'tracker':
        return (
          <div className="flex-grow overflow-hidden flex flex-col h-full">
            <h2 className={titleStyle}>Turn Tracker</h2>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
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
              />
            </div>
          </div>
        );
      case 'notes':
        return (
          <div className="h-full flex flex-col">
            <h2 className={titleStyle}>Notes</h2>
            <div className="flex-grow overflow-y-auto pb-20">
              <NotesSection key={`notes-section-${activePage}`} notes={notes} setNotes={setNotes} isMobile={true} />
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="h-full flex flex-col">
            <h2 className={titleStyle}>Character Stats</h2>
            <div className="flex-grow overflow-y-auto pb-20">
              <CharacterStats characters={characters} round={round} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ height: isMobile ? '100%' : contentHeight }}>
      <div className="flex-grow overflow-hidden">
        {renderContent()}
      </div>
      {isMobile && <MobileMenu activePage={activePage} setActivePage={setActivePage} />}
      {isMobile && <SwipeHandler onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} />}
    </div>
  );
};

export default EncounterTracker;