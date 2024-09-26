import { useState, useCallback } from 'react';

export const useNumericInput = (initialValue, min = 0, max = 999) => {
  const [value, setValue] = useState(initialValue === null ? '' : initialValue);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    if (newValue === '' || (Number.isInteger(Number(newValue)) && Number(newValue) >= min && Number(newValue) <= max)) {
      setValue(newValue === '' ? '' : Number(newValue));
    }
  }, [min, max]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const increment = e.key === 'ArrowUp' ? 1 : -1;
      setValue(prevValue => {
        const newValue = (prevValue === '' ? 0 : Number(prevValue)) + increment;
        return newValue >= min && newValue <= max ? newValue : prevValue;
      });
    }
  }, [min, max]);

  return [value, handleChange, handleKeyDown, setValue];
};