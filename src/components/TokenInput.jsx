import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Clock } from 'lucide-react';
import { debounce } from 'lodash';

const TokenInput = React.memo(({ token, onUpdate, isNew, onFocus }) => {
  const [localLabel, setLocalLabel] = useState(token.label);
  const [inputWidth, setInputWidth] = useState(40);
  const [showDuration, setShowDuration] = useState(token.showDuration);
  const [tokenDuration, setTokenDuration] = useState(token.tokenDuration);
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

  const debouncedOnUpdate = useCallback(
    debounce((updates) => {
      onUpdate({ ...token, ...updates });
    }, 300),
    [token, onUpdate]
  );

  const handleLabelChange = useCallback((e) => {
    const newLabel = e.target.value.slice(0, 30);
    setLocalLabel(newLabel);
    debouncedOnUpdate({ label: newLabel });
  }, [debouncedOnUpdate]);

  const handleDurationChange = useCallback((e) => {
    const newDuration = e.target.value === '' ? null : Number(e.target.value);
    setTokenDuration(newDuration);
    debouncedOnUpdate({ tokenDuration: newDuration });
  }, [debouncedOnUpdate]);

  const toggleDuration = useCallback(() => {
    const newShowDuration = !showDuration;
    setShowDuration(newShowDuration);
    debouncedOnUpdate({ showDuration: newShowDuration });
  }, [showDuration, debouncedOnUpdate]);

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
    <>
      <Input
        ref={inputRef}
        type="text"
        value={localLabel}
        onChange={handleLabelChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="h-5 px-1 text-xs bg-transparent border-none focus:outline-none focus:ring-0 overflow-visible"
        style={{ width: `${inputWidth}px`, minWidth: '40px' }}
        maxLength={30}
        placeholder="Token"
      />
      {showDuration ? (
        <Input
          type="number"
          value={tokenDuration || ''}
          onChange={handleDurationChange}
          onFocus={onFocus}
          className="w-8 h-5 px-1 text-xs text-center bg-transparent border-none focus:outline-none focus:ring-0 no-spinners"
          min="1"
          placeholder=""
        />
      ) : (
        <Button
          onClick={toggleDuration}
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 hover:bg-zinc-700 dark:hover:bg-zinc-700 group"
        >
          <Clock className="h-3 w-3 group-hover:text-white" />
        </Button>
      )}
    </>
  );
});

export default TokenInput;