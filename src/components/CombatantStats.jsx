import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const CombatantStats = ({ combatants }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="[&>th]:p-2 [&>th]:text-xs [&>th]:font-semibold">
            <TableHead className="w-1/3">Name</TableHead>
            <TableHead className="text-right">Turns</TableHead>
            <TableHead className="text-right">Turn avg.</TableHead>
            <TableHead className="text-right">Turn total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {combatants.map((combatant) => (
            <TableRow key={combatant.id} className="[&>td]:p-2">
              <TableCell className="font-medium">
                <div className="truncate max-w-[120px]" title={combatant.name}>
                  {combatant.name}
                </div>
              </TableCell>
              <TableCell className="text-right">{combatant.turnCount || 0}</TableCell>
              <TableCell className="text-right">
                {combatant.turnCount > 0
                  ? formatTime(Math.floor((combatant.cumulativeTurnTime || 0) / combatant.turnCount))
                  : '0:00'}
              </TableCell>
              <TableCell className="text-right">{formatTime(combatant.cumulativeTurnTime || 0)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CombatantStats;