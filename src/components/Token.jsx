import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Token = ({ label, value, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(label);
  const [editedValue, setEditedValue] = useState(value);
  const tokenRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tokenRef.current && !tokenRef.current.contains(event.target)) {
        handleBlur();
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editedLabel.trim() !== label || editedValue !== value) {
      onUpdate(editedLabel.trim(), editedValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const incrementValue = () => {
    setEditedValue(prev => Math.min(10, prev + 1));
  };

  const decrementValue = () => {
    setEditedValue(prev => Math.max(1, prev - 1));
  };

  return (
    <div ref={tokenRef}>
      <Button
        variant="secondary"
        className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm mr-2 h-[30px]"
        onClick={handleClick}
      >
        {isEditing ? (
          <>
            <Input
              ref={inputRef}
              type="text"
              value={editedLabel}
              onChange={(e) => setEditedLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-6 px-1 py-0 text-sm mr-1"
            />
            <Input
              type="number"
              value={editedValue}
              onChange={(e) => setEditedValue(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              onKeyDown={handleKeyDown}
              className="h-6 w-12 px-1 py-0 text-sm"
            />
            {isEditing && (
              <div className="flex flex-col ml-1">
                <ChevronUp
                  size={14}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    incrementValue();
                  }}
                />
                <ChevronDown
                  size={14}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    decrementValue();
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <span className="flex-grow text-center mr-1">{label}</span>
            {value && (
              <span className="bg-gray-200 rounded-full px-2 py-0.5 text-xs font-semibold">
                {value}
              </span>
            )}
          </>
        )}
        <X
          size={14}
          className="ml-1 cursor-pointer flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      </Button>
    </div>
  );
};

export default Token;