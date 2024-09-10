import React from 'react';
import { Button } from '../components/ui/button';
import { Download, Upload } from 'lucide-react';

const Footer = ({ handleExportEncounterData, handleExportPartyData, handleUploadEncounterData }) => (
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
);

export default Footer;