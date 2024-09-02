import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronUp, ChevronDown, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Token = ({ label, duration, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(label);
  const [editedDuration, setEditedDuration] = useState(duration);
  const [isTimed, setIsTimed] = useState(duration !== null);
  const tokenRef = useRef(null);
  const inputRef = useRef(null);
  const durationInputRef = useRef(null);

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

  useEffect(() => {
    setEditedLabel(label);
    setEditedDuration(duration);
    setIsTimed(duration !== null);
  }, [label, duration]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editedLabel.trim() !== label || editedDuration !== duration) {
      onUpdate(editedLabel.trim(), isTimed ? editedDuration : null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      if (isTimed) {
        durationInputRef.current?.focus();
      } else {
        handleBlur();
      }
    }
  };

  const handleDurationKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newDuration = Math.min(99, (editedDuration || 0) + 1);
      setEditedDuration(newDuration);
      onUpdate(editedLabel, newDuration);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newDuration = Math.max(0, (editedDuration || 0) - 1);
      setEditedDuration(newDuration);
      onUpdate(editedLabel, newDuration);
    }
    // Block navigation keys
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.stopPropagation();
    }
  };

  const toggleTimed = () => {
    setIsTimed(!isTimed);
    if (!isTimed) {
      setEditedDuration(1);
      onUpdate(editedLabel, 1);
    } else {
      onUpdate(editedLabel, null);
    }
  };

  return (
    <div ref={tokenRef}>
      <Button
        variant="secondary"
        className="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm mr-2 h-[30px] bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-400 dark:hover:bg-zinc-700"
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
              className="h-6 px-1 py-0 text-sm mr-1 bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800"
            />
            {isTimed ? (
              <Input
                ref={durationInputRef}
                type="text"
                inputMode="numeric"
                value={editedDuration}
                onChange={(e) => {
                  const newDuration = Math.max(0, Math.min(99, parseInt(e.target.value) || 0));
                  setEditedDuration(newDuration);
                  onUpdate(editedLabel, newDuration);
                }}
                onKeyDown={handleDurationKeyDown}
                className="h-6 w-12 px-1 py-0 text-sm bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-800"
                min="0"
                max="99"
              />
            ) : (
              <Clock
                size={14}
                className="ml-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTimed();
                }}
              />
            )}
          </>
        ) : (
          <>
            <span className="flex-grow text-center mr-1">{editedLabel}</span>
            {isTimed ? (
              <span className="bg-zinc-200 dark:bg-zinc-700 rounded-full px-2 py-0.5 text-xs font-semibold">
                {editedDuration}
              </span>
            ) : (
              <Clock size={14} className="ml-1" />
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