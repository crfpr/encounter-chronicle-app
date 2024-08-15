import React, { useState, useEffect } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import NotesSection from './NotesSection';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const EncounterTracker = () => {
  const [encounterName, setEncounterName] = useState('New Encounter');
  const [round, setRound] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [notes, setNotes] = useState('');
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [encounterTime, setEncounterTime] = useState(0);
  const [turnTime, setTurnTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showFlameAnimation, setShowFlameAnimation] = useState(false);

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
        setRound((prevRound) => {
          setShowFlameAnimation(true);
          setTimeout(() => setShowFlameAnimation(false), 1000);
          return prevRound + 1;
        });
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
      <EncounterHeader
        encounterName={encounterName}
        setEncounterName={setEncounterName}
        isRunning={isRunning}
        toggleEncounter={toggleEncounter}
      />
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold flex items-center">
          Round {round}
          {showFlameAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="ml-2"
            >
              <Flame className="text-orange-500" size={24} />
            </motion.div>
          )}
        </div>
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