import React, { useState, useEffect, useRef } from 'react';
import EncounterTracker from '../components/EncounterTracker';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Upload, Download, X, Sun, Moon } from 'lucide-react';
import MobileMenuButton from '../components/MobileMenuButton';
import ThemeToggle from '../components/ThemeToggle';
import { useEncounterManagement } from '../hooks/useEncounterManagement';

const Index = () => {
  const {
    encounterName,
    setEncounterName,
    encounterData,
    exportEncounterData,
    exportPartyData,
    uploadEncounterData,
    encounterTrackerRef
  } = useEncounterManagement();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [contentHeight, setContentHeight] = useState('calc(100vh - 64px)');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      updateContentHeight();
    };
    window.addEventListener('resize', handleResize);
    updateContentHeight();

    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('light', !isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const updateContentHeight = () => {
    const header = document.querySelector('header');
    const newHeaderHeight = header ? header.offsetHeight : 64;
    setContentHeight(`calc(100vh - ${newHeaderHeight}px)`);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleUploadClick = () => fileInputRef.current.click();

  const handleExportEncounterData = async () => {
    try {
      await exportEncounterData();
      console.log('Encounter data exported successfully');
    } catch (error) {
      console.error('Error exporting encounter data:', error);
    }
  };

  const handleExportPartyData = async () => {
    try {
      await exportPartyData();
      console.log('Party data exported successfully');
    } catch (error) {
      console.error('Error exporting party data:', error);
    }
  };

  const handleUploadEncounterData = (event) => {
    uploadEncounterData(event);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderHeader = () => (
    <header className={`py-2 ${isMobile ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-[9999] border-b border-zinc-300 dark:border-zinc-700`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center flex-grow">
          <Input
            value={encounterName}
            onChange={(e) => setEncounterName(e.target.value)}
            className={`font-bold bg-transparent border-none placeholder-zinc-400 focus:outline-none focus:ring-0 ${isMobile ? 'text-xl flex-grow' : 'text-2xl'}`}
            placeholder="Enter encounter name..."
          />
        </div>
        <div className="flex items-center">
          {!isMobile && <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
          {isMobile && <MobileMenuButton onClick={toggleMobileMenu} />}
        </div>
      </div>
    </header>
  );

  const renderMobileMenu = () => (
    isMobile && isMobileMenuOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] dark:bg-opacity-70">
        <div className="fixed top-0 right-0 h-full w-64 shadow-lg">
          <div className="flex justify-between items-center p-4 border-b border-zinc-300 dark:border-zinc-700">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="p-4 space-y-4">
            <Button onClick={handleExportEncounterData} className="w-full flex items-center justify-center">
              <Download className="mr-2 h-4 w-4" />
              Save Encounter
            </Button>
            <Button onClick={handleExportPartyData} className="w-full flex items-center justify-center">
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
              onChange={handleUploadEncounterData}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>
    )
  );

  const renderFooter = () => (
    !isMobile && (
      <footer className="py-2 mt-auto border-t border-zinc-300 dark:border-zinc-700">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p className="text-center sm:text-left text-xs">
            Encounter Chronicle - <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">CC BY-NC-SA 4.0</a>, 2024.<br />
            Made by Fieldhouse & <a href="https://gptengineer.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">GPT-Engineer</a>.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button onClick={handleExportEncounterData} className="px-4 py-2 rounded w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Save Encounter
            </Button>
            <Button onClick={handleExportPartyData} className="px-4 py-2 rounded w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Save Party
            </Button>
            <Button className="px-4 py-2 rounded w-full sm:w-auto">
              <label htmlFor="upload-encounter-data" className="cursor-pointer flex items-center justify-center w-full">
                <Upload className="mr-2 h-4 w-4" />
                Load File
              </label>
              <input
                id="upload-encounter-data"
                type="file"
                accept=".json"
                onChange={handleUploadEncounterData}
                style={{ display: 'none' }}
              />
            </Button>
          </div>
        </div>
      </footer>
    )
  );

  return (
    <div className={`flex flex-col ${isMobile ? 'h-screen' : ''} ${isDarkMode ? 'dark' : 'light'}`}>
      {renderHeader()}
      <main className={`flex-grow overflow-hidden ${isMobile ? 'pt-16' : ''}`} style={{ height: contentHeight }}>
        <div className={`h-full overflow-y-auto ${isMobile ? 'px-0 sm:px-2' : 'px-4'}`}>
          <div className={`container mx-auto ${isMobile ? 'px-0' : 'px-4'} py-4 h-full`}>
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
      {renderMobileMenu()}
      {renderFooter()}
    </div>
  );
};

export default Index;