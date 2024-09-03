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
    }),
    getPartyData: () => ({
      partyName: encounterName,
      characters: characters.filter(char => char.type === 'PC').map(char => ({
        name: char.name,
        type: char.type,
        maxMovement: char.maxMovement,
        ac: char.ac,
        maxHp: char.maxHp
      }))
    })
  }));

  useEffect(() => {
    if (loadedEncounterData) {
      setCharacters(loadedEncounterData.characters || []);
      setRound(loadedEncounterData.round || 1);
      setEncounterTime(loadedEncounterData.encounterTime || 0);
      setNotes(loadedEncounterData.notes || '');
      setEncounterLog(loadedEncounterData.log || []);
      setActiveCharacterIndex(loadedEncounterData.activeCharacterIndex || 0);
      setIsRunning(loadedEncounterData.isRunning || false);
    }
  }, [loadedEncounterData]);

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

  const toggleEncounter = useCallback(() => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  }, []);

  const handleNextTurn = useCallback(() => {
    if (characters.length === 0) return;

    const currentCharacter = characters[activeCharacterIndex];
    const updatedCharacters = characters.map((char, index) => {
      if (index === activeCharacterIndex) {
        return {
          ...char,
          turnCount: (char.turnCount || 0) + 1,
          roundCount: (char.roundCount || 0) + 1,
          cumulativeTurnTime: (char.cumulativeTurnTime || 0) + turnTime,
          action: false,
          bonusAction: false,
          reaction: false,
          currentMovement: char.maxMovement,
        };
      }
      return char;
    });

    const newActiveIndex = (activeCharacterIndex + 1) % characters.length;
    const newRound = newActiveIndex === 0 ? round + 1 : round;

    setCharacters(updatedCharacters);
    setActiveCharacterIndex(newActiveIndex);
    setRound(newRound);
    setTurnTime(0);
    setLastResetIndex(activeCharacterIndex);

    const logEntry = `Round ${round}, Turn ${currentCharacter.turnCount + 1}: ${currentCharacter.name}'s turn ended`;
    setEncounterLog((prevLog) => [...prevLog, logEntry]);
  }, [characters, activeCharacterIndex, round, turnTime]);

  const handlePreviousTurn = useCallback(() => {
    if (characters.length === 0) return;

    let newActiveIndex = activeCharacterIndex - 1;
    if (newActiveIndex < 0) {
      newActiveIndex = characters.length - 1;
      setRound((prevRound) => Math.max(1, prevRound - 1));
    }

    setActiveCharacterIndex(newActiveIndex);
    setTurnTime(0);

    if (newActiveIndex !== lastResetIndex) {
      const updatedCharacters = characters.map((char, index) => {
        if (index === newActiveIndex) {
          return {
            ...char,
            turnCount: Math.max(0, (char.turnCount || 0) - 1),
            roundCount: Math.max(0, (char.roundCount || 0) - 1),
            cumulativeTurnTime: Math.max(0, (char.cumulativeTurnTime || 0) - turnTime),
          };
        }
        return char;
      });
      setCharacters(updatedCharacters);
    }

    setLastResetIndex(-1);
  }, [characters, activeCharacterIndex, lastResetIndex, turnTime]);

  const handleSwipeLeft = () => {
    if (activePage === 'tracker') setActivePage('notes');
    else if (activePage === 'notes') setActivePage('stats');
  };

  const handleSwipeRight = () => {
    if (activePage === 'stats') setActivePage('notes');
    else if (activePage === 'notes') setActivePage('tracker');
  };

  const renderContent = () => {
    switch (activePage) {
      case 'tracker':
        return (
          <>
            <EncounterHeader
              isRunning={isRunning}
              toggleEncounter={toggleEncounter}
              encounterTime={encounterTime}
              round={round}
            />
            <CharacterList
              characters={characters}
              setCharacters={setCharacters}
              activeCharacterIndex={activeCharacterIndex}
              turnTime={turnTime}
              onPreviousTurn={handlePreviousTurn}
              onNextTurn={handleNextTurn}
              setIsNumericInputActive={setIsNumericInputActive}
            />
          </>
        );
      case 'notes':
        return (
          <NotesSection
            notes={notes}
            setNotes={setNotes}
            isMobile={isMobile}
          />
        );
      case 'stats':
        return <CharacterStats characters={characters} round={round} />;
      default:
        return null;
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