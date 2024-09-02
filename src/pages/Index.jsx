import React, { useState, useEffect, useRef } from 'react';
import EncounterTracker from '../components/EncounterTracker';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Upload, Download, X } from 'lucide-react';
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

    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    document.body.classList.toggle('dark', isDarkMode);
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const updateContentHeight = () => {
    const header = document.querySelector('header');
    const newHeaderHeight = header.offsetHeight;
    setHeaderHeight(newHeaderHeight);
    const newHeight = `calc(100vh - ${newHeaderHeight}px)`;
    setContentHeight(newHeight);
  };

  const exportEncounterData = () => {
    console.log('Exporting encounter data');
    if (!encounterTrackerRef.current) {
      console.error('EncounterTracker ref is not available');
      return;
    }
    const data = encounterTrackerRef.current.getEncounterData();
    console.log('Encounter data:', data);
    if (!data) {
      console.error('No encounter data to export');
      return;
    }
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.encounterName.replace(/\s+/g, '_')}_data.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('Download triggered');
    } catch (error) {
      console.error('Error exporting encounter data:', error);
    }
    setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`flex flex-col ${isMobile ? 'h-screen' : ''} ${isDarkMode ? 'dark' : ''}`}>
      <header className={`bg-white dark:bg-black text-black dark:text-white py-2 ${isMobile ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-[9999]`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center flex-grow">
            <Input
              value={encounterName}
              onChange={(e) => setEncounterName(e.target.value)}
              className={`font-bold bg-transparent border-none text-black dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-0 ${isMobile ? 'text-xl flex-grow' : 'text-2xl'}`}
              placeholder="Enter encounter name..."
            />
          </div>
          <div className="flex items-center">
            {!isMobile && (
              <>
                <div className="w-4" />
                <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              </>
            )}
            {isMobile && <MobileMenuButton onClick={toggleMobileMenu} />}
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
              uploadEncounterData={uploadEncounterData}
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
            <div className="flex justify-between items-center p-4 border-b dark:border-zinc-700">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <Button onClick={() => {
                console.log('Save Encounter clicked');
                exportEncounterData();
              }} className="w-full flex items-center justify-center">
                <Download className="mr-2 h-4 w-4" />
                Save Encounter
              </Button>
              <Button onClick={handleUploadClick} className="w-full flex items-center justify-center">
                <Upload className="mr-2 h-4 w-4" />
                Load Encounter
              </Button>
              <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={uploadEncounterData}
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
              <Button onClick={() => {
                console.log('Save Encounter clicked');
                exportEncounterData();
              }} className="bg-white text-black px-4 py-2 rounded hover:bg-zinc-200 w-full sm:w-auto dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600">
                <Download className="mr-2 h-4 w-4" />
                Save Encounter
              </Button>
              <Button className="bg-white text-black px-4 py-2 rounded hover:bg-zinc-200 w-full sm:w-auto dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600">
                <label htmlFor="upload-encounter-data" className="cursor-pointer flex items-center justify-center w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Load Encounter
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
      )}
    </div>
  );
};

export default Index;