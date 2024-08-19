import React, { useState } from 'react';
import EncounterTracker from '../components/EncounterTracker';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Upload } from 'lucide-react';

const Index = () => {
  const [encounterName, setEncounterName] = useState('New Encounter');
  const [encounterData, setEncounterData] = useState(null);

  const exportEncounterData = () => {
    if (encounterData) {
      const blob = new Blob([JSON.stringify(encounterData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${encounterName.replace(/\s+/g, '_')}_data.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const uploadEncounterData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setEncounterData(data);
          setEncounterName(data.encounterName);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col h-screen">
        <header className="bg-black text-white py-4 h-16">
          <div className="container mx-auto px-4">
            <Input
              value={encounterName}
              onChange={(e) => setEncounterName(e.target.value)}
              className="text-2xl font-bold bg-transparent border-none text-white placeholder-gray-400 focus:outline-none focus:ring-0"
              placeholder="Enter encounter name..."
            />
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8 overflow-y-auto">
          <EncounterTracker 
            encounterName={encounterName} 
            setEncounterName={setEncounterName}
            exportEncounterData={exportEncounterData}
            uploadEncounterData={uploadEncounterData}
          />
        </main>
      </div>
      <footer className="bg-black text-white py-4 hidden md:block">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-center sm:text-left">&copy; 2023 Encounter Tracker. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button onClick={exportEncounterData} className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 w-full sm:w-auto">
              Export Encounter Data
            </Button>
            <Button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 w-full sm:w-auto">
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
      </footer>
    </div>
  );
};

export default Index;