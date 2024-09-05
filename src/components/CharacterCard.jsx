import React, { useState, useCallback, useMemo } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Badge } from "../components/ui/badge";
import TurnNavigator from './TurnNavigator';
import CharacterNameType from './CharacterNameType';
import TokenInput from './TokenInput';
import CharacterStats from './CharacterStats';
import CharacterActions from './CharacterActions';
import { PlusCircle, X, Clock } from 'lucide-react';

const CharacterCard = React.memo(({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn, setIsNumericInputActive, onInitiativeBlur, onInitiativeSubmit, isMobile, round }) => {
  const [tokens, setTokens] = useState(character.tokens || []);
  const [newTokenId, setNewTokenId] = useState(null);
  const [activeDurationInput, setActiveDurationInput] = useState(null);

  const getBorderStyle = useCallback(() => {
    return isActive
      ? 'border-zinc-800 dark:border-zinc-800'
      : 'border-zinc-300 dark:border-zinc-800';
  }, [isActive]);

  const getTabColor = useCallback(() => {
    return isActive
      ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100'
      : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100';
  }, [isActive]);

  const handleInputChange = useCallback((field, value) => {
    if (field === 'initiative' || field === 'ac' || field === 'currentHp' || field === 'maxHp' || field === 'currentMovement' || field === 'maxMovement') {
      if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 999)) {
        updateCharacter({ ...character, [field]: value });
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

  const handleToggleAction = useCallback((value) => {
    const updatedCharacter = {
      ...character,
      action: value.includes('action'),
      bonusAction: value.includes('bonusAction'),
      reaction: value.includes('reaction')
    };
    updateCharacter(updatedCharacter);
  }, [character, updateCharacter]);

  const getToggleGroupItemStyle = useCallback((isActive, isToggled) => {
    return `h-[30px] px-2 text-xs border transition-colors ${
      isToggled
        ? isActive
          ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white'
          : 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white'
        : 'bg-white text-black hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800'
    } border-zinc-300 dark:border-zinc-800`;
  }, []);

  const handleAddToken = useCallback(() => {
    const newToken = { id: Date.now(), label: 'Token', tokenDuration: null, showDuration: false, isPersistent: true };
    const updatedTokens = [...tokens, newToken];
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
    setNewTokenId(newToken.id);
  }, [character, tokens, updateCharacter]);

  const handleRemoveToken = useCallback((tokenId) => {
    const updatedTokens = tokens.filter(token => token.id !== tokenId);
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  }, [character, tokens, updateCharacter]);

  const handleTokenDurationChange = useCallback((tokenId, newDuration) => {
    const updatedTokens = tokens.map(token => 
      token.id === tokenId ? { 
        ...token, 
        tokenDuration: newDuration === '' ? null : newDuration,
        isPersistent: newDuration === '' || newDuration === null
      } : token
    );
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  }, [character, tokens, updateCharacter]);

  const handleTokenLabelChange = useCallback((tokenId, newLabel) => {
    const updatedTokens = tokens.map(token => 
      token.id === tokenId ? { ...token, label: newLabel } : token
    );
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  }, [character, tokens, updateCharacter]);

  const toggleTokenDuration = useCallback((tokenId) => {
    const updatedTokens = tokens.map(token => {
      if (token.id === tokenId) {
        const newShowDuration = !token.showDuration;
        return {
          ...token,
          showDuration: newShowDuration,
          tokenDuration: newShowDuration ? '' : token.tokenDuration,
          isPersistent: newShowDuration ? true : token.isPersistent
        };
      }
      return token;
    });
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
    setActiveDurationInput(tokenId);
  }, [character, tokens, updateCharacter]);

  const handleTokenDurationBlur = useCallback((tokenId, value) => {
    if (value === '' || isNaN(value)) {
      const updatedTokens = tokens.map(token => 
        token.id === tokenId ? { ...token, showDuration: false, tokenDuration: null, isPersistent: true } : token
      );
      setTokens(updatedTokens);
      updateCharacter({ ...character, tokens: updatedTokens });
    }
    setActiveDurationInput(null);
  }, [character, tokens, updateCharacter]);

  const handleTokenFocus = useCallback(() => {
    setIsNumericInputActive(true);
  }, [setIsNumericInputActive]);

  const memoizedTokens = useMemo(() => tokens.map((token) => (
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
        isNew={token.id === newTokenId}
        onFocus={handleTokenFocus}
      />
      {token.showDuration ? (
        <Input
          type="number"
          value={token.tokenDuration || ''}
          onChange={(e) => handleTokenDurationChange(token.id, e.target.value)}
          onBlur={(e) => handleTokenDurationBlur(token.id, e.target.value)}
          onFocus={() => setIsNumericInputActive(true)}
          className="w-8 h-5 px-1 text-xs text-center bg-transparent border-none focus:outline-none focus:ring-0 no-spinners"
          min="1"
          placeholder=""
          autoFocus={token.id === activeDurationInput}
        />
      ) : (
        <Button
          onClick={() => toggleTokenDuration(token.id)}
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 hover:bg-zinc-700 dark:hover:bg-zinc-700 group"
        >
          <Clock className="h-3 w-3 group-hover:text-white" />
        </Button>
      )}
      <Button
        onClick={() => handleRemoveToken(token.id)}
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 hover:bg-zinc-700 dark:hover:bg-zinc-700"
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  )), [tokens, isActive, newTokenId, activeDurationInput, handleTokenLabelChange, handleTokenFocus, handleTokenDurationChange, handleTokenDurationBlur, toggleTokenDuration, handleRemoveToken, setIsNumericInputActive]);

  return (
    <div className={`flex bg-white dark:bg-zinc-950 relative overflow-hidden rounded-lg border ${getBorderStyle()} box-content transition-all duration-200 ease-in-out`}>
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
            className={`w-11 text-center ${isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} h-[40px] border-zinc-300 dark:border-zinc-800 no-spinners text-sm`}
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
      
      <div className="flex-grow p-2 flex flex-col">
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
              <CharacterStats
                character={character}
                handleInputChange={handleInputChange}
                handleNumericInputKeyDown={handleNumericInputKeyDown}
                setIsNumericInputActive={setIsNumericInputActive}
                isActive={isActive}
              />
            </div>
          </div>

          {/* Second row */}
          <CharacterActions
            character={character}
            handleToggleAction={handleToggleAction}
            handleInputChange={handleInputChange}
            handleNumericInputKeyDown={handleNumericInputKeyDown}
            setIsNumericInputActive={setIsNumericInputActive}
            isActive={isActive}
            isMobile={isMobile}
            getToggleGroupItemStyle={getToggleGroupItemStyle}
          />

          {/* New row for tokens and Add Token button */}
          <div className="flex items-center flex-wrap gap-2">
            {memoizedTokens}
            <Button
              onClick={handleAddToken}
              className="h-[30px] px-2 text-xs border transition-colors bg-white text-black hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800 border-zinc-300 dark:border-zinc-800"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add token
            </Button>
          </div>
        </div>

        {/* Delete button */}
        <div className="mt-auto self-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="link" 
                className="btn-sm text-xs text-zinc-700 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 whitespace-nowrap bg-transparent dark:bg-transparent p-0 h-auto flex items-end"
              >
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the character.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => removeCharacter(character.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
});

export default CharacterCard;