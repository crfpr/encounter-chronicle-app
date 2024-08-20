import React from 'react';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Copy } from 'lucide-react';

const NotesSection = ({ notes, setNotes, isMobile }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(notes).then(() => {
      console.log('Notes copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy notes: ', err);
    });
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-2">Notes</h2>
      <div className="relative flex-grow">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter encounter notes here..."
          className="w-full h-full resize-none p-2"
        />
        <Button 
          onClick={copyToClipboard} 
          className="absolute top-2 right-2"
          variant="outline"
          size="sm"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
      </div>
    </div>
  );
};

export default NotesSection;