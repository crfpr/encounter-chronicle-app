import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import CharacterStats from './CharacterStats';
import NotesSection from './NotesSection';
import MobileMenu from './MobileMenu';
import SwipeHandler from './SwipeHandler';
import { useCharacterManagement } from '../hooks/useCharacterManagement';
import { useEncounterLogic } from '../hooks/useEncounterLogic';

const EncounterTracker = forwardRef(({ encounterName, setEncounterName, exportEncounterData, uploadEncounterData, isMobile, contentHeight, loadedEncounterData }, ref) => {
  const [notes, setNotes] = React.useState('');
  const [activePage, setActivePage] = React.useState('tracker');
  const [isNumericInputActive, setIsNumericInputActive] = React.useState(false);
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

  const handleSwipeLeft = React.useCallback(() => {
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

  const handleSwipeRight = React.useCallback(() => {
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

  const handleKeyDown = React.useCallback((e) => {
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

  const renderContent = () => {
    if (isMobile) {
      switch (activePage) {
        case 'tracker':
          return (
            <div className="flex-grow overflow-y-auto">
              <EncounterHeader
                isRunning={isRunning}
                toggleEncounter={toggleEncounter}
                encounterTime={encounterTime}
                round={round}
              />
              <CharacterList 
                ref={characterListRef}
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
                isMobile={isMobile}
              />
            </div>
          );
        case 'notes':
          return (
            <NotesSection 
              notes={notes} 
              setNotes={(newNotes) => {
                setNotes(newNotes);
                logEvent(`Notes updated`);
              }} 
              isMobile={true} 
            />
          );
        case 'stats':
          return (
            <CharacterStats characters={characters} round={round} key={round} />
          );
        default:
          return null;
      }
    } else {
      return (
        <div className="flex flex-col lg:flex-row w-full h-full space-y-6 lg:space-y-0 lg:space-x-6">
          <div className="lg:w-2/3 h-full flex flex-col">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg flex flex-col overflow-hidden h-full shadow-md dark:shadow-none">
              <EncounterHeader
                isRunning={isRunning}
                toggleEncounter={toggleEncounter}
                encounterTime={encounterTime}
                round={round}
              />
              <div className="flex-grow overflow-hidden">
                <CharacterList 
                  ref={characterListRef}
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
                  isMobile={isMobile}
                />
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 h-full flex flex-col space-y-6">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg p-4 flex-1 overflow-hidden flex flex-col shadow-md dark:shadow-none">
              <NotesSection 
                notes={notes} 
                setNotes={(newNotes) => {
                  setNotes(newNotes);
                  logEvent(`Notes updated`);
                }} 
                isMobile={false} 
              />
            </div>
            <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg p-4 flex-1 overflow-hidden flex flex-col shadow-md dark:shadow-none">
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