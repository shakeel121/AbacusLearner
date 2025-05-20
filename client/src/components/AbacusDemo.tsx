import { useState, useEffect } from 'react';
import Abacus from '@/components/abacus/Abacus';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AbacusDemo = () => {
  const [targetNumber, setTargetNumber] = useState(42);
  const [abacusValue, setAbacusValue] = useState(0);
  const { toast } = useToast();

  const checkAnswer = () => {
    if (abacusValue === targetNumber) {
      toast({
        title: "Correct!",
        description: `Great job! You've correctly represented ${targetNumber} on the abacus.`,
        variant: "success",
      });
    } else {
      toast({
        title: "Not quite right",
        description: `The current value is ${abacusValue}. Keep trying to represent ${targetNumber}.`,
        variant: "destructive",
      });
    }
  };

  const resetAbacus = () => {
    setAbacusValue(0);
    // This will trigger the Abacus component to reset
    const event = new CustomEvent('resetAbacus');
    window.dispatchEvent(event);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#424242]">Try Our Interactive Abacus</h2>
        <p className="text-center text-[#9e9e9e] max-w-3xl mx-auto mb-12">
          Get a feel for how our virtual abacus works. Click or drag the beads to move them.
        </p>
        
        <div className="max-w-4xl mx-auto">
          <Abacus
            rodCount={5}
            onChange={(value) => setAbacusValue(value)}
            className="mb-8"
            height={300}
          />
          
          <div className="bg-[#f5f5f5] p-4 rounded-lg">
            <p className="text-[#424242] text-center mb-4">
              Try to represent: <span className="text-lg font-bold">{targetNumber}</span>
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors duration-200"
                onClick={checkAnswer}
              >
                Check Answer
              </Button>
              <Button
                variant="outline"
                className="bg-[#e0e0e0] text-[#424242] px-4 py-2 rounded-md hover:bg-[#9e9e9e] transition-colors duration-200"
                onClick={resetAbacus}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AbacusDemo;
