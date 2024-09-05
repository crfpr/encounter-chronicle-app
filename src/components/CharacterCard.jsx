import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { Badge } from "../components/ui/badge";
import TurnNavigator from './TurnNavigator';
import CharacterNameType from './CharacterNameType';
import TokenInput from './TokenInput';
import { PlusCircle, X, Clock } from 'lucide-react';
import ShieldIcon from './ShieldIcon';

const CharacterCard = React.memo(({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn, setIsNumericInputActive, onInitiativeBlur, onInitiativeSubmit, isMobile, round }) => {
  const [tokens, setTokens] = useState(character.tokens || []);
  const [newTokenId, setNewTokenId] = useState(null);
  const [activeDurationInput, setActiveDurationInput] = useState(null);

  useEffect(() => {
    setTokens(character.tokens || []);
  }, [character.tokens]);

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
      <div className={`w-full flex flex-col`}>
        <div className={`flex items-center justify-between p-2 ${getTabColor()}`}>
          <CharacterNameType
            name={character.name}
            type={character.type}
            onUpdate={(name, type) => updateCharacter({ ...character, name, type })}
          />
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={character.initiative}
              onChange={(e) => handleInputChange('initiative', e.target.value)}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'initiative', character.initiative)}
              onBlur={handleInitiativeBlur}
              onFocus={() => setIsNumericInputActive(true)}
              className="w-12 h-[30px] text-center bg-white text-black dark:bg-zinc-950 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 no-spinners"
              placeholder="Init"
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-[30px] w-[30px] p-0">
                  <X className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to remove this character?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the character from the encounter.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => removeCharacter(character.id)}>
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="flex flex-wrap items-center p-2 space-x-2 space-y-2">
          <div className="flex items-center space-x-2 mt-2">
            <Input
              type="number"
              value={character.currentHp}
              onChange={(e) => handleInputChange('currentHp', e.target.value)}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentHp', character.currentHp)}
              onFocus={() => setIsNumericInputActive(true)}
              className="w-12 h-[30px] text-center bg-white text-black dark:bg-zinc-950 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 no-spinners"
              placeholder="HP"
            />
            <span>/</span>
            <Input
              type="number"
              value={character.maxHp}
              onChange={(e) => handleInputChange('maxHp', e.target.value)}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxHp', character.maxHp)}
              onFocus={() => setIsNumericInputActive(true)}
              className="w-12 h-[30px] text-center bg-white text-black dark:bg-zinc-950 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 no-spinners"
              placeholder="Max"
            />
          </div>
          <div className="flex items-center space-x-1">
            <ShieldIcon className="w-5 h-5" />
            <Input
              type="number"
              value={character.ac}
              onChange={(e) => handleInputChange('ac', e.target.value)}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'ac', character.ac)}
              onFocus={() => setIsNumericInputActive(true)}
              className="w-12 h-[30px] text-center bg-white text-black dark:bg-zinc-950 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 no-spinners"
              placeholder="AC"
            />
          </div>
          <div className="flex items-center space-x-1">
            <Input
              type="number"
              value={character.currentMovement}
              onChange={(e) => handleInputChange('currentMovement', e.target.value)}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentMovement', character.currentMovement)}
              onFocus={() => setIsNumericInputActive(true)}
              className="w-12 h-[30px] text-center bg-white text-black dark:bg-zinc-950 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 no-spinners"
              placeholder="Move"
            />
            <span>/</span>
            <Input
              type="number"
              value={character.maxMovement}
              onChange={(e) => handleInputChange('maxMovement', e.target.value)}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxMovement', character.maxMovement)}
              onFocus={() => setIsNumericInputActive(true)}
              className="w-12 h-[30px] text-center bg-white text-black dark:bg-zinc-950 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 no-spinners"
              placeholder="Max"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center p-2 space-x-2 space-y-2">
          <ToggleGroup type="multiple" className="flex flex-wrap gap-1 mt-2" onValueChange={handleToggleAction}>
            <ToggleGroupItem value="action" className={getToggleGroupItemStyle(isActive, character.action)}>
              Action
            </ToggleGroupItem>
            <ToggleGroupItem value="bonusAction" className={getToggleGroupItemStyle(isActive, character.bonusAction)}>
              Bonus
            </ToggleGroupItem>
            <ToggleGroupItem value="reaction" className={getToggleGroupItemStyle(isActive, character.reaction)}>
              Reaction
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex flex-wrap items-center p-2 space-x-2 space-y-2">
          {memoizedTokens}
          <Button
            onClick={handleAddToken}
            variant="outline"
            size="sm"
            className="h-[30px] bg-white text-black hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800 border-zinc-300 dark:border-zinc-800"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Token
          </Button>
        </div>
      </div>
      <div className={`flex-shrink-0 w-10 ${getTabColor()} flex flex-col items-center justify-center`}>
        <TurnNavigator
          turnTime={turnTime}
          onPreviousTurn={onPreviousTurn}
          onNextTurn={onNextTurn}
        />
      </div>
    </div>
  );
});

export default CharacterCard;