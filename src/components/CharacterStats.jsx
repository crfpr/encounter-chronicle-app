import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const CharacterStats = ({ characters, round }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Character Statistics</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs font-semibold">Name</TableHead>
            <TableHead className="text-xs font-semibold">Turn Count</TableHead>
            <TableHead className="text-xs font-semibold">Round Count</TableHead>
            <TableHead className="text-xs font-semibold">Cumulative Turn Time</TableHead>
            <TableHead className="text-xs font-semibold">Average Turn Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {characters.map((character) => (
            <TableRow key={character.id}>
              <TableCell>{character.name}</TableCell>
              <TableCell>{character.turnCount || 0}</TableCell>
              <TableCell>{round}</TableCell>
              <TableCell>{formatTime(character.cumulativeTurnTime || 0)}</TableCell>
              <TableCell>
                {character.turnCount > 0
                  ? formatTime(Math.floor((character.cumulativeTurnTime || 0) / character.turnCount))
                  : '0:00'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CharacterStats;