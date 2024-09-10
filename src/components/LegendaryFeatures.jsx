import React from 'react';
import { Button } from './ui/button';
import { Label } from "./ui/label";
import { cn } from "../lib/utils";

const LegendaryFeatures = ({ character, updateCharacter, isMobile }) => {
  const handleLegendaryActionToggle = (index) => {
    const updatedActions = [...(character.legendaryActions || [])];
    updatedActions[index] = !updatedActions[index];
    updateCharacter({ ...character, legendaryActions: updatedActions });
  };

  const handleLegendaryResistanceToggle = (index) => {
    const updatedResistances = [...(character.legendaryResistances || [])];
    updatedResistances[index] = !updatedResistances[index];
    updateCharacter({ ...character, legendaryResistances: updatedResistances });
  };

  const renderCounter = (label, count, usedCount, onToggle) => {
    return (
      <div className={`flex items-center space-x-2 h-[30px] ${isMobile ? 'flex-col items-start space-y-1' : ''}`}>
        <Label className="text-sm font-semibold w-36">{label}</Label>
        <div className="flex space-x-1">
          {[...Array(count)].map((_, index) => (
            <Button
              key={index}
              onClick={() => onToggle(index)}
              variant="outline"
              size="sm"
              className={cn(
                "w-5 h-5 p-0 rounded-full",
                index < usedCount
                  ? "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-800"
                  : "bg-zinc-200 dark:bg-zinc-800"
              )}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {(character.state === 'alive' || character.state === 'ko' || character.state === 'stable') &&
        renderCounter('Legendary Actions', 3, (character.legendaryActions || []).filter(Boolean).length, handleLegendaryActionToggle)}
      {renderCounter('Legendary Resistances', 3, (character.legendaryResistances || []).filter(Boolean).length, handleLegendaryResistanceToggle)}
    </div>
  );
};

export default LegendaryFeatures;