import React, { useState, useEffect } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import NotesSection from './NotesSection';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const EncounterTracker = () => {
  const [encounterName, setEncounterName] = useState('New Encounter');
  const [round, setRound] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [notes, setNotes] = useState('');
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [encounterTime, setEncounterTime] = useState(0);
  const [turnTime, setTurnTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showNewRoundModal, setShowNewRoundModal] = useState(false);

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

  const handleNextTurn = () => {
    if (characters.length === 0) return;

    setTurnTime(0);
    setActiveCharacterIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % characters.length;
      if (nextIndex === 0) {
        setRound((prevRound) => prevRound + 1);
        setShowNewRoundModal(true);
      }
      return nextIndex;
    });
  };

  const handlePreviousTurn = () => {
    if (characters.length === 0) return;

    setTurnTime(0);
    setActiveCharacterIndex((prevIndex) => {
      const nextIndex = (prevIndex - 1 + characters.length) % characters.length;
      if (prevIndex === 0) {
        setRound((prevRound) => Math.max(1, prevRound - 1));
      }
      return nextIndex;
    });
  };

  const toggleEncounter = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 relative">
      <AnimatePresence>
        {showNewRoundModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white rounded-lg p-8 relative">
              <button
                onClick={() => setShowNewRoundModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">New Round!</h2>
              <p className="text-lg mb-4">Don't forget any environmental actions!</p>
              <Button onClick={() => setShowNewRoundModal(false)}>Close</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <EncounterHeader
        encounterName={encounterName}
        setEncounterName={setEncounterName}
        round={round}
        isRunning={isRunning}
        toggleEncounter={toggleEncounter}
      />
      <div className="flex justify-end items-center mb-4">
        <div>Encounter Time: {formatTime(encounterTime)}</div>
      </div>
      <CharacterList 
        characters={characters} 
        setCharacters={setCharacters} 
        activeCharacterIndex={activeCharacterIndex}
        turnTime={turnTime}
        onNextTurn={handleNextTurn}
        onPreviousTurn={handlePreviousTurn}
      />
      <NotesSection notes={notes} setNotes={setNotes} />
    </div>
  );
};

export default EncounterTracker;