import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import TurnNavigator from './TurnNavigator';
import Token from './Token';
import CharacterNameType from './CharacterNameType';
import { PlusCircle } from 'lucide-react';

const CharacterCard = ({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn, setIsNumericInputActive, onInitiativeBlur, onInitiativeSubmit }) => {
  const [tokens, setTokens] = useState(character.tokens || []);

  useEffect(() => {
    if (isActive) {
      const updatedTokens = tokens.map(token => ({
        ...token,
        duration: token.duration !== null ? Math.max(0, token.duration - 1) : null
      }));
      const filteredTokens = updatedTokens.filter(token => token.duration === null || token.duration > 0);
      setTokens(filteredTokens);
      updateCharacter({ ...character, tokens: filteredTokens });
    }
  }, [isActive]);

  const getBorderStyle = () => {
    return 'border-black dark:border-zinc-300';
  };

  const getTabColor = () => {
    return isActive ? 'bg-black text-white dark:bg-zinc-600 dark:text-zinc-100' : 'bg-white text-black dark:bg-zinc-900 dark:text-zinc-100';
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
    if (!/[0-9]/.test(e.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputSubmit(field, currentValue);
      e.target.blur(); // Remove focus from the input
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newValue = Math.min(999, parseInt(currentValue || 0) + 1);
      handleInputChange(field, newValue.toString());
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newValue = Math.max(0, parseInt(currentValue || 0) - 1);
      handleInputChange(field, newValue.toString());
    }
    // Block navigation keys when numeric input is active
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.stopPropagation();
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

  const toggleAction = (action) => {
    updateCharacter({ ...character, [action]: !character[action] });
  };

  const handleAddToken = () => {
    const newToken = { label: `Token ${tokens.length + 1}`, duration: null };
    const updatedTokens = [...tokens, newToken];
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  };

  const handleRemoveToken = (index) => {
    const updatedTokens = tokens.filter((_, i) => i !== index);
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  };

  const handleUpdateToken = (index, newLabel, newDuration) => {
    const updatedTokens = tokens.map((token, i) => 
      i === index ? { ...token, label: newLabel, duration: newDuration } : token
    );
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  };

  const getToggleButtonStyle = (isActive) => {
    return `h-[30px] px-2 text-xs border ${isActive ? 'bg-black text-white dark:bg-zinc-200 dark:text-zinc-900 border-black dark:border-zinc-300' : 'bg-white text-black dark:bg-zinc-900 dark:text-zinc-100 border-black dark:border-zinc-300'} transition-colors`;
  };

  return (
    <div className={`flex bg-white dark:bg-zinc-900 relative overflow-hidden rounded-lg border ${getBorderStyle()} box-content transition-all duration-200 ease-in-out min-h-[200px]`}>
      {/* Left Tab */}
      <div className={`w-16 flex-shrink-0 ${getTabColor()} border-r ${getBorderStyle()} flex flex-col items-center justify-between py-2 transition-colors duration-200`}>
        <div className="flex flex-col items-center">
          <label className={`text-xs font-semibold mb-1`}>Initiative</label>
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
            className="w-12 text-center bg-white dark:bg-zinc-800 text-black dark:text-zinc-100 h-[30px]"
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
          <div className="flex items-center space-x-2 relative">
            <div className="flex-grow">
              <CharacterNameType
                name={character.name || 'New Character'}
                type={character.type}
                onUpdate={(newName, newType) => {
                  updateCharacter({ ...character, name: newName || 'New Character', type: newType });
                }}
              />
            </div>
          </div>

          {/* Second row */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => toggleAction('action')}
              className={getToggleButtonStyle(character.action)}
            >
              Action
            </Button>
            <Button
              onClick={() => toggleAction('bonusAction')}
              className={getToggleButtonStyle(character.bonusAction)}
            >
              Bonus
            </Button>
            <Button
              onClick={() => toggleAction('reaction')}
              className={getToggleButtonStyle(character.reaction)}
            >
              Reaction
            </Button>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                inputMode="numeric"
                value={character.currentMovement}
                onChange={(e) => handleInputChange('currentMovement', e.target.value)}
                onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentMovement', character.currentMovement)}
                onFocus={() => setIsNumericInputActive(true)}
                onBlur={() => setIsNumericInputActive(false)}
                className="w-16 text-center bg-white dark:bg-zinc-800 text-black dark:text-zinc-100 h-[30px]"
                placeholder="Current"
                maxLength={3}
              />
              <span className="self-center">/</span>
              <div className="flex items-center">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={character.maxMovement}
                  onChange={(e) => handleInputChange('maxMovement', e.target.value)}
                  onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxMovement', character.maxMovement)}
                  onFocus={() => setIsNumericInputActive(true)}
                  onBlur={() => setIsNumericInputActive(false)}
                  className="w-16 text-center h-[30px] bg-white dark:bg-zinc-800 text-black dark:text-zinc-100"
                  placeholder="Max"
                  maxLength={3}
                />
                <span className="text-sm ml-1">ft</span>
              </div>
            </div>
          </div>

          {/* Token display and Add token button */}
          <div className="mt-2">
            <div className="flex flex-wrap items-center gap-2">
              {tokens.map((token, index) => (
                <Token
                  key={index}
                  label={token.label}
                  duration={token.duration}
                  onRemove={() => handleRemoveToken(index)}
                  onUpdate={(newLabel, newDuration) => handleUpdateToken(index, newLabel, newDuration)}
                />
              ))}
              <Button
                onClick={handleAddToken}
                variant="outline"
                className="h-[30px] px-3 py-1 text-sm flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add token
              </Button>
            </div>
          </div>
        </div>

        {/* Delete button */}
        <div className="mt-auto self-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="link" 
                className="btn-sm text-zinc-700 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 whitespace-nowrap"
              >
                Delete character
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
      <div className={`w-24 flex-shrink-0 ${getTabColor()} border-l ${getBorderStyle()} flex flex-col items-center justify-between p-2 transition-colors duration-200`}>
        <div className="flex flex-col items-center space-y-2">
          <div className="flex flex-col items-center">
            <label className={`text-xs font-semibold mb-1`}>AC</label>
            <Input
              type="text"
              inputMode="numeric"
              value={character.ac}
              onChange={(e) => handleInputChange('ac', e.target.value)}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'ac', character.ac)}
              onFocus={() => setIsNumericInputActive(true)}
              onBlur={() => setIsNumericInputActive(false)}
              className="w-16 text-center bg-white dark:bg-zinc-800 text-black dark:text-zinc-100 h-[30px]"
              maxLength={3}
            />
          </div>
          <div className="flex flex-col items-center">
            <label className={`text-xs font-semibold mb-1`}>Current HP</label>
            <Input
              type="text"
              inputMode="numeric"
              value={character.currentHp}
              onChange={(e) => handleInputChange('currentHp', e.target.value)}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'currentHp', character.currentHp)}
              onFocus={() => setIsNumericInputActive(true)}
              onBlur={() => setIsNumericInputActive(false)}
              className="w-16 text-center bg-white dark:bg-zinc-800 text-black dark:text-zinc-100 h-[30px]"
              maxLength={3}
            />
          </div>
          <div className="flex flex-col items-center">
            <label className={`text-xs font-semibold mb-1`}>Max HP</label>
            <Input
              type="text"
              inputMode="numeric"
              value={character.maxHp}
              onChange={(e) => handleInputChange('maxHp', e.target.value)}
              onKeyDown={(e) => handleNumericInputKeyDown(e, 'maxHp', character.maxHp)}
              onFocus={() => setIsNumericInputActive(true)}
              onBlur={() => setIsNumericInputActive(false)}
              className="w-16 text-center bg-white dark:bg-zinc-800 text-black dark:text-zinc-100 h-[30px]"
              maxLength={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;