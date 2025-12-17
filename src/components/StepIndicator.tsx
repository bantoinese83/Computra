import React from 'react';

interface Props {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<Props> = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full max-w-xl mx-auto mb-10">
      <div className="flex justify-between text-[10px] font-mono text-ice-cyan/60 uppercase tracking-widest mb-3">
        <span>[CONFIG]</span>
        <span>[{String(Math.round(progress)).padStart(3, '0')}%]</span>
      </div>
      <div className="h-1 bg-surface-light border border-border overflow-hidden">
        <div 
          className="h-full bg-ice-cyan cyber-glow transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;


