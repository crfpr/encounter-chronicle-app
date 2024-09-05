import React, { useState, useCallback, useMemo } from 'react';
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
import CharacterStats from './CharacterStats';
import CharacterActions from './CharacterActions';

const CharacterCard = React.memo(({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn, setIsNumericInputActive, onInitiativeBlur, onInitiativeSubmit, round }) => {
  const [tokens, setTokens] = useState(character.tokens || []);
  const [newTokenId, setNewTokenId] = useState(null);
  const [activeDurationInput, setActiveDurationInput] = useState(null);

  const handleInputChange = useCallback((field, value) => {
    if (['initiative', 'ac', 'currentHp', 'maxHp', 'currentMovement', 'maxMovement'].includes(field)) {
      if (value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 999)) {
        updateCharacter({ ...character, [field]: value });
      }
    } else {
      updateCharacter({ ...character, [field]: value });
    }
  }, [character, updateCharacter]);

  const handleNumericInputKeyDown = useCallback((e, field, currentValue) => {
    if (!/[0-9]/.test(e.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (field === 'initiative') {
        onInitiativeSubmit(character.id, currentValue);
      } else {
        handleInputChange(field, currentValue);
      }
      e.target.blur();
    }
  }, [character.id, handleInputChange, onInitiativeSubmit]);

  const handleInitiativeBlur = useCallback(() => {
    onInitiativeBlur(character.id, character.initiative);
  }, [character.id, character.initiative, onInitiativeBlur]);

  const handleAddToken = useCallback(() => {
    const newToken = { id: Date.now(), label: 'Token', tokenDuration: null, showDuration: false, isPersistent: true };
    setTokens(prevTokens => [...prevTokens, newToken]);
    updateCharacter({ ...character, tokens: [...tokens, newToken] });
    setNewTokenId(newToken.id);
  }, [character, tokens, updateCharacter]);

  const handleRemoveToken = useCallback((tokenId) => {
    const updatedTokens = tokens.filter(token => token.id !== tokenId);
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  }, [character, tokens, updateCharacter]);

  const handleTokenUpdate = useCallback((updatedToken) => {
    const updatedTokens = tokens.map(token => token.id === updatedToken.id ? updatedToken : token);
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  }, [character, tokens, updateCharacter]);

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
        onUpdate={handleTokenUpdate}
        isNew={token.id === newTokenId}
        onFocus={() => setIsNumericInputActive(true)}
      />
      <Button
        onClick={() => handleRemoveToken(token.id)}
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 hover:bg-zinc-700 dark:hover:bg-zinc-700"
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  )), [tokens, isActive, newTokenId, handleTokenUpdate, handleRemoveToken, setIsNumericInputActive]);

  return (
    <div className={`flex bg-white dark:bg-zinc-950 relative overflow-hidden rounded-lg border ${isActive ? 'border-zinc-800 dark:border-zinc-800' : 'border-zinc-300 dark:border-zinc-800'} transition-all duration-200 ease-in-out`}>
      <div className="w-full flex flex-col">
        <div className={`flex items-center justify-between p-2 ${isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'}`}>
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
          <CharacterStats
            character={character}
            handleInputChange={handleInputChange}
            handleNumericInputKeyDown={handleNumericInputKeyDown}
            setIsNumericInputActive={setIsNumericInputActive}
          />
        </div>
        <div className="flex flex-wrap items-center p-2 space-x-2 space-y-2">
          <CharacterActions
            character={character}
            updateCharacter={updateCharacter}
            isActive={isActive}
          />
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
      <div className={`flex-shrink-0 w-10 ${isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'} flex flex-col items-center justify-center`}>
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