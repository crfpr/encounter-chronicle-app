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

  // ... rest of the component code remains unchanged

  return (
    // ... existing JSX
  );
};

export default CharacterCard;