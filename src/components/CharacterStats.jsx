import React from 'react';
import { Input } from '../components/ui/input';

const CharacterStats = ({ ac, onAcChange, onInputKeyDown, setIsNumericInputActive }) => {
  return (
    <div className="flex items-center ml-2 relative">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute pointer-events-none">
        <path d="M20 2L4 8V20C4 30 20 38 20 38C20 38 36 30 36 20V8L20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <Input
        type="text"
        inputMode="numeric"
        value={ac}
        onChange={(e) => onAcChange(e.target.value)}
        onKeyDown={(e) => onInputKeyDown(e, 'ac', ac)}
        onFocus={() => setIsNumericInputActive(true)}
        onBlur={() => setIsNumericInputActive(false)}
        className="w-[40px] h-[40px] text-center bg-transparent text-black dark:text-zinc-100 border-none focus:ring-0 text-sm"
        maxLength={2}
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'textfield',
        }}
      />
    </div>
  );
};

export default CharacterStats;