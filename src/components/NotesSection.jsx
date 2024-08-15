import React from 'react';
import { Textarea } from '../components/ui/textarea';

const NotesSection = ({ notes, setNotes }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Notes</h2>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter encounter notes here..."
        className="w-full h-32"
      />
    </div>
  );
};

export default NotesSection;