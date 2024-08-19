import React, { useState, useEffect, useCallback } from 'react';
import EncounterHeader from './EncounterHeader';
import CharacterList from './CharacterList';
import CharacterStats from './CharacterStats';
import NotesSection from './NotesSection';
import { Button } from '../components/ui/button';
import { Upload } from 'lucide-react';

const EncounterTracker = ({ encounterName, setEncounterName }) => {
  const [round, setRound] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
  const [encounterTime, setEncounterTime] = useState(0);
  const [turnTime, setTurnTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [roundStates, setRoundStates] = useState([]);
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState([]);

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
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handlePreviousTurn = () => {
    setActiveCharacterIndex(prevIndex => 
      prevIndex === 0 ? characters.length - 1 : prevIndex - 1
    );
    setTurnTime(0);
  };

  const handleNextTurn = () => {
    setActiveCharacterIndex(prevIndex => 
      prevIndex === characters.length - 1 ? 0 : prevIndex + 1
    );
    setTurnTime(0);
    if (activeCharacterIndex === characters.length - 1) {
      setRound(prevRound => prevRound + 1);
    }
  };

  const exportEncounterData = () => {
    const data = {
      encounterName,
      round,
      characters,
      encounterTime,
      notes,
      history
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${encounterName.replace(/\s+/g, '_')}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uploadEncounterData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setEncounterName(data.encounterName);
          setRound(data.round);
          setCharacters(data.characters);
          setEncounterTime(data.encounterTime);
          setNotes(data.notes);
          setHistory(data.history);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
        <div className="flex-grow lg:w-2/3 overflow-hidden flex flex-col">
          <div className="bg-white border border-black rounded-lg flex flex-col h-full overflow-hidden">
            <div className="p-6">
              <EncounterHeader
                isRunning={isRunning}
                toggleEncounter={toggleEncounter}
                encounterTime={encounterTime}
              />
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-semibold">
                  Round {round}
                </div>
              </div>
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="h-full overflow-y-auto px-6">
                <CharacterList 
                  characters={characters} 
                  setCharacters={setCharacters} 
                  activeCharacterIndex={activeCharacterIndex}
                  turnTime={turnTime}
                  onPreviousTurn={handlePreviousTurn}
                  onNextTurn={handleNextTurn}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 overflow-y-auto p-6 space-y-6">
          <NotesSection notes={notes} setNotes={setNotes} />
          <div className="bg-white border border-black rounded-lg p-6">
            <CharacterStats characters={characters} round={round} />
          </div>
        </div>
      </div>
      <div className="p-4 bg-black text-white">
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button onClick={exportEncounterData} className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Export Encounter Data
          </Button>
          <Button className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            <label htmlFor="upload-encounter-data" className="cursor-pointer flex items-center justify-center w-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload Encounter Data
            </label>
            <input
              id="upload-encounter-data"
              type="file"
              accept=".json"
              onChange={uploadEncounterData}
              style={{ display: 'none' }}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EncounterTracker;