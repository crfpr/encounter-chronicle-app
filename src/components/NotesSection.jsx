import React from 'react';
import { Textarea } from '../components/ui/textarea';

const NotesSection = ({ notes, setNotes }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Notes</h2>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter encounter notes here..."
        className="w-full h-full min-h-[300px]"
      />
    </div>
  );
};

export default NotesSection;