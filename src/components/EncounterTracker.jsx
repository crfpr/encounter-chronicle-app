import React, { useState, useEffect } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import NotesSection from './NotesSection';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

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
  const [showNotes, setShowNotes] = useState(true);

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
        onNextTurn={handleNextTurn}
        onPreviousTurn={handlePreviousTurn}
        isRunning={isRunning}
        toggleEncounter={toggleEncounter}
      />
      <div className="flex justify-end items-center mb-4">
        <div>Encounter Time: {formatTime(encounterTime)}</div>
      </div>
      <div className="flex">
        <div className="flex-grow mr-4">
          <CharacterList 
            characters={characters} 
            setCharacters={setCharacters} 
            activeCharacterIndex={activeCharacterIndex}
            turnTime={turnTime}
          />
        </div>
        <div className="w-1/3 relative">
          <Button
            onClick={() => setShowNotes(!showNotes)}
            className="absolute -left-4 top-0 z-10"
            variant="outline"
            size="sm"
          >
            {showNotes ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
          <AnimatePresence>
            {showNotes && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <NotesSection notes={notes} setNotes={setNotes} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EncounterTracker;