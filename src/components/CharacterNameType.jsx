import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const CharacterNameType = ({ name, type, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name || 'New Character');
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
    setEditedName(name || 'New Character');
    setEditedType(type);
  }, [name, type]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const finalName = editedName.trim() || 'New Character';
    if (finalName !== name || editedType !== type) {
      onUpdate(finalName, editedType);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const getButtonStyle = () => {
    switch (editedType) {
      case 'PC':
        return 'bg-blue-100 hover:bg-blue-200';
      case 'Enemy':
        return 'bg-red-100 hover:bg-red-200';
      case 'Neutral':
        return 'bg-green-100 hover:bg-green-200';
      default:
        return 'bg-gray-100 hover:bg-gray-200';
    }
  };

  const handleTypeChange = (value) => {
    setEditedType(value);
    onUpdate(editedName || 'New Character', value);
  };

  return (
    <div ref={componentRef}>
      <Button
        variant="secondary"
        className={`w-full h-[40px] text-left justify-start px-3 ${getButtonStyle()}`}
        onClick={handleClick}
      >
        {isEditing ? (
          <div className="flex items-center w-full" onClick={(e) => e.stopPropagation()}>
            <Input
              ref={inputRef}
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow mr-2 h-[30px]"
              placeholder="New Character"
            />
            <Select value={editedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-24 h-[30px]">
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
