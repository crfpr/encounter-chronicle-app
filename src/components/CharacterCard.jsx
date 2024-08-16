import React from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { X } from 'lucide-react';

const CharacterCard = ({ character, updateCharacter, removeCharacter, isActive }) => {
  const getBackgroundColor = () => {
    if (character.type === 'PC') return 'bg-blue-100';
    if (character.type === 'Enemy') return 'bg-red-100';
    return 'bg-gray-100';
  };

  const getBorderColor = () => {
    if (character.type === 'PC') return 'border-blue-500';
    if (character.type === 'Enemy') return 'border-red-500';
    return 'border-gray-500';
  };

  // ... (keep all existing functions)

  return (
    <div className={`flex ${getBackgroundColor()} relative overflow-hidden rounded-lg`}>
      {/* Tab element */}
      <div className={`w-9 h-full ${isActive ? 'bg-black' : getBorderColor()}`}></div>
      
      <div className={`flex-grow p-4 relative`}>
        <div 
          className={`absolute inset-0 pointer-events-none ${getBorderColor()} ${character.currentHp / character.maxHp <= 0.25 ? 'animate-pulse' : ''}`} 
          style={{ borderWidth: '4px' }}
        ></div>
        <div className="relative z-10 space-y-4">
          {/* Keep the existing content here */}
          {/* First row */}
          <div className="flex items-end space-x-4">
            {/* ... (keep existing first row content) */}
          </div>

          {/* Second row */}
          <div className="flex items-center space-x-4">
            {/* ... (keep existing second row content) */}
          </div>

          {/* Third row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* ... (keep existing third row content) */}
          </div>

          {/* Fourth row - Inline Note */}
          <div className="mt-2">
            {/* ... (keep existing fourth row content) */}
          </div>

          {/* Fifth row */}
          <div className="flex justify-end mt-2">
            {/* ... (keep existing fifth row content) */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;