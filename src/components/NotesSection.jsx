import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Copy } from 'lucide-react';

const NotesSection = ({ notes, setNotes, isMobile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isMobile) {
      setIsEditing(false);
      adjustContainerHeight();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      window.addEventListener('resize', adjustContainerHeight);
      return () => window.removeEventListener('resize', adjustContainerHeight);
    }
  }, [isMobile]);

  const adjustContainerHeight = () => {
    if (containerRef.current) {
      const viewportHeight = window.innerHeight;
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const footerHeight = 56; // Assuming the mobile menu height is 56px
      const paddingBottom = 20; // Added padding at the bottom
      const maxHeight = viewportHeight - containerTop - footerHeight - paddingBottom;
      containerRef.current.style.height = `${maxHeight}px`;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(notes).then(() => {
      console.log('Notes copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy notes: ', err);
    });
  };

  const handleTextareaClick = () => {
    if (isMobile && !isEditing) {
      setIsEditing(true);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const containerClasses = isMobile
    ? "flex flex-col relative overflow-hidden pb-5" // Added pb-5 for bottom padding
    : "bg-white border border-black rounded-lg p-6";

  const textareaClasses = isMobile
    ? "w-full h-full flex-grow resize-none p-4"
    : "w-full h-full min-h-[200px] pr-20";

  return (
    <div ref={containerRef} className={containerClasses}>
      {!isMobile && <h2 className="text-xl font-semibold mb-4">Notes</h2>}
      <div className="relative flex-grow overflow-hidden">
        <Textarea
          ref={textareaRef}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter encounter notes here..."
          className={textareaClasses}
          readOnly={isMobile && !isEditing}
          onClick={handleTextareaClick}
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