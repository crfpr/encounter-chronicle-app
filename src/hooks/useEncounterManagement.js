import { useState, useCallback, useRef } from 'react';

export const useEncounterManagement = () => {
  const [encounterName, setEncounterName] = useState('New Encounter');
  const [encounterData, setEncounterData] = useState(null);
  const [autoSave, setAutoSave] = useState(false);
  const encounterTrackerRef = useRef(null);

  const exportEncounterData = useCallback(async (customFileName = null) => {
    if (encounterTrackerRef.current) {
      try {
        const data = encounterTrackerRef.current.getEncounterData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = customFileName || `${data.encounterName.replace(/\s+/g, '_')}_encounter.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('Encounter data exported successfully');
      } catch (error) {
        console.error('Error exporting encounter data:', error);
        throw error;
      }
    } else {
      console.error('encounterTrackerRef is not available');
      throw new Error('Encounter tracker reference is not available');
    }
  }, []);

  const exportPartyData = useCallback(async () => {
    if (encounterTrackerRef.current) {
      try {
        const data = encounterTrackerRef.current.getEncounterData();
        const partyData = {
          encounterName: data.encounterName,
          combatants: data.combatants
            .filter(combatant => combatant.type === 'PC')
            .map(combatant => ({
              combatantName: combatant.name,
              combatantType: combatant.type,
              combatantMaxMovement: combatant.maxMovement,
              combatantAC: combatant.ac,
              combatantMaxHP: combatant.maxHp
            }))
        };
        const blob = new Blob([JSON.stringify(partyData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.encounterName.replace(/\s+/g, '_')}_party.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('Party data exported successfully');
      } catch (error) {
        console.error('Error exporting party data:', error);
        throw error;
      }
    } else {
      console.error('encounterTrackerRef is not available');
      throw new Error('Encounter tracker reference is not available');
    }
  }, []);

  const uploadEncounterData = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.combatants && Array.isArray(data.combatants)) {
            const isPartyData = data.combatants.every(combatant => 
              'combatantName' in combatant && 'combatantType' in combatant
            );

            let processedData;
            if (isPartyData) {
              processedData = {
                encounterName: data.encounterName || 'Imported Party',
                combatants: data.combatants.map(combatant => ({
                  id: Date.now() + Math.random(),
                  name: combatant.combatantName,
                  type: combatant.combatantType,
                  maxMovement: combatant.combatantMaxMovement || 30,
                  currentMovement: combatant.combatantMaxMovement || 30,
                  ac: combatant.combatantAC || 10,
                  maxHp: combatant.combatantMaxHP || 10,
                  currentHp: combatant.combatantMaxHP || 10,
                  initiative: '',
                  action: false,
                  bonusAction: false,
                  reaction: false,
                  conditions: [],
                  tokens: [],
                  state: 'alive',
                  deathSaves: { successes: [], failures: [] },
                  turnCount: 0,
                  roundCount: 0,
                  cumulativeTurnTime: 0
                }))
              };
            } else {
              processedData = {
                ...data,
                combatants: data.combatants.map(combatant => ({
                  ...combatant,
                  id: combatant.id || Date.now() + Math.random(),
                  state: combatant.state || 'alive',
                  deathSaves: combatant.deathSaves || { successes: [], failures: [] },
                  turnCount: combatant.turnCount || 0,
                  roundCount: combatant.roundCount || 0,
                  cumulativeTurnTime: combatant.cumulativeTurnTime || 0,
                  tokens: combatant.tokens || [],
                  conditions: combatant.conditions || []
                }))
              };
            }

            setEncounterData(processedData);
            setEncounterName(processedData.encounterName);
            console.log('Encounter data loaded successfully:', processedData);
          } else {
            console.error('Invalid data format');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const toggleAutoSave = useCallback(() => {
    setAutoSave(prev => !prev);
  }, []);

  const autoSaveEncounter = useCallback((round, turnNumber) => {
    if (autoSave) {
      const fileName = `${encounterName.replace(/\s+/g, '_')}.r${round}.t${turnNumber}.json`;
      exportEncounterData(fileName);
    }
  }, [autoSave, encounterName, exportEncounterData]);

  return {
    encounterName,
    setEncounterName,
    encounterData,
    setEncounterData,
    exportEncounterData,
    exportPartyData,
    uploadEncounterData,
    encounterTrackerRef,
    autoSave,
    toggleAutoSave,
    autoSaveEncounter
  };
};