import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Token = ({ label, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(label);
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
    if (editedLabel.trim() !== label) {
      onUpdate(editedLabel.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <Button
      variant="secondary"
      className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm mr-2 h-[30px]"
      onClick={handleClick}
    >
      {isEditing ? (
        <Input
          ref={inputRef}
          type="text"
          value={editedLabel}
          onChange={(e) => setEditedLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="h-6 px-1 py-0 text-sm"
        />
      ) : (
        <span className="flex-grow text-center">{label}</span>
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