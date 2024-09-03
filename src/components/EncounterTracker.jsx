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
      type: 'encounter',
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
      type: 'party',
      partyName: encounterName,
      characters: filterPCCharacters(),
    })
  }));

  const filterPCCharacters = () => {
    return characters.filter(character => character.type === 'PC');
  };

  useEffect(() => {
    if (loadedEncounterData) {
      setEncounterName(loadedEncounterData.encounterName);
      setCharacters(loadedEncounterData.characters);
      setRound(loadedEncounterData.round);
      setEncounterTime(loadedEncounterData.encounterTime);
      setNotes(loadedEncounterData.notes);
      setEncounterLog(loadedEncounterData.log || []);
      setActiveCharacterIndex(loadedEncounterData.activeCharacterIndex);
      setIsRunning(loadedEncounterData.isRunning);
    }
  }, [loadedEncounterData, setEncounterName]);

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
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleNextTurn = useCallback(() => {
    setActiveCharacterIndex(prevIndex => (prevIndex + 1) % characters.length);
    setTurnTime(0);
    setRound(prevRound => (activeCharacterIndex === characters.length - 1 ? prevRound + 1 : prevRound));
    
    setCharacters(prevCharacters => {
      const updatedCharacters = prevCharacters.map((char, index) => {
        if (index === activeCharacterIndex) {
          return {
            ...char,
            turnCount: (char.turnCount || 0) + 1,
            roundCount: (char.roundCount || 0) + 1,
            cumulativeTurnTime: (char.cumulativeTurnTime || 0) + turnTime
          };
        }
        return char;
      });
      return updatedCharacters;
    });

    setEncounterLog(prevLog => [
      ...prevLog,
      {
        type: 'turn',
        character: characters[activeCharacterIndex].name,
        round: round,
        time: encounterTime
      }
    ]);

    setLastResetIndex(-1);
  }, [activeCharacterIndex, characters, round, turnTime, encounterTime]);

  const handlePreviousTurn = useCallback(() => {
    if (activeCharacterIndex === 0 && round > 1) {
      setActiveCharacterIndex(characters.length - 1);
      setRound(prevRound => prevRound - 1);
    } else {
      setActiveCharacterIndex(prevIndex => (prevIndex - 1 + characters.length) % characters.length);
    }
    setTurnTime(0);
    setLastResetIndex(activeCharacterIndex);
  }, [activeCharacterIndex, characters.length, round]);

  const handleSwipeLeft = () => {
    if (!isNumericInputActive) {
      handleNextTurn();
    }
  };

  const handleSwipeRight = () => {
    if (!isNumericInputActive) {
      handlePreviousTurn();
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'tracker':
        return (
          <div className="h-full flex flex-col">
            <EncounterHeader
              isRunning={isRunning}
              toggleEncounter={toggleEncounter}
              encounterTime={encounterTime}
              round={round}
            />
            <div className="flex-grow overflow-y-auto">
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
        return <NotesSection notes={notes} setNotes={setNotes} isMobile={isMobile} />;
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