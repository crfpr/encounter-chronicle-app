import React from 'react';

const PlaceholderTurnNavigator = () => {
  return (
    <div className="flex flex-col items-center justify-between h-full w-full opacity-0">
      <div className="h-[30px] w-full" />
      <div className="text-sm font-semibold">
        00:00
      </div>
      <div className="h-[30px] w-full" />
    </div>
  );
};

export default PlaceholderTurnNavigator;