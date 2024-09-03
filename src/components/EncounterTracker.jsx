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
    }
  }, [loadedEncounterData, setEncounterName]);

  useImperativeHandle(ref, () => ({
    getEncounterData: () => ({
      encounterName,
      round,
      characters,
      activeCharacterIndex,
      encounterTime,
      notes,
      log: encounterLog,
      isRunning
    })
  }));

  const logEvent = useCallback((event) => {
    setEncounterLog(prevLog => [...prevLog, { time: new Date().toISOString(), event }]);
  }, []);

  // Placeholder for other necessary functions
  const toggleEncounter = () => setIsRunning(!isRunning);
  const nextTurn = () => {
    // Implement next turn logic
  };
  const previousTurn = () => {
    // Implement previous turn logic
  };

  return (
    <div className="h-full flex flex-col">
      <EncounterHeader
        isRunning={isRunning}
        toggleEncounter={toggleEncounter}
        encounterTime={encounterTime}
        round={round}
      />
      <div className="flex-grow overflow-hidden">
        {activePage === 'tracker' && (
          <CharacterList
            characters={characters}
            setCharacters={setCharacters}
            activeCharacterIndex={activeCharacterIndex}
            turnTime={turnTime}
            onPreviousTurn={previousTurn}
            onNextTurn={nextTurn}
            setIsNumericInputActive={setIsNumericInputActive}
          />
        )}
        {activePage === 'notes' && (
          <NotesSection
            notes={notes}
            setNotes={setNotes}
            isMobile={isMobile}
          />
        )}
        {activePage === 'stats' && (
          <CharacterStats
            characters={characters}
            round={round}
          />
        )}
      </div>
      {isMobile && (
        <MobileMenu
          activePage={activePage}
          setActivePage={setActivePage}
        />
      )}
      <SwipeHandler
        onSwipeLeft={nextTurn}
        onSwipeRight={previousTurn}
      />
    </div>
  );
});

export default EncounterTracker;