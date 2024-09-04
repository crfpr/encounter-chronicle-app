import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import { Badge } from "../components/ui/badge";
import TurnNavigator from './TurnNavigator';
import CharacterNameType from './CharacterNameType';
import { PlusCircle, X, Clock } from 'lucide-react';

const CharacterCard = ({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn, setIsNumericInputActive, onInitiativeBlur, onInitiativeSubmit, isMobile, round }) => {
  const [tokens, setTokens] = useState(character.tokens || []);
  const tokenInputRefs = useRef({});

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
      // Allow empty string or numbers up to 999
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
      e.target.blur(); // Remove focus from the input
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

  const handleTokenLabelChange = (tokenId, newLabel) => {
    const updatedTokens = tokens.map(token => 
      token.id === tokenId ? { ...token, label: newLabel.slice(0, 30) } : token
    );
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  };

  const toggleTokenDuration = (tokenId) => {
    const updatedTokens = tokens.map(token => {
      if (token.id === tokenId) {
        const newShowDuration = !token.showDuration;
        return {
          ...token,
          showDuration: newShowDuration,
          tokenDuration: newShowDuration ? null : token.tokenDuration,
          isPersistent: newShowDuration ? true : token.isPersistent
        };
      }
      return token;
    });
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });

    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      if (tokenInputRefs.current[tokenId]) {
        tokenInputRefs.current[tokenId].focus();
      }
    }, 0);
  };

  const handleTokenDurationBlur = (tokenId, value) => {
    if (value === '' || isNaN(value)) {
      const updatedTokens = tokens.map(token => 
        token.id === tokenId ? { ...token, showDuration: false, tokenDuration: null, isPersistent: true } : token
      );
      setTokens(updatedTokens);
      updateCharacter({ ...character, tokens: updatedTokens });
    }
  };

  const TokenInput = ({ token }) => {
    const [inputWidth, setInputWidth] = useState(40);
    const inputRef = useRef(null);

    useEffect(() => {
      if (inputRef.current) {
        const textWidth = getTextWidth(token.label, getComputedStyle(inputRef.current).font);
        setInputWidth(Math.max(40, Math.min(textWidth + 8, 120))); // Min 40px, max 120px
      }
    }, [token.label]);

    const getTextWidth = (text, font) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = font;
      return context.measureText(text).width;
    };

    return (
      <Input
        ref={inputRef}
        type="text"
        value={token.label}
        onChange={(e) => handleTokenLabelChange(token.id, e.target.value)}
        className="h-5 px-1 text-xs bg-transparent border-none focus:outline-none focus:ring-0 overflow-visible"
        style={{ width: `${inputWidth}px`, minWidth: '40px' }}
        maxLength={30}
      />
    );
  };

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
          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup 
              type="multiple" 
              value={[
                character.action && 'action',
                character.bonusAction && 'bonusAction',
                character.reaction && 'reaction'
              ].filter(Boolean)}
              onValueChange={handleToggleAction}
              className="flex"
            >
              <ToggleGroupItem 
                value="action" 
                className={getToggleGroupItemStyle(isActive, character.action)}
              >
                {isMobile ? 'A' : 'Action'}
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="bonusAction" 
                className={getToggleGroupItemStyle(isActive, character.bonusAction)}
              >
                {isMobile ? 'B' : 'Bonus'}
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="reaction" 
                className={getToggleGroupItemStyle(isActive, character.reaction)}
              >
                {isMobile ? 'R' : 'Reaction'}
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                inputMode="numeric"
                value={character.currentMovement}
                onChange={(e) => handleInputChange('currentMovement', e.target.value)}
                onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentMovement', character.currentMovement)}
                onFocus={() => setIsNumericInputActive(true)}
                onBlur={() => setIsNumericInputActive(false)}
                className="w-16 text-center bg-white dark:bg-zinc-950 text-black dark:text-zinc-100 h-[30px] border-zinc-300 dark:border-zinc-800 no-spinners text-sm"
                placeholder="Current"
                maxLength={3}
              />
              <span className="self-center text-xs">/</span>
              <div className="flex items-center">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={character.maxMovement}
                  onChange={(e) => handleInputChange('maxMovement', e.target.value)}
                  onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxMovement', character.maxMovement)}
                  onFocus={() => setIsNumericInputActive(true)}
                  onBlur={() => setIsNumericInputActive(false)}
                  className="w-16 text-center h-[30px] bg-white dark:bg-zinc-950 text-black dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 no-spinners text-sm"
                  placeholder="Max"
                  maxLength={3}
                />
                <span className="text-xs ml-1">ft</span>
              </div>
            </div>
          </div>

          {/* New row for tokens and Add Token button */}
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
                <TokenInput token={token} />
                {token.showDuration ? (
                  <Input
                    type="number"
                    value={token.tokenDuration || ''}
                    onChange={(e) => handleTokenDurationChange(token.id, e.target.value)}
                    onBlur={(e) => handleTokenDurationBlur(token.id, e.target.value)}
                    className="w-8 h-5 px-1 text-xs text-center bg-transparent border-none focus:outline-none focus:ring-0 no-spinners"
                    min="1"
                    ref={(el) => tokenInputRefs.current[token.id] = el}
                    placeholder=""
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

      {/* Right Tab */}
      <div className={`w-18 flex-shrink-0 ${getTabColor()} border-l ${getBorderStyle()} flex flex-col items-center justify-between py-2 px-2 transition-colors duration-200`}>
        <div className="flex flex-col items-center space-y-2">
          <div className="flex flex-col items-center">
            <label className={`text-xs font-semibold mb-1 ${isActive ? 'text-white dark:text-zinc-100' : 'text-black dark:text-zinc-100'}`}>HP</label>
            <Input
              type="text"
              inputMode="numeric"
              value={character.currentHp}
              onChange={(e) => handleInputChange('currentHp', e.target.value)}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentHp', character.currentHp)}
              onFocus={() => setIsNumericInputActive(true)}
              onBlur={() => setIsNumericInputActive(false)}
              className={`w-11 text-center ${isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} h-[30px] border-zinc-300 dark:border-zinc-800 no-spinners text-sm`}
              maxLength={3}
            />
          </div>
          <div className="flex flex-col items-center">
            <label className={`text-xs font-semibold mb-1 ${isActive ? 'text-white dark:text-zinc-100' : 'text-black dark:text-zinc-100'}`}>Max HP</label>
            <Input
              type="text"
              inputMode="numeric"
              value={character.maxHp}
              onChange={(e) => handleInputChange('maxHp', e.target.value)}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxHp', character.maxHp)}
              onFocus={() => setIsNumericInputActive(true)}
              onBlur={() => setIsNumericInputActive(false)}
              className={`w-11 text-center ${isActive ? 'bg-zinc-700 text-white dark:bg-zinc-700 dark:text-white' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} h-[30px] border-zinc-300 dark:border-zinc-800 no-spinners text-sm`}
              maxLength={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;