import React from 'react';
import { Button } from './ui/button';

const MobileButton = ({ children, className, ...props }) => {
  return (
    <Button
      className={`active:opacity-80 transition-opacity ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default MobileButton;