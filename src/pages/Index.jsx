import React, { useState, useEffect, useRef } from 'react';
import EncounterTracker from '../components/EncounterTracker';
import { Button } from '../components/ui/button';
import { Upload, Download, Sun, Moon } from 'lucide-react';
import { useEncounterManagement } from '../hooks/useEncounterManagement';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileMenuButton from '../components/MobileMenuButton';

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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      updateContentHeight();
    };
    window.addEventListener('resize', handleResize);
    updateContentHeight();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      localStorage.setItem('theme', 'dark');
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('light', !isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

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

  const renderMobileMenu = () => (
    isMobile && isMobileMenuOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] dark:bg-opacity-70">
        <div ref={mobileMenuRef} className={`fixed top-0 right-0 h-full w-64 shadow-lg ${isDarkMode ? 'bg-zinc-950' : 'bg-white'}`}>
          <div className={`flex items-center justify-between px-4 border-b ${isDarkMode ? 'border-zinc-700' : 'border-zinc-300'}`} style={{ height: '57px' }}>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>Menu</h2>
            <MobileMenuButton onClick={toggleMobileMenu} isOpen={true} />
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

  return (
    <div className={`flex flex-col ${isMobile ? 'h-screen' : ''} ${isDarkMode ? 'dark' : 'light'}`}>
      <Header
        encounterName={encounterName}
        setEncounterName={setEncounterName}
        isMobile={isMobile}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        toggleMobileMenu={toggleMobileMenu}
      />
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
      {!isMobile && (
        <Footer
          handleExportEncounterData={handleExportEncounterData}
          handleExportPartyData={handleExportPartyData}
          handleUploadEncounterData={handleUploadEncounterData}
        />
      )}
    </div>
  );
};

export default Index;