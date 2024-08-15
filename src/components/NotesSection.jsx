import React from 'react';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Copy } from 'lucide-react';

const NotesSection = ({ notes, setNotes }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(notes).then(() => {
      // You could add a toast notification here to confirm the copy action
      console.log('Notes copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy notes: ', err);
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 relative">
      <h2 className="text-xl font-semibold mb-2">Notes</h2>
      <Button 
        onClick={copyToClipboard} 
        className="absolute top-4 right-4"
        variant="outline"
        size="sm"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter encounter notes here..."
        className="w-full h-full min-h-[200px]"
      />
    </div>
  );
};

export default NotesSection;