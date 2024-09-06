import React, { useState, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Clock, X } from 'lucide-react';

const TokenInput = ({ token, onLabelChange, onDurationChange, onRemove, onTogglePersistent }) => {
  const [isLabelEditing, setIsLabelEditing] = useState(false);
  const [localLabel, setLocalLabel] = useState(token.label);
  const [isDurationEditing, setIsDurationEditing] = useState(false);
  const labelInputRef = useRef(null);
  const durationInputRef = useRef(null);

  useEffect(() => {
    if (isLabelEditing && labelInputRef.current) {
      labelInputRef.current.focus();
    }
  }, [isLabelEditing]);

  useEffect(() => {
    if (isDurationEditing && durationInputRef.current) {
      durationInputRef.current.focus();
    }
  }, [isDurationEditing]);

  const handleLabelClick = () => {
    setIsLabelEditing(true);
  };

  const handleLabelChange = (e) => {
    setLocalLabel(e.target.value);
  };

  const handleLabelBlur = () => {
    setIsLabelEditing(false);
    onLabelChange(localLabel);
  };

  const handleClockClick = () => {
    if (token.isPersistent) {
      setIsDurationEditing(true);
      onTogglePersistent();
    } else {
      setIsDurationEditing(true);
    }
  };

  const handleDurationChange = (e) => {
    const newDuration = e.target.value === '' ? null : parseInt(e.target.value, 10);
    onDurationChange(newDuration);
  };

  const handleDurationBlur = () => {
    setIsDurationEditing(false);
    if (token.tokenDuration === null) {
      onTogglePersistent();
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {isLabelEditing ? (
        <Input
          ref={labelInputRef}
          type="text"
          value={localLabel}
          onChange={handleLabelChange}
          onBlur={handleLabelBlur}
          className="h-5 px-1 text-xs bg-transparent border-none focus:outline-none focus:ring-0"
          maxLength={30}
        />
      ) : (
        <span onClick={handleLabelClick} className="cursor-pointer text-xs">
          {localLabel}
        </span>
      )}
      <Button
        onClick={handleClockClick}
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 hover:bg-zinc-700 dark:hover:bg-zinc-700 group"
      >
        <Clock className="h-3 w-3 group-hover:text-white" />
      </Button>
      {isDurationEditing && !token.isPersistent && (
        <Input
          ref={durationInputRef}
          type="number"
          value={token.tokenDuration || ''}
          onChange={handleDurationChange}
          onBlur={handleDurationBlur}
          className="w-8 h-5 px-1 text-xs text-center bg-transparent border-none focus:outline-none focus:ring-0"
          min="0"
        />
      )}
      <Button
        onClick={onRemove}
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 hover:bg-zinc-700 dark:hover:bg-zinc-700"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default TokenInput;