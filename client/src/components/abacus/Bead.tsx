import { useState } from 'react';

interface BeadProps {
  type: 'heaven' | 'earth';
  active: boolean;
  onClick: () => void;
  position: number;
  activePosition: number;
}

const Bead = ({ type, active, onClick, position, activePosition }: BeadProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleClick = () => {
    setIsAnimating(true);
    onClick();
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  return (
    <div 
      className={`abacus-bead ${type}-bead ${isAnimating ? 'bead-animation' : ''}`}
      style={{ 
        top: `${active ? activePosition : position}px`,
        width: '40px',
        height: '40px'
      }}
      onClick={handleClick}
    />
  );
};

export default Bead;
