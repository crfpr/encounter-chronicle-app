import React, { useState, useEffect, useRef } from 'react';
import EncounterTracker from '../components/EncounterTracker';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Upload, Download, X } from 'lucide-react';
import MobileMenuButton from '../components/MobileMenuButton';

const Index = () => {
  const [encounterName, setEncounterName] = useState('New Encounter');
  const [encounterData, setEncounterData] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [contentHeight, setContentHeight] = useState('calc(100vh - 64px)');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      updateContentHeight();
    };
    window.addEventListener('resize', handleResize);
    updateContentHeight();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateContentHeight = () => {
    const headerHeight = document.querySelector('header').offsetHeight;
    const newHeight = `calc(100vh - ${headerHeight}px)`;
    setContentHeight(newHeight);
  };

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
    <div className="flex flex-col h-screen">
      <header className={`bg-black text-white py-2 ${isMobile ? 'fixed top-0 left-0 right-0 z-[9999]' : 'py-4'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Input
            value={encounterName}
            onChange={(e) => setEncounterName(e.target.value)}
            className={`font-bold bg-transparent border-none text-white placeholder-gray-400 focus:outline-none focus:ring-0 ${isMobile ? 'text-xl flex-grow mr-2' : 'text-2xl'}`}
            placeholder="Enter encounter name..."
          />
          {isMobile && <MobileMenuButton onClick={toggleMobileMenu} />}
        </div>
      </header>
      <main className={`flex-grow overflow-hidden ${isMobile ? 'pt-16' : ''}`} style={{ height: contentHeight }}>
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto px-4 py-8 h-full">
            <EncounterTracker 
              encounterName={encounterName} 
              setEncounterName={setEncounterName}
              exportEncounterData={exportEncounterData}
              uploadEncounterData={uploadEncounterData}
              isMobile={isMobile}
              contentHeight={contentHeight}
            />
          </div>
        </div>
      </main>
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000]">
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
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
              <Button onClick={handleUploadClick} className="w-full flex items-center justify-center">
                <Upload className="mr-2 h-4 w-4" />
                Load Encounter
              </Button>
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
      <footer className="bg-black text-white py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-center sm:text-left">&copy; 2023 Encounter Tracker. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button onClick={exportEncounterData} className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Save Encounter
            </Button>
            <Button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 w-full sm:w-auto">
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
    </div>
  );
};

export default Index;