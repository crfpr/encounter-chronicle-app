import React, { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import CharacterStats from './CharacterStats';
import NotesSection from './NotesSection';
import MobileMenu from './MobileMenu';
import SwipeHandler from './SwipeHandler';
import { useCharacterManagement } from '../hooks/useCharacterManagement';
import { useEncounterLogic } from '../hooks/useEncounterLogic';

const EncounterTracker = forwardRef(({ encounterName, setEncounterName, exportEncounterData, uploadEncounterData, isMobile, contentHeight, loadedEncounterData }, ref) => {
  const [notes, setNotes] = useState('');
  const [activePage, setActivePage] = useState('tracker');
  const [isNumericInputActive, setIsNumericInputActive] = useState(false);
  const trackerRef = useRef(null);
  const headerRef = useRef(null);
  const characterListRef = useRef(null);

  const {
    characters,
    setCharacters,
    addCharacter,
    removeCharacter,
    updateCharacter
  } = useCharacterManagement(loadedEncounterData);

  const {
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
  } = useEncounterLogic(characters, setCharacters);

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
      setActiveCharacterIndex(loadedEncounterData.activeCharacterIndex || 0);
      setEncounterTime(loadedEncounterData.encounterTime || 0);
      setNotes(loadedEncounterData.notes || '');
      setEncounterLog(loadedEncounterData.log || []);
      setEncounterName(loadedEncounterData.encounterName || 'New Encounter');
      setIsRunning(loadedEncounterData.isRunning || false);
      setCharacters(loadedEncounterData.characters || []);
      logEvent('Encounter data loaded');
    }
  }, [loadedEncounterData, setEncounterName, logEvent, setCharacters]);

  const handleSwipeLeft = useCallback(() => {
    if (isMobile) {
      setActivePage(prevPage => {
        switch (prevPage) {
          case 'tracker': return 'notes';
          case 'notes': return 'stats';
          default: return prevPage;
        }
      });
    }
  }, [isMobile]);

  const handleSwipeRight = useCallback(() => {
    if (isMobile) {
      setActivePage(prevPage => {
        switch (prevPage) {
          case 'notes': return 'tracker';
          case 'stats': return 'notes';
          default: return prevPage;
        }
      });
    }
  }, [isMobile]);

  const handleKeyDown = useCallback((e) => {
    if (!isMobile && characters.length > 1 && !isNumericInputActive) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (e.key === 'ArrowUp') {
          handlePreviousTurn();
        } else {
          handleNextTurn();
        }
      }
    }
  }, [isMobile, characters.length, isNumericInputActive, handlePreviousTurn, handleNextTurn]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const renderContent = () => {
    const commonProps = {
      characters,
      setCharacters,
      activeCharacterIndex,
      turnTime,
      onPreviousTurn: handlePreviousTurn,
      onNextTurn: handleNextTurn,
      setIsNumericInputActive,
      updateCharacter,
      addCharacter,
      removeCharacter,
      round,
      isMobile
    };

    if (isMobile) {
      switch (activePage) {
        case 'tracker':
          return (
            <div className="flex-grow overflow-hidden flex flex-col h-full">
              <div ref={headerRef} className="sticky top-0 z-10 bg-white dark:bg-zinc-950 mb-4 px-3">
                <EncounterHeader
                  isRunning={isRunning}
                  toggleEncounter={toggleEncounter}
                  encounterTime={encounterTime}
                  round={round}
                />
              </div>
              <div ref={trackerRef} className="flex-grow overflow-y-auto pb-20 px-3">
                <CharacterList ref={characterListRef} {...commonProps} />
              </div>
            </div>
          );
        case 'notes':
          return (
            <div className="h-full flex flex-col pb-20 px-3">
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
            <div className="h-full flex flex-col px-3">
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
              <div ref={headerRef} className="sticky top-0 z-10 bg-white dark:bg-zinc-950 p-4">
                <EncounterHeader
                  isRunning={isRunning}
                  toggleEncounter={toggleEncounter}
                  encounterTime={encounterTime}
                  round={round}
                />
              </div>
              <div ref={trackerRef} className="flex-grow overflow-hidden" style={{ maxHeight: 'calc(100% - 88px)' }}>
                <CharacterList ref={characterListRef} {...commonProps} />
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