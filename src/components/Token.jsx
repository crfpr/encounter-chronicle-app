import React from 'react';
import { X } from 'lucide-react';

const Token = ({ label, onRemove }) => {
  return (
    <div className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm mr-2 mb-2">
      <span>{label}</span>
      <button onClick={onRemove} className="ml-2 text-gray-500 hover:text-gray-700">
        <X size={14} />
      </button>
    </div>
  );
};

export default Token;