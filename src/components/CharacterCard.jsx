import React from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import TurnNavigator from './TurnNavigator';

const CharacterCard = ({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn }) => {
  const getBackgroundColor = () => {
    switch (character.type) {
      case 'PC':
        return 'bg-blue-100';
      case 'Enemy':
        return 'bg-red-100';
      case 'Neutral':
        return 'bg-gray-100';
      default:
        return 'bg-white';
    }
  };

  const getBorderColor = () => {
    switch (character.type) {
      case 'PC':
        return 'border-blue-500';
      case 'Enemy':
        return 'border-red-500';
      case 'Neutral':
        return 'border-gray-500';
      default:
        return 'border-black';
    }
  };

  const handleInputChange = (field, value) => {
    updateCharacter({ ...character, [field]: value });
  };

  const toggleAction = (action) => {
    updateCharacter({ ...character, [action]: !character[action] });
  };

  return (
    <div className={`flex ${getBackgroundColor()} relative overflow-hidden rounded-lg`}>
      {/* Tab element with TurnNavigator */}
      <div className={`w-16 h-full ${isActive ? 'bg-black text-white' : getBorderColor()} flex flex-col items-center justify-center`}>
        {isActive ? (
          <TurnNavigator
            turnTime={turnTime}
            onPreviousTurn={onPreviousTurn}
            onNextTurn={onNextTurn}
          />
        ) : (
          <div className="text-sm font-semibold rotate-[-90deg] whitespace-nowrap">
            {character.name}
          </div>
        )}
      </div>
      
      <div className={`flex-grow p-4 relative`}>
        <div 
          className={`absolute inset-0 pointer-events-none ${getBorderColor()} ${character.currentHp / character.maxHp <= 0.25 ? 'animate-pulse' : ''}`} 
          style={{ borderWidth: '4px' }}
        ></div>
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
              className="w-16 text-center"
            />
            <Select
              value={character.type}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Type" />
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
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={character.currentHp}
                onChange={(e) => handleInputChange('currentHp', parseInt(e.target.value))}
                className="w-16 text-center"
              />
              <span>/</span>
              <Input
                type="number"
                value={character.maxHp}
                onChange={(e) => handleInputChange('maxHp', parseInt(e.target.value))}
                className="w-16 text-center"
              />
            </div>
            <Input
              type="number"
              value={character.ac}
              onChange={(e) => handleInputChange('ac', parseInt(e.target.value))}
              className="w-16 text-center"
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
                className="w-16 text-center"
              />
              <span>/</span>
              <Input
                type="number"
                value={character.maxMovement}
                onChange={(e) => handleInputChange('maxMovement', parseInt(e.target.value))}
                className="w-16 text-center"
              />
            </div>
          </div>

          {/* Fourth row - Inline Note */}
          <div className="mt-2">
            <Input
              value={character.note || ''}
              onChange={(e) => handleInputChange('note', e.target.value)}
              placeholder="Add a note..."
              className="w-full"
            />
          </div>

          {/* Fifth row */}
          <div className="flex justify-end mt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <X className="h-4 w-4" />
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
    </div>
  );
};

export default CharacterCard;