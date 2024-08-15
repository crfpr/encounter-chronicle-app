import React from 'react';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Label } from '../components/ui/label';
import { Crown } from 'lucide-react';

const CharacterCard = ({ character, updateCharacter, removeCharacter, isActive, turnTime }) => {
  const handleChange = (field, value) => {
    updateCharacter({ ...character, [field]: value });
  };

  const addCondition = () => {
    const newCondition = { name: 'New Condition', duration: 1 };
    handleChange('conditions', [...character.conditions, newCondition]);
  };

  const updateCondition = (index, field, value) => {
    const updatedConditions = character.conditions.map((condition, i) => 
      i === index ? { ...condition, [field]: value } : condition
    );
    handleChange('conditions', updatedConditions);
  };

  const removeCondition = (index) => {
    const updatedConditions = character.conditions.filter((_, i) => i !== index);
    handleChange('conditions', updatedConditions);
  };

  const getBackgroundColor = () => {
    switch (character.type) {
      case 'PC': return 'bg-blue-100';
      case 'NPC': return 'bg-gray-100';
      case 'Enemy': return 'bg-red-100';
      default: return 'bg-white';
    }
  };

  const getBorderColor = () => {
    const hpPercentage = (character.currentHp / character.maxHp) * 100;
    if (hpPercentage <= 25) {
      return 'border-red-600';
    } else if (hpPercentage <= 50) {
      return 'border-yellow-600';
    }
    return 'border-gray-200';
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex">
      <div className="w-16 flex flex-col items-center justify-center mr-2">
        {isActive && (
          <>
            <Crown className="h-8 w-8 text-yellow-500 mb-2" />
            <div className="text-sm font-semibold">{formatTime(turnTime)}</div>
          </>
        )}
      </div>
      <div className={`flex-grow p-4 rounded-lg ${getBackgroundColor()} relative overflow-hidden`}>
        <div 
          className={`absolute inset-0 rounded-lg pointer-events-none ${getBorderColor()} ${character.currentHp / character.maxHp <= 0.25 ? 'animate-pulse' : ''}`} 
          style={{ borderWidth: '4px' }}
        ></div>
        <div className="relative z-10">
          <div className="flex items-end space-x-2 mb-2">
            <div className="flex flex-col relative">
              <Label htmlFor={`initiative-${character.id}`} className="absolute -top-4 left-0 text-xs">Initiative</Label>
              <Input
                id={`initiative-${character.id}`}
                value={character.initiative}
                onChange={(e) => handleChange('initiative', parseInt(e.target.value) || 0)}
                className="w-16"
                type="number"
              />
            </div>
            <div className="flex flex-col relative">
              <Label htmlFor={`type-${character.id}`} className="absolute -top-4 left-0 text-xs">Type</Label>
              <Select value={character.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger id={`type-${character.id}`} className="w-24">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PC">PC</SelectItem>
                  <SelectItem value="NPC">NPC</SelectItem>
                  <SelectItem value="Enemy">Enemy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col flex-grow relative">
              <Label htmlFor={`name-${character.id}`} className="absolute -top-4 left-0 text-xs">Name</Label>
              <Input
                id={`name-${character.id}`}
                value={character.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-end space-x-2">
              <div className="flex flex-col relative">
                <Label htmlFor={`currentHp-${character.id}`} className="absolute -top-4 left-0 text-xs">HP</Label>
                <div className="flex items-center">
                  <Input
                    id={`currentHp-${character.id}`}
                    value={character.currentHp}
                    onChange={(e) => handleChange('currentHp', parseInt(e.target.value) || 0)}
                    className="w-16"
                    type="number"
                  />
                  <span className="mx-1">/</span>
                  <Input
                    id={`maxHp-${character.id}`}
                    value={character.maxHp}
                    onChange={(e) => handleChange('maxHp', parseInt(e.target.value) || 0)}
                    className="w-16"
                    type="number"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor={`action-${character.id}`} className="text-xs mb-1">Action</Label>
                <Checkbox
                  id={`action-${character.id}`}
                  checked={character.action}
                  onCheckedChange={(checked) => handleChange('action', checked)}
                />
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor={`bonus-action-${character.id}`} className="text-xs mb-1">Bonus</Label>
                <Checkbox
                  id={`bonus-action-${character.id}`}
                  checked={character.bonusAction}
                  onCheckedChange={(checked) => handleChange('bonusAction', checked)}
                />
              </div>
              <div className="flex flex-col relative">
                <Label htmlFor={`movement-${character.id}`} className="absolute -top-4 left-0 text-xs">Move</Label>
                <div className="flex items-center">
                  <Input
                    id={`movement-${character.id}`}
                    value={character.movement}
                    onChange={(e) => handleChange('movement', parseInt(e.target.value) || 0)}
                    className="w-16"
                    type="number"
                  />
                  <span className="ml-1">ft</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <Label htmlFor={`reaction-${character.id}`} className="text-xs mb-1">Reaction</Label>
                <Checkbox
                  id={`reaction-${character.id}`}
                  checked={character.reaction}
                  onCheckedChange={(checked) => handleChange('reaction', checked)}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <Button onClick={addCondition} variant="outline" size="sm">Add Condition</Button>
            {character.conditions.map((condition, index) => (
              <Badge key={index} variant="secondary" className="px-2 py-1">
                <Input
                  value={condition.name}
                  onChange={(e) => updateCondition(index, 'name', e.target.value)}
                  className="w-24 mr-1"
                />
                <Input
                  value={condition.duration}
                  onChange={(e) => updateCondition(index, 'duration', parseInt(e.target.value) || 0)}
                  className="w-12 mr-1"
                  type="number"
                />
                <button onClick={() => removeCondition(index)} className="ml-2 text-red-500">×</button>
              </Badge>
            ))}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">Remove Character</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the character from the encounter.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => removeCharacter(character.id)}>
                  Yes, remove character
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;