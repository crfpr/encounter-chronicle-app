import React, { useCallback, useMemo } from 'react';
import { Input } from '../components/ui/input';
import TurnNavigator from './TurnNavigator';
import CharacterNameType from './CharacterNameType';
import TokenInput from './TokenInput';
import { PlusCircle } from 'lucide-react';
import CharacterActions from './CharacterActions';
import HPSection from './HPSection';
import CharacterStateManager from './CharacterStateManager';
import { Badge } from "../components/ui/badge";
import { Button } from '../components/ui/button';

const CharacterCard = React.memo(({ 
  character, 
  updateCharacter, 
  removeCharacter, 
  isActive, 
  turnTime, 
  onPreviousTurn, 
  onNextTurn, 
  setIsNumericInputActive, 
  onInitiativeBlur, 
  onInitiativeSubmit, 
  isMobile, 
  round 
}) => {
  // ... (keep existing functions)

  return (
    <div className={`flex bg-white dark:bg-zinc-950 relative overflow-hidden rounded-lg border ${getBorderStyle()} box-content transition-all duration-200 ease-in-out ${isMobile ? 'mx-0' : ''} h-[200px]`}>
      <div className={`w-18 flex-shrink-0 ${getTabColor()} border-r ${getBorderStyle()} flex flex-col items-center justify-between py-2 px-2 transition-colors duration-200`}>
        <Input
          type="text"
          inputMode="numeric"
          value={character.initiative}
          onChange={(e) => handleInputChange('initiative', e.target.value)}
          onKeyDown={(e) => handleNumericInputKeyDown(e, 'initiative', character.initiative)}
          onFocus={() => setIsNumericInputActive(true)}
          onBlur={() => {
            setIsNumericInputActive(false);
            onInitiativeBlur(character.id, character.initiative);
          }}
          className={`w-11 text-center ${isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} h-[40px] border-zinc-300 dark:border-zinc-700 no-spinners text-sm`}
          maxLength={3}
        />
        <div className="flex-1 flex items-center justify-center mt-2 h-[90px]">
          {isActive ? (
            <TurnNavigator
              turnTime={turnTime}
              onPreviousTurn={onPreviousTurn}
              onNextTurn={onNextTurn}
            />
          ) : (
            <div className="h-[90px]" />
          )}
        </div>
      </div>
      
      <div className={`flex-grow p-2 flex flex-col ${isMobile ? 'px-1' : ''} overflow-y-auto`}>
        {/* ... (keep existing content) */}
      </div>

      <HPSection
        character={character}
        isActive={isActive}
        handleInputChange={handleInputChange}
        handleNumericInputKeyDown={handleNumericInputKeyDown}
        setIsNumericInputActive={setIsNumericInputActive}
        updateCharacter={updateCharacter}
        removeCharacter={removeCharacter}
      />
    </div>
  );
});

export default CharacterCard;