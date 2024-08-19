import React, { useState, useEffect, useCallback } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import CharacterStats from './CharacterStats';
import NotesSection from './NotesSection';
import MobileMenu from './MobileMenu';
import SwipeHandler from './SwipeHandler';

const EncounterTracker = ({ encounterName, setEncounterName, exportEncounterData, uploadEncounterData }) => {
  const [round, setRound] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [encounterTime, setEncounterTime] = useState(0);
  const [turnTime, setTurnTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState('');
  const [activePage, setActivePage] = useState('tracker');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const renderContent = () => {
    if (isMobile) {
      switch (activePage) {
        case 'tracker':
          return (
            <div className="flex-grow overflow-hidden flex flex-col h-full">
              <div className="p-4">
                <EncounterHeader
                  isRunning={isRunning}
                  toggleEncounter={toggleEncounter}
                  encounterTime={encounterTime}
                />
                <div className="text-xl font-semibold mb-4">
                  Round {round}
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
              <NotesSection notes={notes} setNotes={setNotes} isMobile={true} />
            </div>
          );
        case 'stats':
          return (
            <div className="h-full overflow-y-auto pb-20">
              <CharacterStats characters={characters} round={round} />
            </div>
          );
        default:
          return null;
      }
    } else {
      return (
        <>
          <div className="flex-grow w-full md:w-full lg:w-2/3 overflow-hidden flex flex-col md:mr-6 mb-6 md:mb-0">
            <div className="bg-white border border-black rounded-lg flex flex-col h-full overflow-hidden">
              <div className="p-4 sm:p-6">
                <EncounterHeader
                  isRunning={isRunning}
                  toggleEncounter={toggleEncounter}
                  encounterTime={encounterTime}
                />
                <div className="flex justify-between items-center mb-4">
                  <div className="text-xl font-semibold">
                    Round {round}
                  </div>
                </div>
              </div>
              <div className="flex-grow overflow-hidden">
                <div className="h-full overflow-y-auto px-4 sm:px-6 pb-6">
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
            </div>
          </div>
          <div className="md:w-full lg:w-1/3 overflow-y-auto pt-0 space-y-6 flex flex-col">
            <div className="flex-grow overflow-y-auto space-y-6">
              <div className="mb-6">
                <NotesSection notes={notes} setNotes={setNotes} isMobile={false} />
              </div>
              <div className="bg-white border border-black rounded-lg p-4 sm:p-6">
                <CharacterStats characters={characters} round={round} />
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        {renderContent()}
      </div>
      {isMobile && <MobileMenu activePage={activePage} setActivePage={setActivePage} />}
      {isMobile && <SwipeHandler onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} />}
    </div>
  );
};

export default EncounterTracker;