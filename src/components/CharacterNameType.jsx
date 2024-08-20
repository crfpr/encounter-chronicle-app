import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const CharacterNameType = ({ name, type, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedType, setEditedType] = useState(type);
  const componentRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
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
    setEditedName(name);
    setEditedType(type);
  }, [name, type]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editedName.trim() !== name || editedType !== type) {
      onUpdate(editedName.trim(), editedType);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div ref={componentRef}>
      <Button
        variant="secondary"
        className="w-full h-auto text-left justify-start px-3 py-1"
        onClick={handleClick}
      >
        {isEditing ? (
          <div className="flex items-center w-full">
            <Input
              ref={inputRef}
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow mr-2"
            />
            <Select
              value={editedType}
              onValueChange={(value) => {
                setEditedType(value);
                onUpdate(editedName, value);
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PC">PC</SelectItem>
                <SelectItem value="Enemy">Enemy</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="text-lg font-bold truncate">{editedName}</span>
            <span className="text-sm text-gray-500">{editedType}</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default CharacterNameType;