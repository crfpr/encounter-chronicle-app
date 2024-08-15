import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const CharacterStats = ({ characters, round }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Character Statistics</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/5">Name</TableHead>
            <TableHead className="w-1/5">Turn Count</TableHead>
            <TableHead className="w-1/5">Round Count</TableHead>
            <TableHead className="w-1/5">Cumulative Turn Time</TableHead>
            <TableHead className="w-1/5">Average Turn Time</TableHead>
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