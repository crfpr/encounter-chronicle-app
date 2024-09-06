import React, { useCallback, useMemo } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from "../components/ui/badge";
import TurnNavigator from './TurnNavigator';
import CharacterNameType from './CharacterNameType';
import TokenInput from './TokenInput';
import { PlusCircle } from 'lucide-react';
import CharacterActions from './CharacterActions';
import HPSection from './HPSection';
import CharacterStateManager from './CharacterStateManager';

const CharacterCard = React.memo(({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn, setIsNumericInputActive, onInitiativeBlur, onInitiativeSubmit, isMobile, round }) => {
  const handleAddToken = useCallback(() => {
    const newToken = { id: Date.now(), label: 'Token', tokenDuration: null, isPersistent: true };
    const updatedTokens = [...character.tokens, newToken];
    updateCharacter({ ...character, tokens: updatedTokens });
  }, [character, updateCharacter]);

  const handleRemoveToken = useCallback((tokenId) => {
    const updatedTokens = character.tokens.filter(token => token.id !== tokenId);
    updateCharacter({ ...character, tokens: updatedTokens });
  }, [character, updateCharacter]);

  const handleTokenDurationChange = useCallback((tokenId, newDuration) => {
    const updatedTokens = character.tokens.map(token => 
      token.id === tokenId ? { ...token, tokenDuration: newDuration, isPersistent: newDuration === null } : token
    );
    updateCharacter({ ...character, tokens: updatedTokens });
  }, [character, updateCharacter]);

  const handleTokenLabelChange = useCallback((tokenId, newLabel) => {
    const updatedTokens = character.tokens.map(token => 
      token.id === tokenId ? { ...token, label: newLabel } : token
    );
    updateCharacter({ ...character, tokens: updatedTokens });
  }, [character, updateCharacter]);

  const handleTogglePersistent = useCallback((tokenId) => {
    const updatedTokens = character.tokens.map(token => {
      if (token.id === tokenId) {
        return {
          ...token,
          isPersistent: !token.isPersistent,
          tokenDuration: token.isPersistent ? 1 : null
        };
      }
      return token;
    });
    updateCharacter({ ...character, tokens: updatedTokens });
  }, [character, updateCharacter]);

  const handleInputChange = useCallback((field, value) => {
    if (field === 'initiative' || field === 'ac' || field === 'currentHp' || field === 'maxHp' || field === 'currentMovement' || field === 'maxMovement') {
      if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 999)) {
        let updatedCharacter = { ...character, [field]: value };
        
        if (field === 'currentHp') {
          const numericValue = Number(value);
          if (numericValue === 0 && character.state !== 'dead') {
            updatedCharacter.state = 'ko';
          } else if (numericValue > 0 && (character.state === 'ko' || character.state === 'dead' || (character.state === 'stable' && numericValue > 1))) {
            updatedCharacter.state = 'alive';
          }
        }
        
        updateCharacter(updatedCharacter);
      }
      return;
    }
    updateCharacter({ ...character, [field]: value });
  }, [character, updateCharacter]);

  const handleNumericInputKeyDown = useCallback((e, field, currentValue) => {
    if (!/[0-9]/.test(e.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputSubmit(field, currentValue);
      e.target.blur();
    }
  }, []);

  const handleInputSubmit = useCallback((field, value) => {
    setIsNumericInputActive(false);
    if (field === 'initiative') {
      onInitiativeSubmit(character.id, value);
    } else {
      handleInputChange(field, value);
    }
  }, [character.id, handleInputChange, onInitiativeSubmit, setIsNumericInputActive]);

  const handleInitiativeBlur = useCallback(() => {
    onInitiativeBlur(character.id, character.initiative);
  }, [character.id, character.initiative, onInitiativeBlur]);

  const getBorderStyle = useCallback(() => {
    return isActive
      ? 'border-zinc-700 dark:border-zinc-700'
      : 'border-zinc-300 dark:border-zinc-700';
  }, [isActive]);

  const getTabColor = useCallback(() => {
    return isActive
      ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100'
      : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100';
  }, [isActive]);

  const memoizedTokens = useMemo(() => character.tokens.map((token) => (
    <Badge
      key={token.id}
      className={`h-[30px] px-1 flex items-center space-x-1 ${
        isActive
          ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100'
          : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
      } hover:text-white transition-colors`}
    >
      <TokenInput 
        token={token}
        onLabelChange={handleTokenLabelChange}
        onDurationChange={handleTokenDurationChange}
        onRemove={handleRemoveToken}
        onTogglePersistent={handleTogglePersistent}
      />
    </Badge>
  )), [character.tokens, isActive, handleTokenLabelChange, handleTokenDurationChange, handleRemoveToken, handleTogglePersistent]);

  return (
    <div className={`flex bg-white dark:bg-zinc-950 relative overflow-hidden rounded-lg border ${getBorderStyle()} box-content transition-all duration-200 ease-in-out ${isMobile ? 'mx-0' : ''}`}>
      {/* Left Tab */}
      <div className={`w-18 flex-shrink-0 ${getTabColor()} border-r ${getBorderStyle()} flex flex-col items-center justify-between py-2 px-2 transition-colors duration-200`}>
        <div className="flex flex-col items-center">
          <Input
            type="text"
            inputMode="numeric"
            value={character.initiative}
            onChange={(e) => handleInputChange('initiative', e.target.value)}
            onKeyDown={(e) => handleNumericInputKeyDown(e, 'initiative', character.initiative)}
            onFocus={() => setIsNumericInputActive(true)}
            onBlur={() => {
              setIsNumericInputActive(false);
              handleInitiativeBlur();
            }}
            className={`w-11 text-center ${isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} h-[40px] border-zinc-300 dark:border-zinc-700 no-spinners text-sm`}
            maxLength={3}
          />
        </div>
        {isActive && (
          <div className="flex-1 flex items-center justify-center mt-2">
            <TurnNavigator
              turnTime={turnTime}
              onPreviousTurn={onPreviousTurn}
              onNextTurn={onNextTurn}
            />
          </div>
        )}
      </div>
      
      <div className={`flex-grow p-2 flex flex-col ${isMobile ? 'px-1' : ''}`}>
        <div className="flex-grow space-y-2">
          {/* First row */}
          <div className="flex items-start space-x-2 relative">
            <div className="flex-grow flex items-start">
              <div className="flex-grow">
                <CharacterNameType
                  name={character.name || 'New Character'}
                  type={character.type}
                  onUpdate={(newName, newType) => {
                    updateCharacter({ ...character, name: newName || 'New Character', type: newType });
                  }}
                />
              </div>
              <div className="flex items-center ml-2 relative">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute pointer-events-none">
                  <path d="M20 2L4 8V20C4 30 20 38 20 38C20 38 36 30 36 20V8L20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={character.ac}
                  onChange={(e) => handleInputChange('ac', e.target.value)}
                  onKeyDown={(e) => handleNumericInputKeyDown(e, 'ac', character.ac)}
                  onFocus={() => setIsNumericInputActive(true)}
                  onBlur={() => setIsNumericInputActive(false)}
                  className="w-[40px] h-[40px] text-center bg-transparent text-black dark:text-zinc-100 border-none focus:ring-0 text-sm"
                  maxLength={2}
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Second row */}
          {character.state === 'alive' && (
            <CharacterActions
              character={character}
              isActive={isActive}
              updateCharacter={updateCharacter}
              handleInputChange={handleInputChange}
              handleNumericInputKeyDown={handleNumericInputKeyDown}
              setIsNumericInputActive={setIsNumericInputActive}
              isMobile={isMobile}
            />
          )}

          {/* Death save trackers */}
          {character.state === 'ko' && (
            <div className="mt-1">
              <CharacterStateManager character={character} updateCharacter={updateCharacter} />
            </div>
          )}

          {/* New row for tokens and Add Token button */}
          <div className="flex items-center flex-wrap gap-2">
            {memoizedTokens}
            <Button
              onClick={handleAddToken}
              className={`h-[30px] px-2 text-xs border transition-colors bg-white text-black hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800 border-zinc-300 dark:border-zinc-700 ${isMobile ? 'text-[10px]' : ''}`}
            >
              <PlusCircle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
              Add token
            </Button>
          </div>
        </div>
      </div>

      {/* Right Tab */}
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