import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Clock } from 'lucide-react';

const TokenInput = ({ token, onLabelChange, onDurationChange, onToggleDuration }) => {
  const [inputWidth, setInputWidth] = useState(40);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(token.label);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const textWidth = getTextWidth(token.label, getComputedStyle(inputRef.current).font);
      setInputWidth(Math.max(40, Math.min(textWidth + 8, 120))); // Min 40px, max 120px
    }
  }, [token.label]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const getTextWidth = (text, font) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
  };

  const handleLabelClick = () => {
    setIsEditing(true);
  };

  const handleLabelChange = (e) => {
    setEditedLabel(e.target.value);
  };

  const handleLabelBlur = () => {
    setIsEditing(false);
    onLabelChange(editedLabel);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLabelBlur();
    }
  };

  return (
    <>
      {isEditing ? (
        <Input
          ref={inputRef}
          type="text"
          value={editedLabel}
          onChange={handleLabelChange}
          onBlur={handleLabelBlur}
          onKeyDown={handleKeyDown}
          className="h-5 px-1 text-xs bg-transparent border-none focus:outline-none focus:ring-0 overflow-visible"
          style={{ width: `${inputWidth}px`, minWidth: '40px' }}
          maxLength={30}
        />
      ) : (
        <span onClick={handleLabelClick} className="cursor-text">
          {token.label}
        </span>
      )}
      {token.showDuration ? (
        <Input
          type="number"
          value={token.tokenDuration || ''}
          onChange={(e) => onDurationChange(e.target.value)}
          className="w-8 h-5 px-1 text-xs text-center bg-transparent border-none focus:outline-none focus:ring-0 no-spinners"
          min="1"
          placeholder=""
        />
      ) : (
        <Button
          onClick={onToggleDuration}
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 hover:bg-zinc-700 dark:hover:bg-zinc-700 group"
        >
          <Clock className="h-3 w-3 group-hover:text-white" />
        </Button>
      )}
    </>
  );
};

export default TokenInput;