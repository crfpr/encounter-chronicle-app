import React from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

const CharacterCard = ({ character, updateCharacter, removeCharacter, isActive, turnTime, onPreviousTurn, onNextTurn }) => {
  // ... (keep all existing code up to the Fifth row)

  {/* Fifth row */}
  <div className="flex justify-end mt-2">
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className={`text-sm px-2 py-1 rounded ${
          character.type === 'PC' ? 'bg-blue-200 text-blue-800 hover:bg-blue-300' :
          character.type === 'NPC' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' :
          'bg-gray-400 text-gray-800 hover:bg-gray-500'
        }`}>
          Delete Character
        </button>
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

  // ... (keep all closing tags and export statement)