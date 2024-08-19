import React, { useState, useEffect } from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import TurnNavigator from './TurnNavigator';
import Token from './Token';
import { PlusCircle } from 'lucide-react';

const CharacterCard = ({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn }) => {
  const [tokens, setTokens] = useState(character.tokens || []);

  useEffect(() => {
    if (isActive) {
      const updatedTokens = tokens.map(token => ({
        ...token,
        duration: Math.max(0, token.duration - 1)
      }));
      const filteredTokens = updatedTokens.filter(token => token.duration > 0);
      setTokens(filteredTokens);
      updateCharacter({ ...character, tokens: filteredTokens });
    }
  }, [isActive]);

  const getBackgroundColor = () => {
    switch (character.type) {
      case 'PC':
        return 'bg-blue-100';
      case 'Enemy':
        return 'bg-red-100';
      case 'Neutral':
        return 'bg-green-100';
      default:
        return 'bg-white';
    }
  };

  const getBorderColor = () => {
    if (isActive) {
      return 'border-black border-[3px]';
    }
    switch (character.type) {
      case 'PC':
        return 'border-blue-300';
      case 'Enemy':
        return 'border-red-300';
      case 'Neutral':
        return 'border-green-300';
      default:
        return 'border-gray-200';
    }
  };

  const getTabColor = () => {
    if (isActive) {
      return 'bg-black';
    }
    switch (character.type) {
      case 'PC':
        return 'bg-blue-300';
      case 'Enemy':
        return 'bg-red-300';
      case 'Neutral':
        return 'bg-green-300';
      default:
        return 'bg-gray-200';
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'currentHp') {
      value = Math.min(Math.max(0, value), character.maxHp);
    }
    if (field === 'maxHp') {
      value = Math.max(0, value);
      if (character.currentHp > value) {
        updateCharacter({ ...character, [field]: value, currentHp: value });
        return;
      }
    }
    updateCharacter({ ...character, [field]: value });
  };

  const toggleAction = (action) => {
    updateCharacter({ ...character, [action]: !character[action] });
  };

  const handleAddToken = () => {
    const newToken = { label: `Token ${tokens.length + 1}`, duration: 1 };
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

  return (
    <div className={`flex ${getBackgroundColor()} ${getBorderColor()} relative overflow-hidden rounded-lg ${isActive ? '' : 'border-4'}`}>
      {/* Left Tab */}
      <div className={`w-16 ${getTabColor()} ${isActive ? 'text-white' : ''} flex items-stretch`}>
        {isActive ? (
          <div className="flex-1 flex items-center justify-center">
            <TurnNavigator
              turnTime={turnTime}
              onPreviousTurn={onPreviousTurn}
              onNextTurn={onNextTurn}
            />
          </div>
        ) : (
          <div className="flex-1"></div>
        )}
      </div>
      
      <div className="flex-grow p-4 relative">
        <div className="relative z-10 space-y-4">
          {/* First row */}
          <div className="flex items-end space-x-4">
            <Input
              type="number"
              value={character.initiative}
              onChange={(e) => handleInputChange('initiative', parseInt(e.target.value))}
              className="w-16 text-center"
            />
            <Input
              value={character.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="text-lg font-bold flex-grow"
            />
            <Select
              value={character.type}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Character Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PC">PC</SelectItem>
                <SelectItem value="Enemy">Enemy</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Second row */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => toggleAction('action')}
              variant={character.action ? 'default' : 'outline'}
              className="btn-sm"
            >
              Action
            </Button>
            <Button
              onClick={() => toggleAction('bonusAction')}
              variant={character.bonusAction ? 'default' : 'outline'}
              className="btn-sm"
            >
              Bonus Action
            </Button>
            <Button
              onClick={() => toggleAction('reaction')}
              variant={character.reaction ? 'default' : 'outline'}
              className="btn-sm"
            >
              Reaction
            </Button>
            <div className="flex items-end space-x-2">
              <Input
                type="number"
                value={character.currentMovement}
                onChange={(e) => handleInputChange('currentMovement', parseInt(e.target.value))}
                className="w-16 text-center"
                placeholder="Current"
              />
              <span className="mb-2">/</span>
              <div className="flex items-end">
                <Input
                  type="number"
                  value={character.maxMovement}
                  onChange={(e) => handleInputChange('maxMovement', parseInt(e.target.value))}
                  className="w-16 text-center"
                  placeholder="Max"
                />
                <span className="text-sm ml-1">ft</span>
              </div>
            </div>
          </div>

          {/* Token display and Add token button */}
          <div className="mt-2 mb-2">
            <div className="flex flex-wrap items-center">
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

          {/* Third row - Inline Note and Delete button */}
          <div className="mt-auto pt-2 flex items-center justify-between">
            <div className="flex flex-col flex-grow mr-2">
              <Input
                value={character.note || ''}
                onChange={(e) => handleInputChange('note', e.target.value)}
                placeholder="Add a note..."
              />
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="link" 
                  className="btn-sm text-gray-700 hover:text-red-500 transition-colors duration-200 whitespace-nowrap"
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
      </div>

      {/* Right Tab */}
      <div className={`w-24 ${getTabColor()} flex flex-col items-center justify-between p-2`}>
        <div className="flex flex-col items-center space-y-2">
          <div className="flex flex-col items-center">
            <label className={`text-xs font-semibold mb-1 ${isActive ? 'text-white' : ''}`}>Temp HP</label>
            <Input
              type="number"
              value={character.tempHp}
              onChange={(e) => handleInputChange('tempHp', Math.max(0, parseInt(e.target.value) || 0))}
              className="w-16 text-center bg-white text-black"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className={`text-xs font-semibold mb-1 ${isActive ? 'text-white' : ''}`}>Current HP</label>
            <Input
              type="number"
              value={character.currentHp}
              onChange={(e) => handleInputChange('currentHp', parseInt(e.target.value) || 0)}
              className="w-16 text-center bg-white text-black"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className={`text-xs font-semibold mb-1 ${isActive ? 'text-white' : ''}`}>Max HP</label>
            <Input
              type="number"
              value={character.maxHp}
              onChange={(e) => handleInputChange('maxHp', parseInt(e.target.value) || 0)}
              className="w-16 text-center bg-white text-black"
            />
          </div>
        </div>
        <div className="flex flex-col items-center mt-2">
          <label className={`text-xs font-semibold mb-1 ${isActive ? 'text-white' : ''}`}>AC</label>
          <Input
            type="number"
            value={character.ac}
            onChange={(e) => handleInputChange('ac', parseInt(e.target.value))}
            className="w-16 text-center bg-white text-black"
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;