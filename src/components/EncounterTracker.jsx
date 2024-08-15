import React, { useState, useEffect } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import NotesSection from './NotesSection';
import { Button } from '../components/ui/button';

const EncounterTracker = () => {
  const [encounterName, setEncounterName] = useState('New Encounter');
  const [round, setRound] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [notes, setNotes] = useState('');
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [encounterTime, setEncounterTime] = useState(0);
  const [turnTime, setTurnTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let encounterInterval, turnInterval;
    if (isRunning) {
      encounterInterval = setInterval(() => {
        setEncounterTime(prevTime => prevTime + 1);
      }, 1000);
      turnInterval = setInterval(() => {
        setTurnTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      clearInterval(encounterInterval);
      clearInterval(turnInterval);
    };
  }, [isRunning]);

  useEffect(() => {
    // Sort characters by initiative when the component mounts or characters change
    setCharacters(prevCharacters => 
      [...prevCharacters].sort((a, b) => b.initiative - a.initiative)
    );
  }, []);

  const handleNextTurn = () => {
    setCharacters(prevCharacters => {
      const updatedCharacters = [...prevCharacters];
      const activeCharacter = updatedCharacters[activeCharacterIndex];
      
      // Reset actions for the active character
      activeCharacter.action = false;
      activeCharacter.bonusAction = false;
      activeCharacter.movement = activeCharacter.maxMovement;
      activeCharacter.reaction = false;

      // Move the active character to the end of the list
      updatedCharacters.splice(activeCharacterIndex, 1);
      updatedCharacters.push(activeCharacter);

      // Reset the active character index
      setActiveCharacterIndex(0);

      // Reset turn timer
      setTurnTime(0);

      // Check if we've completed a round
      if (activeCharacterIndex === updatedCharacters.length - 1) {
        setRound(prevRound => prevRound + 1);
      }

      return updatedCharacters;
    });
  };

  const handlePreviousTurn = () => {
    setCharacters(prevCharacters => {
      const updatedCharacters = [...prevCharacters];
      
      // Move the last character to the active position
      const lastCharacter = updatedCharacters.pop();
      updatedCharacters.unshift(lastCharacter);

      // Update the active character index
      setActiveCharacterIndex(prevIndex => 
        prevIndex === 0 ? updatedCharacters.length - 1 : prevIndex - 1
      );

      // Reset turn timer
      setTurnTime(0);

      return updatedCharacters;
    });
  };

  const toggleEncounter = () => {
    setIsRunning(prevState => !prevState);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <EncounterHeader
        encounterName={encounterName}
        setEncounterName={setEncounterName}
        round={round}
        onNextTurn={handleNextTurn}
        onPreviousTurn={handlePreviousTurn}
      />
      <div className="flex justify-between items-center mb-4">
        <Button onClick={toggleEncounter}>
          {isRunning ? 'Pause Encounter' : 'Start Encounter'}
        </Button>
        <div>Encounter Time: {formatTime(encounterTime)}</div>
        <div>Turn Time: {formatTime(turnTime)}</div>
      </div>
      <CharacterList 
        characters={characters} 
        setCharacters={setCharacters} 
        activeCharacterIndex={activeCharacterIndex}
      />
      <NotesSection notes={notes} setNotes={setNotes} />
    </div>
  );
};

export default EncounterTracker;