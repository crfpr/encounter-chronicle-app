import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { debounce } from 'lodash';
import { Button } from './ui/button';
import { Clock, X } from 'lucide-react';

const TokenInput = React.memo(({ token, onLabelChange, onDurationChange, onRemove, onTogglePersistent }) => {
  const [localLabel, setLocalLabel] = useState(token.label);
  const [inputWidth, setInputWidth] = useState(40);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const durationInputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const textWidth = getTextWidth(localLabel || 'Token', getComputedStyle(inputRef.current).font);
      setInputWidth(Math.max(40, Math.min(textWidth + 8, 120))); // Min 40px, max 120px
    }
  }, [localLabel]);

  const getTextWidth = (text, font) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
  };

  const debouncedOnLabelChange = debounce((newLabel) => {
    onLabelChange(newLabel);
  }, 300);

  const handleChange = (e) => {
    const newLabel = e.target.value.slice(0, 30);
    setLocalLabel(newLabel);
    debouncedOnLabelChange(newLabel);
  };

  const handleFocus = () => {
    if (localLabel === 'Token') {
      setLocalLabel('');
    }
  };

  const handleBlur = () => {
    if (localLabel.trim() === '') {
      setLocalLabel('Token');
    }
  };

  const handleDurationChange = (e) => {
    const newDuration = e.target.value === '' ? null : parseInt(e.target.value, 10);
    onDurationChange(newDuration);
  };

  const handleDurationBlur = () => {
    if (token.tokenDuration === null) {
      onTogglePersistent();
      setIsEditing(false);
    }
  };

  const handleTogglePersistent = () => {
    if (token.isPersistent) {
      setIsEditing(true);
      setTimeout(() => {
        if (durationInputRef.current) {
          durationInputRef.current.focus();
        }
      }, 0);
    } else {
      onTogglePersistent();
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <Input
        ref={inputRef}
        type="text"
        value={localLabel}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="h-5 px-1 text-xs bg-transparent border-none focus:outline-none focus:ring-0 overflow-visible"
        style={{ width: `${inputWidth}px`, minWidth: '40px' }}
        maxLength={30}
        placeholder="Token"
      />
      {isEditing && !token.isPersistent ? (
        <Input
          ref={durationInputRef}
          type="number"
          value={token.tokenDuration || ''}
          onChange={handleDurationChange}
          onBlur={handleDurationBlur}
          className="w-8 h-5 px-1 text-xs text-center bg-transparent border-none focus:outline-none focus:ring-0 no-spinners"
          min="0"
          placeholder=""
        />
      ) : (
        <Button
          onClick={handleTogglePersistent}
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 hover:bg-zinc-700 dark:hover:bg-zinc-700 group"
        >
          <Clock className="h-3 w-3 group-hover:text-white" />
        </Button>
      )}
      <Button
        onClick={() => onRemove(token.id)}
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 hover:bg-zinc-700 dark:hover:bg-zinc-700"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
});

export default TokenInput;