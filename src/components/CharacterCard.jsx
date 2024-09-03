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
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else if (isActive) {
      const updatedTokens = tokens.map(token => ({
        ...token,
        duration: token.duration !== null ? Math.max(0, token.duration - 1) : null
      }));
      const filteredTokens = updatedTokens.filter(token => token.duration === null || token.duration > 0);
      setTokens(filteredTokens);
      updateCharacter({ ...character, tokens: filteredTokens });
    }
  }, [isActive]);

  // ... rest of the component code remains unchanged

  return (
    <div className={`flex bg-white dark:bg-zinc-950 relative overflow-hidden rounded-lg border ${getBorderStyle()} box-content transition-all duration-200 ease-in-out min-h-[200px]`}>
      {/* ... existing JSX structure */}
    </div>
  );
};

export default CharacterCard;