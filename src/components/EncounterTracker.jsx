import React, { useState, useEffect } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import NotesSection from './NotesSection';

const EncounterTracker = () => {
  const [encounterName, setEncounterName] = useState('New Encounter');
  const [round, setRound] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [notes, setNotes] = useState('');
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);

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
      
      // Move the active character to the end of the list
      updatedCharacters.splice(activeCharacterIndex, 1);
      updatedCharacters.push(activeCharacter);

      // Reset the active character index
      setActiveCharacterIndex(0);

      // Check if we've completed a round
      if (activeCharacterIndex === updatedCharacters.length - 1) {
        setRound(prevRound => prevRound + 1);
        // Reset actions for all characters
        return updatedCharacters.map(char => ({
          ...char,
          action: false,
          bonusAction: false,
          movement: char.movement, // Keep the original movement value
          reaction: false
        }));
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

      return updatedCharacters;
    });
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