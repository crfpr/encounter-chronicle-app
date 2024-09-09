import React, { useCallback, useMemo } from 'react';
import { Input } from '../components/ui/input';
import TurnNavigator from './TurnNavigator';
import PlaceholderTurnNavigator from './PlaceholderTurnNavigator';
import CharacterNameType from './CharacterNameType';
import TokenInput from './TokenInput';
import { PlusCircle } from 'lucide-react';
import CharacterActions from './CharacterActions';
import HPSection from './HPSection';
import { Badge } from "../components/ui/badge";
import { Button } from '../components/ui/button';
import { useNumericInput } from '../hooks/useNumericInput';

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
  const [initiative, handleInitiativeChange, handleInitiativeKeyDown, setInitiative] = useNumericInput(character.initiative);
  const [ac, handleAcChange, handleAcKeyDown] = useNumericInput(character.ac);

  const handleAddToken = useCallback(() => {
    const newToken = { id: Date.now(), label: 'Token', tokenDuration: null, isPersistent: true };
    updateCharacter({ ...character, tokens: [...character.tokens, newToken] });
  }, [character, updateCharacter]);

  const handleRemoveToken = useCallback((tokenId) => {
    updateCharacter({ ...character, tokens: character.tokens.filter(token => token.id !== tokenId) });
  }, [character, updateCharacter]);

  const handleTokenChange = useCallback((tokenId, changes) => {
    updateCharacter({
      ...character,
      tokens: character.tokens.map(token => 
        token.id === tokenId ? { ...token, ...changes } : token
      )
    });
  }, [character, updateCharacter]);

  const handleInputChange = useCallback((field, value) => {
    updateCharacter({ ...character, [field]: value });
  }, [character, updateCharacter]);

  const handleInitiativeBlur = useCallback(() => {
    onInitiativeBlur(character.id, initiative);
  }, [character.id, initiative, onInitiativeBlur]);

  const handleInitiativeKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
      onInitiativeBlur(character.id, initiative);
    } else {
      handleInitiativeKeyDown(e);
    }
  }, [character.id, initiative, onInitiativeBlur, handleInitiativeKeyDown]);

  const getBorderStyle = useCallback(() => 
    isActive ? 'border-zinc-700 dark:border-zinc-700' : 'border-zinc-300 dark:border-zinc-700'
  , [isActive]);

  const getTabColor = useCallback(() => 
    isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'
  , [isActive]);

  const memoizedTokens = useMemo(() => character.tokens.map((token) => (
    <Badge
      key={token.id}
      className={`h-[30px] px-1 flex items-center space-x-1 ${
        isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100' : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
      } hover:text-white transition-colors`}
    >
      <TokenInput 
        token={token}
        onLabelChange={(newLabel) => handleTokenChange(token.id, { label: newLabel })}
        onDurationChange={(newDuration) => handleTokenChange(token.id, { tokenDuration: newDuration })}
        onRemove={() => handleRemoveToken(token.id)}
        onTogglePersistent={() => handleTokenChange(token.id, { isPersistent: !token.isPersistent })}
      />
    </Badge>
  )), [character.tokens, isActive, handleTokenChange, handleRemoveToken]);

  return (
    <div className={`flex bg-white dark:bg-zinc-950 relative overflow-hidden rounded-lg border ${getBorderStyle()} box-content transition-all duration-200 ease-in-out ${isMobile ? 'mx-0' : ''} min-h-[150px]`}>
      <div className={`w-[80px] flex-shrink-0 ${getTabColor()} border-r ${getBorderStyle()} flex flex-col items-center justify-between py-2 px-2 transition-colors duration-200`}>
        <div className="relative w-full">
          <Input
            type="text"
            inputMode="numeric"
            value={initiative}
            onChange={handleInitiativeChange}
            onKeyDown={handleInitiativeKeyDown}
            onFocus={() => setIsNumericInputActive(true)}
            onBlur={() => {
              setIsNumericInputActive(false);
              handleInitiativeBlur();
            }}
            className={`w-full text-center ${isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} h-[40px] border-zinc-300 dark:border-zinc-700 no-spinners text-sm overflow-visible`}
            maxLength={3}
          />
          {!initiative && (
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-zinc-500 dark:text-zinc-400">
              Initiative
            </span>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center mt-2 h-[90px]">
          {isActive ? (
            <TurnNavigator
              turnTime={turnTime}
              onPreviousTurn={onPreviousTurn}
              onNextTurn={onNextTurn}
            />
          ) : (
            <PlaceholderTurnNavigator />
          )}
        </div>
      </div>
      
      <div className={`flex-grow p-2 flex flex-col ${isMobile ? 'px-1' : ''}`}>
        <div className="flex-grow space-y-2">
          <div className="flex items-start space-x-2 relative">
            <div className="flex-grow flex items-start">
              <div className={`flex-grow ${isMobile ? 'w-[40vw]' : ''}`}>
                <CharacterNameType
                  name={character.name || 'New Character'}
                  type={character.type}
                  onUpdate={(newName, newType) => {
                    updateCharacter({ ...character, name: newName || 'New Character', type: newType });
                  }}
                  isMobile={isMobile}
                />
              </div>
              <div className="flex items-center ml-2 relative">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute pointer-events-none">
                  <path d="M20 2L4 8V20C4 30 20 38 20 38C20 38 36 30 36 20V8L20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={ac}
                  onChange={handleAcChange}
                  onKeyDown={handleAcKeyDown}
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

          {character.state === 'alive' && (
            <CharacterActions
              character={character}
              isActive={isActive}
              updateCharacter={updateCharacter}
              handleInputChange={handleInputChange}
              setIsNumericInputActive={setIsNumericInputActive}
              isMobile={isMobile}
            />
          )}

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

      <HPSection
        character={character}
        isActive={isActive}
        handleInputChange={handleInputChange}
        setIsNumericInputActive={setIsNumericInputActive}
        updateCharacter={updateCharacter}
        removeCharacter={removeCharacter}
      />
    </div>
  );
});

export default CharacterCard;