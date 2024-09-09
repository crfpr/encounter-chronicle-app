import React, { useState, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Clock, X } from 'lucide-react';
import { useNumericInput } from '../hooks/useNumericInput';

const TokenInput = ({ token, onLabelChange, onDurationChange, onRemove, onTogglePersistent }) => {
  const [isLabelEditing, setIsLabelEditing] = useState(false);
  const [isDurationEditing, setIsDurationEditing] = useState(false);
  const [localLabel, setLocalLabel] = useState(token.label);
  const labelInputRef = useRef(null);
  const durationInputRef = useRef(null);

  const [localDuration, handleDurationChange, handleDurationKeyDown, setLocalDuration] = useNumericInput(token.tokenDuration, 0);

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

  useEffect(() => {
    setLocalDuration(token.tokenDuration);
  }, [token.tokenDuration, setLocalDuration]);

  const handleLabelClick = () => setIsLabelEditing(true);
  const handleLabelChange = (e) => setLocalLabel(e.target.value);
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

  const handleDurationBlur = () => {
    setIsDurationEditing(false);
    onDurationChange(localDuration === '' ? null : parseInt(localDuration, 10));
    if (localDuration === '') {
      onTogglePersistent();
    }
  };

  const handleDurationKeyDownWrapper = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleDurationBlur();
      e.target.blur();
    } else {
      handleDurationKeyDown(e);
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
          className="h-5 px-2 text-xs bg-transparent border-none focus:outline-none focus:ring-0"
          maxLength={30}
        />
      ) : (
        <span onClick={handleLabelClick} className="cursor-pointer text-xs pl-1">
          {localLabel}
        </span>
      )}
      {isDurationEditing || !token.isPersistent ? (
        <Input
          ref={durationInputRef}
          type="text"
          inputMode="numeric"
          value={localDuration || ''}
          onChange={handleDurationChange}
          onKeyDown={handleDurationKeyDownWrapper}
          onBlur={handleDurationBlur}
          className="w-8 h-5 px-1 text-xs text-center bg-transparent border-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min="0"
        />
      ) : (
        <Button
          onClick={handleClockClick}
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 hover:bg-zinc-700 dark:hover:bg-zinc-700 group"
        >
          <Clock className="h-3 w-3 group-hover:text-white" />
        </Button>
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