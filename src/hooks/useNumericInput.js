import { useState, useCallback } from 'react';

export const useNumericInput = (initialValue, min = 0, max = 999) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((e) => {
    const newValue = e.target.value;
    if (newValue === '' || (Number.isInteger(Number(newValue)) && Number(newValue) >= min && Number(newValue) <= max)) {
      setValue(newValue);
    }
  }, [min, max]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const increment = e.key === 'ArrowUp' ? 1 : -1;
      setValue(prevValue => {
        if (prevValue === '') {
          return increment > 0 ? min.toString() : max.toString();
        }
        const newValue = Number(prevValue) + increment;
        return newValue >= min && newValue <= max ? newValue.toString() : prevValue;
      });
    }
  }, [min, max]);

  return [value, handleChange, handleKeyDown, setValue];
};