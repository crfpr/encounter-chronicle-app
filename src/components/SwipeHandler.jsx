import React, { useEffect, useRef } from 'react';

const SwipeHandler = ({ onSwipeLeft, onSwipeRight }) => {
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // minimum distance to be considered a swipe

    if (diff > threshold) {
      onSwipeLeft();
    } else if (diff < -threshold) {
      onSwipeRight();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  useEffect(() => {
    const element = document.body;
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return null;
};

export default SwipeHandler;