import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const CharacterNameType = ({ name, type, onUpdate, isMobile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name || 'New Character');
  const [editedType, setEditedType] = useState(type);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
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
      if (componentRef.current && !componentRef.current.contains(event.target) && !isSelectOpen) {
        handleBlur();
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, isSelectOpen]);

  useEffect(() => {
    setEditedName(name || 'New Character');
    setEditedType(type);
  }, [name, type]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (!isSelectOpen) {
      setIsEditing(false);
      const finalName = editedName.trim() || 'New Character';
      if (finalName !== name || editedType !== type) {
        onUpdate(finalName, editedType);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      selectRef.current?.focus();
    }
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setEditedName(newName);
    onUpdate(newName, editedType);
  };

  const handleTypeChange = (value) => {
    setEditedType(value);
    onUpdate(editedName, value);
    setIsSelectOpen(false);
  };

  return (
    <div ref={componentRef}>
      <Button
        variant="secondary"
        className={`w-full h-[40px] text-left justify-start px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:text-zinc-200 border-zinc-300 dark:border-zinc-800 ${isMobile ? 'text-sm' : ''}`}
        onClick={handleClick}
      >
        {isEditing ? (
          <div className="flex items-center w-full" onClick={(e) => e.stopPropagation()}>
            <Input
              ref={inputRef}
              type="text"
              value={editedName}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              className={`flex-grow mr-2 h-[30px] bg-white text-black dark:bg-zinc-950 dark:text-zinc-100 border-zinc-300 dark:border-zinc-800 ${isMobile ? 'text-sm' : ''}`}
              placeholder="New Character"
            />
            <Select 
              value={editedType} 
              onValueChange={handleTypeChange}
              onOpenChange={setIsSelectOpen}
              open={isSelectOpen}
            >
              <SelectTrigger className={`w-24 h-[30px] ${isMobile ? 'text-xs' : ''}`} ref={selectRef}>
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
          <div className={`flex items-center justify-between w-full ${isMobile ? 'text-sm' : ''}`}>
            <span className={`font-bold truncate ${isMobile ? 'max-w-[30vw]' : ''}`}>{editedName}</span>
            <span className="text-sm">{editedType}</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export default CharacterNameType;