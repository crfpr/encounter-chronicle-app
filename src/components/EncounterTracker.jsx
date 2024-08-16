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

  // ... (keep all other functions and useEffects as they were)

  return (
    <div className="flex space-x-6">
      <div className="flex-grow space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6 relative">
          {/* Row 1: Header */}
          <EncounterHeader
            encounterName={encounterName}
            setEncounterName={setEncounterName}
            isRunning={isRunning}
            toggleEncounter={toggleEncounter}
            encounterTime={encounterTime}
          />
          
          {/* Row 2: Round */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-semibold flex items-center">
              Round {round}
              {showSparkles && <Sparkles />}
            </div>
          </div>
          
          {/* Row 3: Turn nav, time, and character cards */}
          <div className="flex">
            <div className="w-24 mr-2 flex flex-col items-start justify-start">
              <div className="text-sm font-semibold mb-2">
                Turn: {formatTime(turnTime)}
              </div>
              <Button onClick={handlePreviousTurn} variant="outline" size="sm" className="mb-2">
                Previous
              </Button>
              <Button onClick={handleNextTurn} variant="outline" size="sm">
                Next
              </Button>
            </div>
            <div className="flex-grow">
              <CharacterList 
                characters={characters} 
                setCharacters={setCharacters} 
                activeCharacterIndex={activeCharacterIndex}
                turnTime={turnTime}
                onNextTurn={handleNextTurn}
                onPreviousTurn={handlePreviousTurn}
              />
            </div>
          </div>
          
          {/* Row 4: Add Character Button */}
          <div className="mt-4">
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

// Helper function to format time
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default EncounterTracker;