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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs font-semibold">Name</TableHead>
            <TableHead className="text-xs font-semibold">Turns</TableHead>
            <TableHead className="text-xs font-semibold">Rounds</TableHead>
            <TableHead className="text-xs font-semibold">Turn avg.</TableHead>
            <TableHead className="text-xs font-semibold">Turn total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {characters.map((character) => (
            <TableRow key={character.id}>
              <TableCell>{character.name}</TableCell>
              <TableCell>{character.turnCount || 0}</TableCell>
              <TableCell>{round}</TableCell>
              <TableCell>
                {character.turnCount > 0
                  ? formatTime(Math.floor((character.cumulativeTurnTime || 0) / character.turnCount))
                  : '0:00'}
              </TableCell>
              <TableCell>{formatTime(character.cumulativeTurnTime || 0)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CharacterStats;