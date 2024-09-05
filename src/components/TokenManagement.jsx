import React, { useState, useCallback } from 'react';
import { Badge } from "../components/ui/badge";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import TokenInput from './TokenInput';
import { PlusCircle, X, Clock } from 'lucide-react';

const TokenManagement = ({ tokens, updateCharacter, isActive, setIsNumericInputActive }) => {
  const [newTokenId, setNewTokenId] = useState(null);
  const [activeDurationInput, setActiveDurationInput] = useState(null);

  const handleAddToken = useCallback(() => {
    const newToken = { id: Date.now(), label: 'Token', tokenDuration: null, showDuration: false, isPersistent: true };
    const updatedTokens = [...tokens, newToken];
    updateCharacter(prevCharacter => ({ ...prevCharacter, tokens: updatedTokens }));
    setNewTokenId(newToken.id);
  }, [tokens, updateCharacter]);

  const handleRemoveToken = useCallback((tokenId) => {
    const updatedTokens = tokens.filter(token => token.id !== tokenId);
    updateCharacter(prevCharacter => ({ ...prevCharacter, tokens: updatedTokens }));
  }, [tokens, updateCharacter]);

  const handleTokenDurationChange = useCallback((tokenId, newDuration) => {
    const updatedTokens = tokens.map(token => 
      token.id === tokenId ? { 
        ...token, 
        tokenDuration: newDuration === '' ? null : newDuration,
        isPersistent: newDuration === '' || newDuration === null
      } : token
    );
    updateCharacter(prevCharacter => ({ ...prevCharacter, tokens: updatedTokens }));
  }, [tokens, updateCharacter]);

  const handleTokenLabelChange = useCallback((tokenId, newLabel) => {
    const updatedTokens = tokens.map(token => 
      token.id === tokenId ? { ...token, label: newLabel } : token
    );
    updateCharacter(prevCharacter => ({ ...prevCharacter, tokens: updatedTokens }));
  }, [tokens, updateCharacter]);

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
    updateCharacter(prevCharacter => ({ ...prevCharacter, tokens: updatedTokens }));
    setActiveDurationInput(tokenId);
  }, [tokens, updateCharacter]);

  const handleTokenDurationBlur = useCallback((tokenId, value) => {
    if (value === '' || isNaN(value)) {
      handleTokenDurationChange(tokenId, null);
    }
    setActiveDurationInput(null);
  }, [handleTokenDurationChange]);

  const handleTokenFocus = useCallback(() => {
    setIsNumericInputActive(true);
  }, [setIsNumericInputActive]);

  return (
    <div className="flex flex-wrap gap-2">
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
        variant="outline"
        size="sm"
        className="h-[30px] px-2 bg-white hover:bg-zinc-100 text-black dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100"
      >
        <PlusCircle className="h-4 w-4 mr-1" />
        Add Token
      </Button>
    </div>
  );
};

export default TokenManagement;