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

  // ... (other code)

  const handleTokenLabelChange = (tokenId, newLabel) => {
    const updatedTokens = tokens.map(token => 
      token.id === tokenId ? { ...token, label: newLabel.slice(0, 30) } : token
    );
    setTokens(updatedTokens);
    updateCharacter({ ...character, tokens: updatedTokens });
  };

  // ... (other code)

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

  // ... (rest of the component)
};

export default CharacterCard;