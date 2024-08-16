import React from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import TurnNavigator from './TurnNavigator';

const CharacterCard = ({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn }) => {
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
      return 'border-black';
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

  return (
    <div className={`flex ${getBackgroundColor()} ${getBorderColor()} relative overflow-hidden rounded-lg border-4`}>
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
              value={character.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="text-xl font-bold"
            />
            <Input
              type="number"
              value={character.initiative}
              onChange={(e) => handleInputChange('initiative', parseInt(e.target.value))}
              className="w-16 text-center" placeholder="Initiative"
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
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              value={character.ac}
              onChange={(e) => handleInputChange('ac', parseInt(e.target.value))}
              className="w-16 text-center" placeholder="AC"
            />
          </div>

          {/* Third row */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => toggleAction('action')}
              variant={character.action ? 'default' : 'outline'}
              size="sm"
            >
              Action
            </Button>
            <Button
              onClick={() => toggleAction('bonusAction')}
              variant={character.bonusAction ? 'default' : 'outline'}
              size="sm"
            >
              Bonus Action
            </Button>
            <Button
              onClick={() => toggleAction('reaction')}
              variant={character.reaction ? 'default' : 'outline'}
              size="sm"
            >
              Reaction
            </Button>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={character.currentMovement}
                onChange={(e) => handleInputChange('currentMovement', parseInt(e.target.value))}
                className="w-16 text-center" placeholder="Current Move"
              />
              <span>/</span>
              <Input
                type="number"
                value={character.maxMovement}
                onChange={(e) => handleInputChange('maxMovement', parseInt(e.target.value))}
                className="w-16 text-center" placeholder="Max Move"
              />
            </div>
          </div>

          {/* Fourth row - Inline Note and Delete button */}
          <div className="mt-2 flex items-center justify-between">
            <Input
              value={character.note || ''}
              onChange={(e) => handleInputChange('note', e.target.value)}
              placeholder="Add a note..."
              className="flex-grow mr-2"
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-gray-700 hover:text-red-500 text-xs p-0 transition-colors duration-200 whitespace-nowrap"
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
      <div className={`w-24 ${getTabColor()} ${isActive ? 'text-white' : ''} flex flex-col items-center justify-center p-2`}>
        <div className="flex flex-col items-center mb-2">
          <label className="text-[8px] mb-1">Temp HP</label>
          <Input
            type="number"
            value={character.tempHp}
            onChange={(e) => handleInputChange('tempHp', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-16 text-center"
          />
        </div>
        <div className="flex flex-col items-center mb-2">
          <label className="text-[8px] mb-1">Current HP</label>
          <Input
            type="number"
            value={character.currentHp}
            onChange={(e) => handleInputChange('currentHp', parseInt(e.target.value) || 0)}
            className="w-16 text-center"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-[8px] mb-1">Max HP</label>
          <Input
            type="number"
            value={character.maxHp}
            onChange={(e) => handleInputChange('maxHp', parseInt(e.target.value) || 0)}
            className="w-16 text-center"
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;