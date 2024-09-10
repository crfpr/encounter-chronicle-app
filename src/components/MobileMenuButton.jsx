import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const MobileMenuButton = ({ onClick, isOpen }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-black dark:text-white w-10 h-10 p-0"
      onClick={onClick}
    >
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </Button>
  );
};

export default MobileMenuButton;