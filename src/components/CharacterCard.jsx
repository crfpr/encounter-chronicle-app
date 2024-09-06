import React, { useCallback, useMemo } from 'react';
import { Input } from '../components/ui/input';
import TurnNavigator from './TurnNavigator';
import PlaceholderTurnNavigator from './PlaceholderTurnNavigator';
import CharacterNameType from './CharacterNameType';
import TokenInput from './TokenInput';
import { PlusCircle } from 'lucide-react';
import CharacterActions from './CharacterActions';
import HPSection from './HPSection';
import CharacterStateManager from './CharacterStateManager';
import { Badge } from "../components/ui/badge";
import { Button } from '../components/ui/button';

const CharacterCard = React.memo(({ 
  character, 
  updateCharacter, 
  removeCharacter, 
  isActive, 
  turnTime, 
  onPreviousTurn, 
  onNextTurn, 
  setIsNumericInputActive, 
  onInitiativeBlur, 
  onInitiativeSubmit, 
  isMobile, 
  round 
}) => {
  const handleAddToken = useCallback(() => {
    const newToken = { id: Date.now(), label: 'Token', tokenDuration: null, isPersistent: true };
    updateCharacter({ ...character, tokens: [...character.tokens, newToken] });
  }, [character, updateCharacter]);

  const handleRemoveToken = useCallback((tokenId) => {
    updateCharacter({ ...character, tokens: character.tokens.filter(token => token.id !== tokenId) });
  }, [character, updateCharacter]);

  const handleTokenChange = useCallback((tokenId, changes) => {
    updateCharacter({
      ...character,
      tokens: character.tokens.map(token => 
        token.id === tokenId ? { 
          ...token, 
          ...changes, 
          isPersistent: changes.tokenDuration === null 
        } : token
      )
    });
    console.log(`Token ${tokenId} updated:`, changes);
  }, [character, updateCharacter]);

  const handleInputChange = useCallback((field, value) => {
    if (['initiative', 'ac', 'currentHp', 'maxHp', 'currentMovement', 'maxMovement'].includes(field)) {
      value = value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 999) ? value : character[field];
    }
    updateCharacter({ ...character, [field]: value });
  }, [character, updateCharacter]);

  const handleNumericInputKeyDown = useCallback((e, field, currentValue) => {
    if (!/[0-9]/.test(e.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
      field === 'initiative' ? onInitiativeSubmit(character.id, currentValue) : handleInputChange(field, currentValue);
    }
  }, [character.id, handleInputChange, onInitiativeSubmit]);

  const getBorderStyle = useCallback(() => 
    isActive ? 'border-zinc-700 dark:border-zinc-700' : 'border-zinc-300 dark:border-zinc-700'
  , [isActive]);

  const getTabColor = useCallback(() => 
    isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100' : 'bg-white text-black dark:bg-zinc-950 dark:text-zinc-100'
  , [isActive]);

  const memoizedTokens = useMemo(() => character.tokens.map((token) => (
    <Badge
      key={token.id}
      className={`h-[30px] px-1 flex items-center space-x-1 ${
        isActive ? 'bg-zinc-800 text-white dark:bg-zinc-800 dark:text-zinc-100' : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
      } hover:text-white transition-colors`}
    >
      <TokenInput 
        token={token}
        onLabelChange={(newLabel) => handleTokenChange(token.id, { label: newLabel })}
        onDurationChange={(newDuration) => handleTokenChange(token.id, { tokenDuration: newDuration, isPersistent: newDuration === null })}
        onRemove={() => handleRemoveToken(token.id)}
        onTogglePersistent={(isPersistent) => handleTokenChange(token.id, { isPersistent, tokenDuration: isPersistent ? null : token.tokenDuration })}
      />
    </Badge>
  )), [character.tokens, isActive, handleTokenChange, handleRemoveToken]);

  return (
    <div className={`flex bg-white dark:bg-zinc-950 relative overflow-hidden rounded-lg border ${getBorderStyle()} box-content transition-all duration-200 ease-in-out ${isMobile ? 'mx-0' : ''} min-h-[150px]`}>
      {/* ... (rest of the component remains unchanged) ... */}
    </div>
  );
});

export default CharacterCard;