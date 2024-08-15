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
      <h2 className="text-xl font-semibold mb-4">Character Statistics</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Turn Count</TableHead>
            <TableHead>Round Count</TableHead>
            <TableHead>Cumulative Turn Time</TableHead>
            <TableHead>Average Turn Time</TableHead>
            <TableHead>Total Movement</TableHead>
            <TableHead>Total Damage Taken</TableHead>
            <TableHead>Action Count</TableHead>
            <TableHead>Bonus Action Count</TableHead>
            <TableHead>Reaction Count</TableHead>
            <TableHead>Conditions (Duration)</TableHead>
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
              <TableCell>{character.totalMovement || 0} ft</TableCell>
              <TableCell>{character.totalDamageTaken || 0}</TableCell>
              <TableCell>{character.actionCount || 0}</TableCell>
              <TableCell>{character.bonusActionCount || 0}</TableCell>
              <TableCell>{character.reactionCount || 0}</TableCell>
              <TableCell>
                {character.conditions.map((condition, index) => (
                  <div key={index}>
                    {condition.name} ({condition.duration})
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CharacterStats;