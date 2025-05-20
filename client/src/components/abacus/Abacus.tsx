import { useState, useEffect } from 'react';
import Rod from './Rod';

interface AbacusProps {
  rodCount?: number;
  onChange?: (value: number) => void;
  className?: string;
  height?: number;
}

const Abacus = ({ 
  rodCount = 5, 
  onChange,
  className = '',
  height = 300
}: AbacusProps) => {
  const [value, setValue] = useState(0);
  const [rodValues, setRodValues] = useState<number[]>(Array(rodCount).fill(0));
  
  useEffect(() => {
    const calculatedValue = rodValues.reduce((acc, rodVal, index) => {
      const placeValue = Math.pow(10, rodCount - index - 1);
      return acc + (rodVal * placeValue);
    }, 0);
    
    setValue(calculatedValue);
    if (onChange) {
      onChange(calculatedValue);
    }
  }, [rodValues, rodCount, onChange]);
  
  useEffect(() => {
    const handleReset = () => {
      setRodValues(Array(rodCount).fill(0));
    };
    
    window.addEventListener('resetAbacus', handleReset);
    return () => {
      window.removeEventListener('resetAbacus', handleReset);
    };
  }, [rodCount]);
  
  const handleRodValueChange = (index: number, rodValue: number) => {
    const newRodValues = [...rodValues];
    newRodValues[index] = rodValue;
    setRodValues(newRodValues);
  };

  return (
    <div 
      className={`abacus-frame p-6 relative ${className}`} 
      style={{ height: `${height}px` }}
    >
      <div className="abacus-divider"></div>
      
      <div className="flex h-full justify-between">
        {Array.from({ length: rodCount }).map((_, index) => (
          <Rod 
            key={index}
            index={index}
            onValueChange={(value) => handleRodValueChange(index, value)}
          />
        ))}
      </div>
    </div>
  );
};

export default Abacus;
