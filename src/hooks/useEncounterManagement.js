import { useState, useCallback } from 'react';

export const useEncounterManagement = () => {
  const [encounterName, setEncounterName] = useState('New Encounter');
  const [encounterData, setEncounterData] = useState(null);

  const exportEncounterData = useCallback(() => {
    // Implementation remains the same
  }, []);

  const exportPartyData = useCallback(() => {
    // Implementation remains the same
  }, []);

  const uploadEncounterData = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.characters && Array.isArray(data.characters)) {
            const isPartyData = data.characters.every(char => 
              'characterName' in char && 'characterType' in char
            );

            let processedData;
            if (isPartyData) {
              processedData = {
                encounterName: data.encounterName || 'Imported Party',
                characters: data.characters.map(char => ({
                  id: Date.now() + Math.random(),
                  name: char.characterName,
                  type: char.characterType,
                  maxMovement: char.characterMaxMovement,
                  currentMovement: char.characterMaxMovement,
                  ac: char.characterAC,
                  maxHp: char.characterMaxHP,
                  currentHp: char.characterMaxHP,
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
                characters: data.characters.map(char => ({
                  ...char,
                  state: char.state || 'alive',
                  deathSaves: char.deathSaves || { successes: [], failures: [] },
                  turnCount: char.turnCount || 0,
                  roundCount: char.roundCount || 0,
                  cumulativeTurnTime: char.cumulativeTurnTime || 0
                }))
              };
            }

            setEncounterData(processedData);
            setEncounterName(processedData.encounterName);
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

  return {
    encounterName,
    setEncounterName,
    encounterData,
    setEncounterData,
    exportEncounterData,
    exportPartyData,
    uploadEncounterData
  };
};