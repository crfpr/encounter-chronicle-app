import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const CharacterNameType = ({ name, type, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name || 'New Character');
  const [editedType, setEditedType] = useState(type);
  const componentRef = useRef(null);
  const inputRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target) &&
          !selectRef.current.contains(event.target)) {
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
      e.preventDefault();
      handleBlur();
    }
  };

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleTypeChange = (value) => {
    setEditedType(value);
    onUpdate(editedName, value);
  };

  return (
    <div ref={componentRef} className="flex items-center space-x-2">
      {isEditing ? (
        <>
          <Input
            ref={inputRef}
            type="text"
            value={editedName}
            onChange={handleNameChange}
            onKeyDown={handleKeyDown}
            className="flex-grow h-[30px] bg-white text-black dark:bg-zinc-950 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800"
            placeholder="New Character"
          />
          <div ref={selectRef}>
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
        </>
      ) : (
        <div
          className="flex items-center justify-between w-full h-[40px] px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:text-zinc-200 border-zinc-300 dark:border-zinc-800 rounded cursor-pointer"
          onClick={handleClick}
        >
          <span className="text-lg font-bold truncate">{editedName}</span>
          <span className="text-sm">{editedType}</span>
        </div>
      )}
    </div>
  );
};

export default CharacterNameType;