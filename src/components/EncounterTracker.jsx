import React, { useState, useEffect, useCallback } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import CharacterStats from './CharacterStats';
import NotesSection from './NotesSection';
import Sparkles from './Sparkles';
import { Button } from '../components/ui/button';

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
  const [history, setHistory] = useState([]);

  const toggleEncounter = () => {
    setIsRunning(prevIsRunning => !prevIsRunning);
  };

  const handlePreviousTurn = () => {
    setActiveCharacterIndex((prevIndex) => {
      if (prevIndex === 0) {
        // If at the start of the list, go to the last character and decrease the round
        setRound((prevRound) => Math.max(1, prevRound - 1));
        return characters.length - 1;
      }
      return prevIndex - 1;
    });
    setTurnTime(0);
  };

  const handleNextTurn = () => {
    setActiveCharacterIndex((prevIndex) => {
      if (prevIndex === characters.length - 1) {
        // If at the end of the list, go back to the first character and increase the round
        setRound((prevRound) => prevRound + 1);
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 2000);
        return 0;
      }
      return prevIndex + 1;
    });
    setTurnTime(0);
  };

  // ... (keep all the existing useEffect hooks and functions)

  const addCharacter = () => {
    const newCharacter = {
      id: Date.now(),
      initiative: 10,
      name: 'New Character',
      type: 'PC',
      currentHp: 10,
      maxHp: 10,
      ac: 10,
      action: false,
      bonusAction: false,
      currentMovement: 30,
      maxMovement: 30,
      reaction: false,
      conditions: []
    };
    setCharacters(prevCharacters => [...prevCharacters, newCharacter].sort((a, b) => b.initiative - a.initiative));
  };

  return (
    <div className="flex space-x-6 h-[calc(100vh-2rem)]">
      <div className="flex-grow space-y-6 flex flex-col h-full overflow-hidden">
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col h-full">
          <div className="sticky top-0 bg-white z-10 pb-4">
            <EncounterHeader
  encounterName={encounterName}
  setEncounterName={setEncounterName}
  isRunning={isRunning}
  toggleEncounter={toggleEncounter}
  encounterTime={encounterTime}
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
          </div>
          <div className="flex-grow overflow-y-auto">
            <CharacterList 
              characters={characters} 
              setCharacters={setCharacters} 
              activeCharacterIndex={activeCharacterIndex}
              turnTime={turnTime}
              onPreviousTurn={handlePreviousTurn}
              onNextTurn={handleNextTurn}
            />
          </div>
          <div className="sticky bottom-0 bg-white pt-4">
            <Button onClick={addCharacter} className="w-full bg-black hover:bg-gray-800 text-white">
              Add Character
            </Button>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <CharacterStats characters={characters} round={round} />
        </div>
        <div className="flex justify-center">
          <Button onClick={exportEncounterData} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Export Encounter Data
          </Button>
        </div>
      </div>
      <div className="w-1/3">
        <NotesSection notes={notes} setNotes={setNotes} />
      </div>
    </div>
  );
};

export default EncounterTracker;