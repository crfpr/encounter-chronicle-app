import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const conditions = [
  'Blinded', 'Charmed', 'Deafened', 'Frightened', 'Grappled',
  'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified',
  'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious'
];

const ConditionTracker = ({ character, updateCharacter }) => {
  const addCondition = (condition, duration) => {
    const newConditions = [...character.conditions, { name: condition, duration }];
    updateCharacter({ ...character, conditions: newConditions });
  };

  const removeCondition = (index) => {
    const newConditions = character.conditions.filter((_, i) => i !== index);
    updateCharacter({ ...character, conditions: newConditions });
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Conditions</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {character.conditions.map((condition, index) => (
          <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
            <span className="mr-2">{condition.name} ({condition.duration})</span>
            <Button onClick={() => removeCondition(index)} variant="ghost" size="sm" className="p-0 h-auto">
              &times;
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Select onValueChange={(value) => addCondition(value, '1')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Add condition" />
          </SelectTrigger>
          <SelectContent>
            {conditions.map((condition) => (
              <SelectItem key={condition} value={condition}>{condition}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Duration"
          className="w-24"
          onChange={(e) => {
            const selectedCondition = document.querySelector('.select-value').textContent;
            addCondition(selectedCondition, e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default ConditionTracker;