import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Clock } from 'lucide-react';

const TokenInput = ({ token, onLabelChange, onDurationChange, onDurationBlur, toggleDuration }) => {
  const [inputWidth, setInputWidth] = useState(40);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      const textWidth = getTextWidth(token.label, getComputedStyle(inputRef.current).font);
      setInputWidth(Math.max(40, Math.min(textWidth + 8, 120)));
    }
  }, [token.label]);

  const getTextWidth = (text, font) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
  };

  return (
    <>
      <Input
        ref={inputRef}
        type="text"
        value={token.label}
        onChange={(e) => onLabelChange(token.id, e.target.value)}
        className="h-5 px-1 text-xs bg-transparent border-none focus:outline-none focus:ring-0 overflow-visible"
        style={{ width: `${inputWidth}px`, minWidth: '40px' }}
        maxLength={30}
      />
      {token.showDuration ? (
        <Input
          type="number"
          value={token.tokenDuration || ''}
          onChange={(e) => onDurationChange(token.id, e.target.value)}
          onBlur={(e) => onDurationBlur(token.id, e.target.value)}
          className="w-8 h-5 px-1 text-xs text-center bg-transparent border-none focus:outline-none focus:ring-0 no-spinners"
          min="1"
          placeholder=""
        />
      ) : (
        <Button
          onClick={() => toggleDuration(token.id)}
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