import React from 'react';

interface Props {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<Props> = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full max-w-xl mx-auto mb-10">
      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
        <span>Configuration</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <div className="h-1.5 bg-slate-200/60 rounded-full overflow-hidden backdrop-blur-sm">
        <div 
          className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;


