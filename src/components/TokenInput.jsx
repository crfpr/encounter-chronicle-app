import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Input } from './ui/input';
import { debounce } from 'lodash';

const TokenInput = forwardRef(({ token, onLabelChange, isNew, onFocus }, ref) => {
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
    }
  }, [localLabel, isNew]);

  const getTextWidth = (text, font) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
  };

  const debouncedOnLabelChange = debounce((newLabel) => {
    onLabelChange(token.id, newLabel);
  }, 300);

  const handleChange = (e) => {
    const newLabel = e.target.value.slice(0, 30);
    setLocalLabel(newLabel);
    debouncedOnLabelChange(newLabel);
  };

  const handleFocus = () => {
    onFocus();
    if (localLabel === 'Token') {
      setLocalLabel('');
    }
  };

  const handleBlur = () => {
    if (localLabel.trim() === '') {
      setLocalLabel('Token');
    }
  };

  return (
    <Input
      ref={(node) => {
        inputRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
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

export default React.memo(TokenInput);