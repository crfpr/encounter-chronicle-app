import React from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

const CharacterCard = ({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn }) => {
  const getBackgroundColor = () => {
    switch (character.type) {
      case 'PC': return 'bg-blue-100';
      case 'NPC': return 'bg-gray-100';
      default: return 'bg-red-100';
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-md ${getBackgroundColor()} ${isActive ? 'border-2 border-black' : ''}`}>
      <div className="flex items-center space-x-2 mb-2">
        {isActive && (
          <>
            <Button onClick={onPreviousTurn}>
              <ChevronUp className="h-4 w-4" />
            </Button>
            <div>{Math.floor(turnTime / 60)}:{(turnTime % 60).toString().padStart(2, '0')}</div>
            <Button onClick={onNextTurn}>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <Input
          type="number"
          value={character.initiative}
          onChange={(e) => updateCharacter({ ...character, initiative: parseInt(e.target.value) })}
          className="w-16 text-center"
        />
        <Select
          value={character.type}
          onValueChange={(value) => updateCharacter({ ...character, type: value })}
        >
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
          onChange={(e) => updateCharacter({ ...character, name: e.target.value })}
          className="font-bold text-lg flex-grow"
        />
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={character.currentHp}
            onChange={(e) => updateCharacter({ ...character, currentHp: parseInt(e.target.value) })}
            className="w-16 text-center"
          />
          <span>/</span>
          <Input
            type="number"
            value={character.maxHp}
            onChange={(e) => updateCharacter({ ...character, maxHp: parseInt(e.target.value) })}
            className="w-16 text-center"
          />
        </div>
        <Input
          type="number"
          value={character.ac}
          onChange={(e) => updateCharacter({ ...character, ac: parseInt(e.target.value) })}
          className="w-16 text-center"
        />
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <Button
          variant={character.action ? "default" : "outline"}
          onClick={() => updateCharacter({ ...character, action: !character.action })}
          className="flex-grow"
        >
          Action
        </Button>
        <Button
          variant={character.bonusAction ? "default" : "outline"}
          onClick={() => updateCharacter({ ...character, bonusAction: !character.bonusAction })}
          className="flex-grow"
        >
          Bonus Action
        </Button>
        <Button
          variant={character.reaction ? "default" : "outline"}
          onClick={() => updateCharacter({ ...character, reaction: !character.reaction })}
          className="flex-grow"
        >
          Reaction
        </Button>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={character.currentMovement}
            onChange={(e) => updateCharacter({ ...character, currentMovement: parseInt(e.target.value) })}
            className="w-16 text-center"
          />
          <span>/</span>
          <Input
            type="number"
            value={character.maxMovement}
            onChange={(e) => updateCharacter({ ...character, maxMovement: parseInt(e.target.value) })}
            className="w-16 text-center"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {character.conditions.map((condition, index) => (
          <div key={index} className="flex items-center bg-gray-200 rounded px-2 py-1">
            <span>{condition.name}</span>
            <Select
              value={condition.duration}
              onValueChange={(value) => {
                const updatedConditions = [...character.conditions];
                updatedConditions[index].duration = value;
                updateCharacter({ ...character, conditions: updatedConditions });
              }}
            >
              <SelectTrigger className="w-[60px] ml-2">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                ))}
                <SelectItem value="P">P</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const updatedConditions = character.conditions.filter((_, i) => i !== index);
                updateCharacter({ ...character, conditions: updatedConditions });
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newCondition = { name: 'New Condition', duration: '1' };
            updateCharacter({ ...character, conditions: [...character.conditions, newCondition] });
          }}
        >
          Add Condition
        </Button>
      </div>

      <div className="mb-2">
        <Input
          value={character.notes || ''}
          onChange={(e) => updateCharacter({ ...character, notes: e.target.value })}
          placeholder="Add notes here..."
        />
      </div>

      <div className="flex justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Delete Character
            </Button>
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
  );
};

export default CharacterCard;