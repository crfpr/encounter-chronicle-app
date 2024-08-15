import React from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Crown, X } from 'lucide-react';

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

  const CustomCheckbox = ({ id, checked, onChange, label }) => (
    <div className="flex items-center space-x-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
      />
      <label htmlFor={id} className="text-sm">{label}</label>
    </div>
  );

  return (
    <div className="flex mb-4">
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
        <div className="relative z-10 space-y-4">
          {/* First row */}
          <div className="flex items-center space-x-4">
            <Input
              value={character.initiative}
              onChange={(e) => handleChange('initiative', parseInt(e.target.value) || 0)}
              className="w-16"
              type="number"
              placeholder="Init"
            />
            <Select value={character.type} onValueChange={(value) => handleChange('type', value)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PC">PC</SelectItem>
                <SelectItem value="NPC">NPC</SelectItem>
                <SelectItem value="Enemy">Enemy</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={character.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="flex-grow"
              placeholder="Character Name"
            />
            <div className="flex items-center space-x-2">
              <Input
                value={character.currentHp}
                onChange={(e) => handleChange('currentHp', parseInt(e.target.value) || 0)}
                className="w-16"
                type="number"
                placeholder="Current HP"
              />
              <span>/</span>
              <Input
                value={character.maxHp}
                onChange={(e) => handleChange('maxHp', parseInt(e.target.value) || 0)}
                className="w-16"
                type="number"
                placeholder="Max HP"
              />
            </div>
          </div>

          {/* Second row */}
          <div className="flex items-center space-x-4">
            <CustomCheckbox
              id={`action-${character.id}`}
              checked={character.action}
              onChange={(checked) => handleChange('action', checked)}
              label="Action"
            />
            <CustomCheckbox
              id={`bonus-action-${character.id}`}
              checked={character.bonusAction}
              onChange={(checked) => handleChange('bonusAction', checked)}
              label="Bonus"
            />
            <CustomCheckbox
              id={`reaction-${character.id}`}
              checked={character.reaction}
              onChange={(checked) => handleChange('reaction', checked)}
              label="Reaction"
            />
            <div className="flex items-center space-x-2">
              <Input
                value={character.movement}
                onChange={(e) => handleChange('movement', parseInt(e.target.value) || 0)}
                className="w-16"
                type="number"
                placeholder="Movement"
              />
              <span className="text-sm">ft</span>
            </div>
          </div>

          {/* Third row */}
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={addCondition} variant="outline" size="sm">Add Condition</Button>
            {character.conditions.map((condition, index) => (
              <div key={index} className="flex items-center bg-white border border-gray-200 rounded overflow-hidden">
                <Input
                  value={condition.name}
                  onChange={(e) => updateCondition(index, 'name', e.target.value)}
                  className="w-24 border-0"
                  placeholder="Condition"
                />
                <Input
                  value={condition.duration}
                  onChange={(e) => updateCondition(index, 'duration', parseInt(e.target.value) || 0)}
                  className="w-12 border-0"
                  type="number"
                  placeholder="Rounds"
                />
                <button onClick={() => removeCondition(index)} className="px-2 flex items-center justify-center text-red-500 hover:bg-red-100">
                  <X size={16} />
                </button>
              </div>
            ))}
            <div className="flex-grow"></div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-red-500 hover:underline text-sm">Remove Character</button>
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
    </div>
  );
};

export default CharacterCard;