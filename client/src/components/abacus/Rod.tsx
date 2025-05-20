import { useState, useEffect, useCallback } from 'react';
import Bead from './Bead';

interface RodProps {
  index: number;
  onValueChange: (value: number) => void;
}

const Rod = ({ index, onValueChange }: RodProps) => {
  // Heaven beads count as 5, earth beads count as 1
  const [heavenBeadActive, setHeavenBeadActive] = useState(false);
  const [earthBeadsActive, setEarthBeadsActive] = useState([false, false, false, false]);
  
  // Memoize the calculation function to prevent infinite loops
  const calculateAndUpdateValue = useCallback(() => {
    const heavenValue = heavenBeadActive ? 5 : 0;
    const earthValue = earthBeadsActive.filter(Boolean).length;
    onValueChange(heavenValue + earthValue);
  }, [heavenBeadActive, earthBeadsActive, onValueChange]);
  
  useEffect(() => {
    calculateAndUpdateValue();
  }, [calculateAndUpdateValue]);
  
  const toggleHeavenBead = () => {
    setHeavenBeadActive(!heavenBeadActive);
  };
  
  const toggleEarthBead = (beadIndex: number) => {
    // When a bead is clicked, all beads below it should be active,
    // and all beads above it should be inactive
    const newEarthBeadsActive = [...earthBeadsActive];
    
    // If clicking an active bead, deactivate it and all above
    if (newEarthBeadsActive[beadIndex]) {
      for (let i = 0; i <= beadIndex; i++) {
        newEarthBeadsActive[i] = false;
      }
    } 
    // If clicking an inactive bead, activate it and all below
    else {
      for (let i = 0; i <= beadIndex; i++) {
        newEarthBeadsActive[i] = true;
      }
      for (let i = beadIndex + 1; i < newEarthBeadsActive.length; i++) {
        newEarthBeadsActive[i] = false;
      }
    }
    
    setEarthBeadsActive(newEarthBeadsActive);
  };
  
  return (
    <div className="abacus-rod w-2 h-full flex-grow">
      {/* Heaven bead */}
      <Bead 
        type="heaven"
        active={heavenBeadActive}
        onClick={toggleHeavenBead}
        position={30}
        activePosition={10}
      />
      
      {/* Earth beads */}
      {earthBeadsActive.map((active, i) => (
        <Bead
          key={i}
          type="earth"
          active={active}
          onClick={() => toggleEarthBead(i)}
          position={100 + (i * 50)}
          activePosition={100 + (i * 50) - 20}
        />
      ))}
    </div>
  );
};

export default Rod;
