import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';

const MobileMenuButton = ({ onClick }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-white"
      onClick={onClick}
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
};

export default MobileMenuButton;