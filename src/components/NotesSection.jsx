import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Copy, Edit } from 'lucide-react';

const NotesSection = ({ notes, setNotes, isMobile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isMobile) {
      setIsEditing(false);
    }
  }, [isMobile]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(notes).then(() => {
      console.log('Notes copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy notes: ', err);
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const containerClasses = isMobile
    ? "flex flex-col h-full relative"
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
          readOnly={isMobile && !isEditing}
        />
        {isMobile && !isEditing && (
          <div 
            className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center"
            onClick={handleEditClick}
          >
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Tap to edit notes
            </Button>
          </div>
        )}
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