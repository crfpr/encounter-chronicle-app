import React, { useState, useEffect, useRef } from 'react';
import EncounterTracker from '../components/EncounterTracker';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Upload, Download, X, Sun, Moon } from 'lucide-react';
import MobileMenuButton from '../components/MobileMenuButton';
import ThemeToggle from '../components/ThemeToggle';

const Index = () => {
  const [encounterName, setEncounterName] = useState('New Encounter');
  const [encounterData, setEncounterData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [contentHeight, setContentHeight] = useState('calc(100vh - 64px)');
  const [headerHeight, setHeaderHeight] = useState(64);
  const encounterTrackerRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      updateContentHeight();
    };

    window.addEventListener('resize', handleResize);
    updateContentHeight();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const updateContentHeight = () => {
    const header = document.querySelector('header');
    if (header) {
      const height = header.offsetHeight;
      setHeaderHeight(height);
      setContentHeight(`calc(100vh - ${height}px)`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const exportEncounterData = () => {
    if (!encounterTrackerRef.current) {
      console.error('EncounterTracker ref is not available');
      return;
    }
    const data = encounterTrackerRef.current.getEncounterData();
    if (!data) {
      console.error('No encounter data to export');
      return;
    }
    downloadJSON(data, `${data.encounterName.replace(/\s+/g, '_')}_encounter.json`);
    setIsMobileMenuOpen(false);
  };

  const exportPartyData = () => {
    if (!encounterTrackerRef.current) {
      console.error('EncounterTracker ref is not available');
      return;
    }
    const data = encounterTrackerRef.current.getPartyData();
    if (!data || data.characters.length === 0) {
      console.error('No party data to export');
      return;
    }
    downloadJSON(data, `${data.partyName.replace(/\s+/g, '_')}_party.json`);
    setIsMobileMenuOpen(false);
  };

  const downloadJSON = (data, filename) => {
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const uploadFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.characters) {
            if (data.round) {
              // This is an encounter file
              setEncounterData(data);
              setEncounterName(data.encounterName);
            } else {
              // This is a party file
              const newEncounterData = {
                encounterName: data.partyName,
                characters: data.characters.map(char => ({
                  ...char,
                  currentHp: char.maxHp,
                  currentMovement: char.maxMovement,
                  action: false,
                  bonusAction: false,
                  reaction: false,
                  initiative: '',
                  conditions: [],
                  tokens: []
                })),
                round: 1,
                encounterTime: 0,
                notes: '',
                log: [],
                activeCharacterIndex: 0,
                isRunning: false
              };
              setEncounterData(newEncounterData);
              setEncounterName(data.partyName);
            }
          } else {
            console.error('Invalid file format');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
    setIsMobileMenuOpen(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`flex flex-col ${isMobile ? 'h-screen' : ''} ${isDarkMode ? 'dark' : ''}`}>
      <header className="bg-white dark:bg-zinc-950 border-b border-zinc-300 dark:border-zinc-800 fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Input
            type="text"
            value={encounterName}
            onChange={(e) => setEncounterName(e.target.value)}
            className="text-lg font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 h-auto"
          />
          <div className="flex items-center space-x-2">
            {isMobile ? (
              <MobileMenuButton onClick={toggleMobileMenu} />
            ) : (
              <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            )}
          </div>
        </div>
      </header>
      <main className={`flex-grow overflow-hidden ${isMobile ? 'pt-16' : ''} bg-white dark:bg-zinc-950`} style={{ height: contentHeight }}>
        <div className={`h-full overflow-y-auto`}>
          <div className={`container mx-auto px-4 py-4 h-full`}>
            <EncounterTracker 
              ref={encounterTrackerRef}
              encounterName={encounterName} 
              setEncounterName={setEncounterName}
              exportEncounterData={exportEncounterData}
              uploadEncounterData={uploadFile}
              isMobile={isMobile}
              contentHeight={contentHeight}
              loadedEncounterData={encounterData}
            />
          </div>
        </div>
      </main>
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] dark:bg-opacity-70">
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg dark:bg-zinc-800 dark:text-white">
            <div className="flex justify-between items-center p-4 border-b border-zinc-300 dark:border-zinc-700">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <Button onClick={exportEncounterData} className="w-full flex items-center justify-center">
                <Download className="mr-2 h-4 w-4" />
                Save Encounter
              </Button>
              <Button onClick={exportPartyData} className="w-full flex items-center justify-center">
                <Download className="mr-2 h-4 w-4" />
                Save Party
              </Button>
              <Button onClick={handleUploadClick} className="w-full flex items-center justify-center">
                <Upload className="mr-2 h-4 w-4" />
                Load File
              </Button>
              <Button onClick={toggleTheme} className="w-full flex items-center justify-center">
                {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={uploadFile}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
      {!isMobile && (
        <footer className="bg-black text-white py-4 mt-auto">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-center sm:text-left">&copy; 2023 Encounter Tracker. All rights reserved.</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Button onClick={exportEncounterData} className="bg-white text-black px-4 py-2 rounded hover:bg-zinc-200 w-full sm:w-auto dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600">
                <Download className="mr-2 h-4 w-4" />
                Save Encounter
              </Button>
              <Button onClick={exportPartyData} className="bg-white text-black px-4 py-2 rounded hover:bg-zinc-200 w-full sm:w-auto dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600">
                <Download className="mr-2 h-4 w-4" />
                Save Party
              </Button>
              <Button className="bg-white text-black px-4 py-2 rounded hover:bg-zinc-200 w-full sm:w-auto dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600">
                <label htmlFor="upload-file" className="cursor-pointer flex items-center justify-center w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Load File
                </label>
                <input
                  id="upload-file"
                  type="file"
                  accept=".json"
                  onChange={uploadFile}
                  style={{ display: 'none' }}
                />
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;