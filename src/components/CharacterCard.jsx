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
    <div className="flex flex-col relative">
      <label htmlFor={id} className="absolute -top-4 left-0 text-xs">{label}</label>
      <div
        id={id}
        className={`h-[38px] w-[38px] rounded cursor-pointer flex items-center justify-center ${
          checked ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-200'
        } border`}
        onClick={() => onChange(!checked)}
      >
        {checked && <span className="text-gray-700">✓</span>}
      </div>
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
      <div className={`flex-grow pt-8 px-6 pb-6 rounded-lg ${getBackgroundColor()} relative overflow-hidden`}>
        <div 
          className={`absolute inset-0 rounded-lg pointer-events-none ${getBorderColor()} ${character.currentHp / character.maxHp <= 0.25 ? 'animate-pulse' : ''}`} 
          style={{ borderWidth: '4px' }}
        ></div>
        <div className="relative z-10 space-y-4">
          {/* ... (previous input fields remain unchanged) ... */}
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={addCondition} variant="outline" size="sm" className="h-[38px]">Add Condition</Button>
            {character.conditions.map((condition, index) => (
              <div key={index} className="flex items-center bg-white border border-gray-200 rounded h-[38px] overflow-hidden">
                <Input
                  value={condition.name}
                  onChange={(e) => updateCondition(index, 'name', e.target.value)}
                  className="w-24 h-full border-0"
                />
                <Input
                  value={condition.duration}
                  onChange={(e) => updateCondition(index, 'duration', parseInt(e.target.value) || 0)}
                  className="w-12 h-full border-0"
                  type="number"
                />
                <button onClick={() => removeCondition(index)} className="px-2 h-full flex items-center justify-center text-red-500 hover:bg-red-100">
                  <X size={16} />
                </button>
              </div>
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