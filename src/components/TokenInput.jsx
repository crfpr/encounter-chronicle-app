import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from './ui/input';
import { debounce } from 'lodash';

const TokenInput = React.memo(({ token, onLabelChange, isNew, onFocus }) => {
  const [localLabel, setLocalLabel] = useState(token.label);
  const [inputWidth, setInputWidth] = useState(40);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const textWidth = getTextWidth(localLabel || 'Token', getComputedStyle(inputRef.current).font);
      setInputWidth(Math.max(40, Math.min(textWidth + 8, 120))); // Min 40px, max 120px
    }
    if (isNew) {
      setLocalLabel('');
      inputRef.current?.focus();
    }
  }, [localLabel, isNew]);

  const getTextWidth = useCallback((text, font) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
  }, []);

  const debouncedOnLabelChange = useCallback(
    debounce((newLabel) => {
      onLabelChange(token.id, newLabel);
    }, 300),
    [token.id, onLabelChange]
  );

  const handleChange = useCallback((e) => {
    const newLabel = e.target.value.slice(0, 30);
    setLocalLabel(newLabel);
    debouncedOnLabelChange(newLabel);
  }, [debouncedOnLabelChange]);

  const handleFocus = useCallback(() => {
    onFocus();
    if (localLabel === 'Token') {
      setLocalLabel('');
    }
  }, [onFocus, localLabel]);

  const handleBlur = useCallback(() => {
    if (localLabel.trim() === '') {
      setLocalLabel('Token');
    }
  }, [localLabel]);

  return (
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
  );
});

export default TokenInput;