import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { ToggleGroup, ToggleGroupItem } from "../components/ui/toggle-group";
import TurnNavigator from './TurnNavigator';
import Token from './Token';
import CharacterNameType from './CharacterNameType';
import { PlusCircle } from 'lucide-react';

const CharacterCard = ({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn, setIsNumericInputActive, onInitiativeBlur, onInitiativeSubmit, isMobile }) => {
  const [tokens, setTokens] = useState(character.tokens || []);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

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

  useEffect(() => {
    setTokens(character.tokens || []);
  }, [character.tokens]);

  const handleInitiativeChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 99)) {
      updateCharacter({ ...character, initiative: value });
    }
  };

  const handleHpChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 999)) {
      updateCharacter({ ...character, currentHp: value });
    }
  };

  const handleMaxHpChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 999)) {
      updateCharacter({ ...character, maxHp: value });
    }
  };

  const handleTempHpChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 999)) {
      updateCharacter({ ...character, tempHp: value });
    }
  };

  const handleAcChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 99)) {
      updateCharacter({ ...character, ac: value });
    }
  };

  const handleMovementChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= 999)) {
      updateCharacter({ ...character, currentMovement: value, maxMovement: value });
    }
  };

  const handleActionToggle = (value) => {
    updateCharacter({ ...character, action: value.includes('action') });
  };

  const handleBonusActionToggle = (value) => {
    updateCharacter({ ...character, bonusAction: value.includes('bonusAction') });
  };

  const handleReactionToggle = (value) => {
    updateCharacter({ ...character, reaction: value.includes('reaction') });
  };

  const addToken = () => {
    const newToken = { id: Date.now(), label: 'New Token', duration: null };
    const updatedTokens = [...tokens, newToken];
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  };

  const updateToken = (id, updatedToken) => {
    const updatedTokens = tokens.map(token =>
      token.id === id ? { ...token, ...updatedToken } : token
    );
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  };

  const removeToken = (id) => {
    const updatedTokens = tokens.filter(token => token.id !== id);
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  };

  return (
    <div className={`bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg p-4 mb-4 shadow-md transition-all duration-300 ease-in-out ${isActive ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <CharacterNameType
            name={character.name}
            type={character.type}
            onUpdate={(name, type) => updateCharacter({ ...character, name, type })}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">Remove</Button>
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
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Initiative</label>
            <Input
              type="number"
              value={character.initiative}
              onChange={handleInitiativeChange}
              onBlur={() => onInitiativeBlur(character.id, character.initiative)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onInitiativeSubmit(character.id, character.initiative);
                }
              }}
              min="0"
              max="99"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">HP</label>
            <Input
              type="number"
              value={character.currentHp}
              onChange={handleHpChange}
              min="0"
              max="999"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Max HP</label>
            <Input
              type="number"
              value={character.maxHp}
              onChange={handleMaxHpChange}
              min="0"
              max="999"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Temp HP</label>
            <Input
              type="number"
              value={character.tempHp}
              onChange={handleTempHpChange}
              min="0"
              max="999"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">AC</label>
            <Input
              type="number"
              value={character.ac}
              onChange={handleAcChange}
              min="0"
              max="99"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Movement</label>
            <Input
              type="number"
              value={character.currentMovement}
              onChange={handleMovementChange}
              min="0"
              max="999"
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Actions</label>
          <ToggleGroup type="multiple" className="justify-start">
            <ToggleGroupItem value="action" aria-label="Toggle action" data-state={character.action ? 'on' : 'off'} onClick={() => handleActionToggle(['action'])}>
              Action
            </ToggleGroupItem>
            <ToggleGroupItem value="bonusAction" aria-label="Toggle bonus action" data-state={character.bonusAction ? 'on' : 'off'} onClick={() => handleBonusActionToggle(['bonusAction'])}>
              Bonus Action
            </ToggleGroupItem>
            <ToggleGroupItem value="reaction" aria-label="Toggle reaction" data-state={character.reaction ? 'on' : 'off'} onClick={() => handleReactionToggle(['reaction'])}>
              Reaction
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Conditions & Effects</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tokens.map(token => (
              <Token
                key={token.id}
                label={token.label}
                duration={token.duration}
                onRemove={() => removeToken(token.id)}
                onUpdate={(label, duration) => updateToken(token.id, { label, duration })}
                isActive={isActive}
              />
            ))}
          </div>
          <Button onClick={addToken} variant="outline" size="sm" className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Token
          </Button>
        </div>
      </div>

      {isActive && (
        <div className="mt-4 flex justify-end">
          <TurnNavigator
            turnTime={turnTime}
            onPreviousTurn={onPreviousTurn}
            onNextTurn={onNextTurn}
          />
        </div>
      )}
    </div>
  );
};

export default CharacterCard;