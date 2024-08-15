import React, { useState } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import NotesSection from './NotesSection';

const EncounterTracker = () => {
  const [encounterName, setEncounterName] = useState('New Encounter');
  const [round, setRound] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [notes, setNotes] = useState('');

  const handleNextTurn = () => {
    // Implement turn advancement logic
  };

  const handlePreviousTurn = () => {
    // Implement turn reversal logic
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
      <CharacterList characters={characters} setCharacters={setCharacters} />
      <NotesSection notes={notes} setNotes={setNotes} />
    </div>
  );
};

export default EncounterTracker;