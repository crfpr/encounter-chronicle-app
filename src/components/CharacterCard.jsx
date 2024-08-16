import React from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

const CharacterCard = ({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn }) => {
  const handleChange = (field, value) => {
    let updatedCharacter = { ...character, [field]: value };

    if (field === 'currentMovement') {
      updatedCharacter.currentMovement = Math.min(value, character.maxMovement);
    }

    if (field === 'maxMovement' && value < character.currentMovement) {
      updatedCharacter.currentMovement = value;
    }

    updateCharacter(updatedCharacter);
  };

  const addCondition = () => {
    const newCondition = { name: 'New Condition', duration: '1' };
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
      case 'Enemy': return 'bg-gray-300';
      default: return 'bg-white';
    }
  };

  const getBorderColor = () => {
    if (isActive) {
      return 'border-black';
    }
    const hpPercentage = (character.currentHp / character.maxHp) * 100;
    if (hpPercentage <= 25) {
      return 'border-red-600';
    } else if (hpPercentage <= 50) {
      return 'border-yellow-600';
    }
    return 'border-gray-200';
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-stretch space-x-2">
      <div className="w-16 flex flex-col items-center justify-center">
        {isActive && (
          <>
            <Button onClick={onPreviousTurn} variant="ghost" size="icon" className="p-0 mb-2">
              <ChevronUp className="h-6 w-6" />
            </Button>
            <div className="flex flex-col items-center">
              <div className="text-sm font-semibold">{formatTime(turnTime)}</div>
            </div>
            <Button onClick={onNextTurn} variant="ghost" size="icon" className="p-0 mt-2">
              <ChevronDown className="h-6 w-6" />
            </Button>
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
          <div className="space-y-1">
            <div className="flex items-center space-x-4">
              <div className="w-16 text-xs">Init.</div>
              <div className="w-[100px] text-xs">Type</div>
              <div className="flex-grow text-xs">Name</div>
              <div className="w-[300px] flex text-xs">
                <div className="w-16"></div>
                <div className="w-32 ml-2"></div>
              </div>
              <div className="w-16 text-xs">AC</div>
            </div>
            <div className="flex items-center space-x-4">
              <Input
                value={character.initiative}
                onChange={(e) => handleChange('initiative', parseInt(e.target.value) || 0)}
                className="w-16"
                type="number"
              />
              <Select value={character.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
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
              />
              <div className="w-[300px] flex items-end space-x-2">
                <div className="flex flex-col items-start w-16">
                  <div className="text-xs mb-1">Temp HP</div>
                  <Input
                    value={character.tempHp || 0}
                    onChange={(e) => handleChange('tempHp', parseInt(e.target.value) || 0)}
                    className="w-full"
                    type="number"
                  />
                </div>
                <div className="flex flex-col items-start ml-2 flex-grow">
                  <div className="text-xs mb-1">HP</div>
                  <div className="flex items-center space-x-2 w-full">
                    <Input
                      value={character.currentHp}
                      onChange={(e) => handleChange('currentHp', parseInt(e.target.value) || 0)}
                      className="w-16"
                      type="number"
                    />
                    <span>/</span>
                    <Input
                      value={character.maxHp}
                      onChange={(e) => handleChange('maxHp', parseInt(e.target.value) || 0)}
                      className="w-16"
                      type="number"
                    />
                  </div>
                </div>
              </div>
              <Input
                value={character.ac}
                onChange={(e) => handleChange('ac', parseInt(e.target.value) || 0)}
                className="w-16 text-center"
                type="number"
                min="0"
                max="99"
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
                value={character.currentMovement}
                onChange={(e) => handleChange('currentMovement', parseInt(e.target.value) || 0)}
                className="w-16"
                type="number"
              />
              <span>/</span>
              <Input
                value={character.maxMovement}
                onChange={(e) => handleChange('maxMovement', parseInt(e.target.value) || 0)}
                className="w-16"
                type="number"
              />
              <span className="text-sm">ft</span>
            </div>
          </div>

          {/* Third row */}
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={addCondition} variant="outline" size="sm" className="h-9">Add Condition</Button>
            {character.conditions.map((condition, index) => (
              <div key={index} className="flex items-center bg-gray-100 rounded h-9 overflow-hidden">
                <input
                  value={condition.name}
                  onChange={(e) => updateCondition(index, 'name', e.target.value)}
                  className="bg-transparent border-none focus:outline-none px-2 w-full max-w-[150px] text-sm"
                  placeholder="Condition"
                  maxLength={25}
                />
                <Select
                  value={condition.duration}
                  onValueChange={(value) => updateCondition(index, 'duration', value)}
                >
                  <SelectTrigger className="w-14 h-full border-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                    ))}
                    <SelectItem value="P">P</SelectItem>
                  </SelectContent>
                </Select>
                <button onClick={() => removeCondition(index)} className="px-2 h-full flex items-center justify-center text-gray-500 hover:bg-gray-200">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Fourth row - Inline Note */}
          <div className="mt-2">
            <textarea
              value={character.note || ''}
              onChange={(e) => handleChange('note', e.target.value)}
              className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-md"
              placeholder="Add notes for this character..."
              rows="2"
            />
          </div>

          {/* Fifth row */}
          <div className="flex justify-end mt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="text-red-500 hover:underline text-sm">Delete Character</button>
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
                    Yes, delete character
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