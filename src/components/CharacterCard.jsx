import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { Badge } from "../components/ui/badge";
import TurnNavigator from './TurnNavigator';
import CharacterNameType from './CharacterNameType';
import TokenInput from './TokenInput';
import { PlusCircle, X, Clock } from 'lucide-react';

const CharacterCard = ({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn, setIsNumericInputActive, onInitiativeBlur, onInitiativeSubmit, isMobile, round }) => {
  const [tokens, setTokens] = useState(character.tokens || []);
  const [newTokenId, setNewTokenId] = useState(null);
  const [activeDurationInput, setActiveDurationInput] = useState(null);

  useEffect(() => {
    setTokens(character.tokens || []);
  }, [character.tokens]);

  const getBorderStyle = () => {
    return isActive
      ? 'border-zinc-800 dark:border-zinc-800'
      : 'border-zinc-300 dark:border-zinc-800';
  };

  const getTabColor = () => {
    return isActive
      ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100'
      : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100';
  };

  const handleInputChange = (field, value) => {
    if (field === 'initiative' || field === 'ac' || field === 'currentHp' || field === 'maxHp' || field === 'currentMovement' || field === 'maxMovement') {
      if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 999)) {
        updateCharacter({ ...character, [field]: value });
      }
      return;
    }
    updateCharacter({ ...character, [field]: value });
  };

  const handleNumericInputKeyDown = (e, field, currentValue) => {
    if (!/[0-9]/.test(e.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputSubmit(field, currentValue);
      e.target.blur();
    }
  };

  const handleInputSubmit = (field, value) => {
    setIsNumericInputActive(false);
    if (field === 'initiative') {
      onInitiativeSubmit(character.id, value);
    } else {
      handleInputChange(field, value);
    }
  };

  const handleInitiativeBlur = () => {
    onInitiativeBlur(character.id, character.initiative);
  };

  const handleToggleAction = (value) => {
    const updatedCharacter = {
      ...character,
      action: value.includes('action'),
      bonusAction: value.includes('bonusAction'),
      reaction: value.includes('reaction')
    };
    updateCharacter(updatedCharacter);
  };

  const getToggleGroupItemStyle = (isActive, isToggled) => {
    return `h-[30px] px-2 text-xs border transition-colors ${
      isToggled
        ? isActive
          ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white'
          : 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white'
        : 'bg-white text-black hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800'
    } border-zinc-300 dark:border-zinc-800`;
  };

  const handleAddToken = () => {
    const newToken = { id: Date.now(), label: 'Token', tokenDuration: null, showDuration: false, isPersistent: true };
    const updatedTokens = [...tokens, newToken];
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
    setNewTokenId(newToken.id);
    setTimeout(() => setNewTokenId(null), 100);
  };

  const handleRemoveToken = (tokenId) => {
    const updatedTokens = tokens.filter(token => token.id !== tokenId);
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  };

  const handleTokenDurationChange = (tokenId, newDuration) => {
    const updatedTokens = tokens.map(token => 
      token.id === tokenId ? { 
        ...token, 
        tokenDuration: newDuration === '' ? null : newDuration,
        isPersistent: newDuration === '' || newDuration === null
      } : token
    );
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  };

  const handleTokenLabelChange = useCallback((tokenId, newLabel) => {
    const updatedTokens = tokens.map(token => 
      token.id === tokenId ? { ...token, label: newLabel } : token
    );
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  }, [tokens, updateCharacter, character]);

  const toggleTokenDuration = (tokenId) => {
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
    setIsNumericInputActive(true);
  };

  const handleTokenDurationBlur = (tokenId, value) => {
    if (value === '' || isNaN(value)) {
      const updatedTokens = tokens.map(token => 
        token.id === tokenId ? { ...token, showDuration: false, tokenDuration: null, isPersistent: true } : token
      );
      setTokens(updatedTokens);
      updateCharacter({ ...character, tokens: updatedTokens });
    }
    setActiveDurationInput(null);
  };

  const handleTokenFocus = () => {
    setIsNumericInputActive(true);
  };

  return (
    <div className={`flex bg-white dark:bg-zinc-950 relative overflow-hidden rounded-lg border ${getBorderStyle()} box-content transition-all duration-200 ease-in-out`}>
      <div className={`flex-grow p-4 ${getTabColor()}`}>
        <div className="flex flex-col space-y-4">
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
              onBlur={handleInitiativeBlur}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'initiative', character.initiative)}
              onFocus={() => setIsNumericInputActive(true)}
              className="w-16 text-center no-spinners"
              placeholder="Init"
            />
            <Input
              type="number"
              value={character.ac}
              onChange={(e) => handleInputChange('ac', e.target.value)}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'ac', character.ac)}
              onFocus={() => setIsNumericInputActive(true)}
              className="w-16 text-center no-spinners"
              placeholder="AC"
            />
            <div className="flex items-center space-x-1">
              <Input
                type="number"
                value={character.currentHp}
                onChange={(e) => handleInputChange('currentHp', e.target.value)}
                onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentHp', character.currentHp)}
                onFocus={() => setIsNumericInputActive(true)}
                className="w-16 text-center no-spinners"
                placeholder="HP"
              />
              <span>/</span>
              <Input
                type="number"
                value={character.maxHp}
                onChange={(e) => handleInputChange('maxHp', e.target.value)}
                onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxHp', character.maxHp)}
                onFocus={() => setIsNumericInputActive(true)}
                className="w-16 text-center no-spinners"
                placeholder="Max"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ToggleGroup type="multiple" value={[character.action && 'action', character.bonusAction && 'bonusAction', character.reaction && 'reaction'].filter(Boolean)} onValueChange={handleToggleAction}>
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
            <div className="flex items-center space-x-1">
              <Input
                type="number"
                value={character.currentMovement}
                onChange={(e) => handleInputChange('currentMovement', e.target.value)}
                onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentMovement', character.currentMovement)}
                onFocus={() => setIsNumericInputActive(true)}
                className="w-16 text-center no-spinners"
                placeholder="Move"
              />
              <span>/</span>
              <Input
                type="number"
                value={character.maxMovement}
                onChange={(e) => handleInputChange('maxMovement', e.target.value)}
                onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxMovement', character.maxMovement)}
                onFocus={() => setIsNumericInputActive(true)}
                className="w-16 text-center no-spinners"
                placeholder="Max"
              />
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            {tokens.map((token) => (
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
            ))}
            <Button
              onClick={handleAddToken}
              className="h-[30px] px-2 text-xs border transition-colors bg-white text-black hover:bg-zinc-100 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800 border-zinc-300 dark:border-zinc-800"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add token
            </Button>
          </div>
        </div>
      </div>
      <div className={`w-12 flex-shrink-0 ${getTabColor()}`}>
        <TurnNavigator
          turnTime={turnTime}
          onPreviousTurn={onPreviousTurn}
          onNextTurn={onNextTurn}
        />
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full">
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
  );
};

export default CharacterCard;