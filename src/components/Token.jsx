import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

const Token = ({ label, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(label);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onUpdate(text);
    }
  };

  const truncatedText = text.length > 20 ? text.slice(0, 20) + '...' : text;

  return (
    <Button
      variant="secondary"
      className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm mr-2 h-[30px] max-w-[200px]"
      onClick={handleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none text-center w-full"
          style={{ maxWidth: '160px' }}
        />
      ) : (
        <span className="flex-grow text-center truncate">{truncatedText}</span>
      )}
      <X
        size={14}
        className="ml-2 cursor-pointer flex-shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      />
    </Button>
  );
};

export default Token;