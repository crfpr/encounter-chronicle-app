import React from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { X } from 'lucide-react';

const CharacterCard = ({ character, updateCharacter, removeCharacter, isActive }) => {
  // ... (keep all existing functions)

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

  return (
    <div className={`flex ${getBackgroundColor()} relative overflow-hidden rounded-lg`}>
      {/* New Tab element */}
      <div className={`w-9 h-full ${isActive ? 'bg-black' : getBorderColor()}`}></div>
      
      <div className={`flex-grow p-4 relative`}>
        <div 
          className={`absolute inset-0 pointer-events-none ${getBorderColor()} ${character.currentHp / character.maxHp <= 0.25 ? 'animate-pulse' : ''}`} 
          style={{ borderWidth: '4px' }}
        ></div>
        <div className="relative z-10 space-y-4">
          {/* First row */}
          <div className="flex items-end space-x-4">
            <Input
              value={character.initiative}
              onChange={(e) => updateCharacter({ ...character, initiative: e.target.value })}
              className="w-16 text-center font-bold"
            />
            <Input
              value={character.name}
              onChange={(e) => updateCharacter({ ...character, name: e.target.value })}
              className="flex-grow font-semibold"
            />
            <Select
              value={character.type}
              onValueChange={(value) => updateCharacter({ ...character, type: value })}
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
                value={character.currentHp}
                onChange={(e) => updateCharacter({ ...character, currentHp: e.target.value })}
                className="w-16 text-center"
              />
              <span>/</span>
              <Input
                value={character.maxHp}
                onChange={(e) => updateCharacter({ ...character, maxHp: e.target.value })}
                className="w-16 text-center"
              />
            </div>
            <Input
              value={character.ac}
              onChange={(e) => updateCharacter({ ...character, ac: e.target.value })}
              className="w-16 text-center"
              placeholder="AC"
            />
          </div>

          {/* Third row */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={character.action ? 'default' : 'outline'}
              onClick={() => updateCharacter({ ...character, action: !character.action })}
              size="sm"
            >
              Action
            </Button>
            <Button
              variant={character.bonusAction ? 'default' : 'outline'}
              onClick={() => updateCharacter({ ...character, bonusAction: !character.bonusAction })}
              size="sm"
            >
              Bonus Action
            </Button>
            <div className="flex items-center space-x-2">
              <Input
                value={character.currentMovement}
                onChange={(e) => updateCharacter({ ...character, currentMovement: e.target.value })}
                className="w-16 text-center"
              />
              <span>/</span>
              <Input
                value={character.maxMovement}
                onChange={(e) => updateCharacter({ ...character, maxMovement: e.target.value })}
                className="w-16 text-center"
              />
            </div>
            <Button
              variant={character.reaction ? 'default' : 'outline'}
              onClick={() => updateCharacter({ ...character, reaction: !character.reaction })}
              size="sm"
            >
              Reaction
            </Button>
          </div>

          {/* Fourth row - Inline Note */}
          <div className="mt-2">
            <Input
              value={character.note}
              onChange={(e) => updateCharacter({ ...character, note: e.target.value })}
              className="w-full"
              placeholder="Add a note..."
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