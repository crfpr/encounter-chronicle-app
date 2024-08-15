import React from 'react';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const CharacterCard = ({ character, updateCharacter }) => {
  const handleChange = (field, value) => {
    updateCharacter({ ...character, [field]: value });
  };

  const addCondition = () => {
    const newCondition = { name: 'New Condition', duration: 1 };
    handleChange('conditions', [...character.conditions, newCondition]);
  };

  const removeCondition = (index) => {
    const updatedConditions = character.conditions.filter((_, i) => i !== index);
    handleChange('conditions', updatedConditions);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Input
          value={character.initiative}
          onChange={(e) => handleChange('initiative', e.target.value)}
          className="w-16"
        />
        <Select value={character.type} onValueChange={(value) => handleChange('type', value)}>
          <SelectTrigger className="w-24">
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
        />
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <Input
          value={character.currentHp}
          onChange={(e) => handleChange('currentHp', e.target.value)}
          className="w-16"
        />
        <span>/</span>
        <Input
          value={character.maxHp}
          onChange={(e) => handleChange('maxHp', e.target.value)}
          className="w-16"
        />
        <Checkbox
          checked={character.action}
          onCheckedChange={(checked) => handleChange('action', checked)}
          id={`action-${character.id}`}
        />
        <label htmlFor={`action-${character.id}`}>Action</label>
        <Checkbox
          checked={character.bonusAction}
          onCheckedChange={(checked) => handleChange('bonusAction', checked)}
          id={`bonus-action-${character.id}`}
        />
        <label htmlFor={`bonus-action-${character.id}`}>Bonus Action</label>
        <Input
          value={character.movement}
          onChange={(e) => handleChange('movement', e.target.value)}
          className="w-16"
        />
        <span>ft</span>
        <Checkbox
          checked={character.reaction}
          onCheckedChange={(checked) => handleChange('reaction', checked)}
          id={`reaction-${character.id}`}
        />
        <label htmlFor={`reaction-${character.id}`}>Reaction</label>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={addCondition} variant="outline" size="sm">Add Condition</Button>
        {character.conditions.map((condition, index) => (
          <Badge key={index} variant="secondary" className="px-2 py-1">
            {condition.name} ({condition.duration})
            <button onClick={() => removeCondition(index)} className="ml-2 text-red-500">×</button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CharacterCard;