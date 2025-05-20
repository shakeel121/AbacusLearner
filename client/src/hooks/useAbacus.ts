import { useState, useEffect } from 'react';

interface UseAbacusProps {
  rodCount?: number;
}

export function useAbacus({ rodCount = 5 }: UseAbacusProps = {}) {
  const [value, setValue] = useState(0);
  const [rodValues, setRodValues] = useState<number[]>(Array(rodCount).fill(0));
  
  useEffect(() => {
    // Calculate the total value based on rod values
    const calculatedValue = rodValues.reduce((acc, rodVal, index) => {
      const placeValue = Math.pow(10, rodCount - index - 1);
      return acc + (rodVal * placeValue);
    }, 0);
    
    setValue(calculatedValue);
  }, [rodValues, rodCount]);
  
  const setAbacusValue = (newValue: number) => {
    // Convert the number to an array of digits
    const digits = newValue.toString().padStart(rodCount, '0').split('').map(Number);
    
    // Set each rod's value
    const newRodValues = [...rodValues];
    for (let i = 0; i < rodCount; i++) {
      if (i < digits.length) {
        newRodValues[i] = digits[i];
      } else {
        newRodValues[i] = 0;
      }
    }
    
    setRodValues(newRodValues);
  };
  
  const resetAbacus = () => {
    setRodValues(Array(rodCount).fill(0));
  };
  
  return {
    value,
    rodValues,
    setAbacusValue,
    resetAbacus,
  };
}
