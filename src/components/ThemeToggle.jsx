import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-white"
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;