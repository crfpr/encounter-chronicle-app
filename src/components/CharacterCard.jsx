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

  // Rest of the component remains the same...

  return (
    <div className={`flex bg-white dark:bg-zinc-950 relative overflow-hidden rounded-lg border ${getBorderStyle()} box-content transition-all duration-200 ease-in-out`}>
      {/* Component JSX remains the same... */}
    </div>
  );
});

export default CharacterCard;