import React, { useEffect, useRef } from 'react';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Copy } from 'lucide-react';

const NotesSection = ({ notes, setNotes, isMobile }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isMobile && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isMobile]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(notes).then(() => {
      console.log('Notes copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy notes: ', err);
    });
  };

  const containerClasses = isMobile
    ? "flex flex-col h-full"
    : "bg-white border border-black rounded-lg p-6";

  const textareaClasses = isMobile
    ? "w-full h-full flex-grow resize-none p-4"
    : "w-full h-full min-h-[200px] pr-20";

  return (
    <div className={containerClasses}>
      <h2 className="text-xl font-semibold mb-4 px-4 pt-4">Notes</h2>
      <div className="relative flex-grow">
        <Textarea
          ref={textareaRef}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter encounter notes here..."
          className={textareaClasses}
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