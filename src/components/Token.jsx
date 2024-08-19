import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

const Token = ({ label, onRemove }) => {
  return (
    <Button
      variant="secondary"
      className="inline-flex items-center rounded-full px-3 py-1 text-sm mr-2 mb-2 h-[30px]"
    >
      <span className="flex-grow text-center">{label}</span>
      <X
        size={14}
        className="ml-2 cursor-pointer flex-shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      />
    </Button>
  );
};

export default Token;