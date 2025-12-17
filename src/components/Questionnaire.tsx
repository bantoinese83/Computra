import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { STEPS } from '../constants';
import StepIndicator from './StepIndicator';
import { ArrowRight, ArrowLeft, HelpCircle, CheckCircle2 } from 'lucide-react';

const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { stepId } = useParams();
  const firstOptionRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Determine current step index with validation
  const rawIndex = stepId ? Number.parseInt(stepId, 10) - 1 : 0;
  const stepIndex = Number.isNaN(rawIndex) ? 0 : rawIndex;
  const currentStepDef = STEPS[stepIndex];

  // Redirect to first valid step if URL is out of range
  useEffect(() => {
    if (stepIndex < 0 || stepIndex >= STEPS.length) {
      navigate(`/step/1?${searchParams.toString()}`, { replace: true });
    }
  }, [stepIndex, navigate, searchParams]);

  // Auto-focus first option and scroll to top on step change
  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Focus first option after a brief delay for smooth transition
    const timer = setTimeout(() => {
      firstOptionRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stepIndex > 0) {
        navigate(`/step/${stepIndex}?${searchParams.toString()}`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepIndex, navigate, searchParams]);

  // Helper to update state in URL
  const handleSelect = (value: string) => {
    if (!currentStepDef) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set(currentStepDef.id, value);
    setSearchParams(newParams);

    // Navigate to next step or results
    if (stepIndex < STEPS.length - 1) {
      navigate(`/step/${stepIndex + 2}?${newParams.toString()}`);
    } else {
      navigate(`/results?${newParams.toString()}`);
    }
  };

  // Get current selection for this step if it exists
  const currentSelection = searchParams.get(currentStepDef.id);

  // Safety check
  if (!currentStepDef) return null;

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center pt-16 px-4 font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute top-40 left-20 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl -z-10" />

      {/* Brand */}
      <div className="mb-10 text-center z-10 space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Computra
        </h1>
        <p className="text-slate-500 font-medium">
          Answer {STEPS.length} quick questions to find the right GPU for your workload.
        </p>
        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Takes under a minute • No signup
        </p>
      </div>

      <StepIndicator currentStep={stepIndex} totalSteps={STEPS.length} />

      {/* Question Card */}
      <div 
        ref={cardRef}
        className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500"
        role="region"
        aria-labelledby="question-title"
      >
        <div className="p-8 md:p-10">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <h2 id="question-title" className="text-2xl md:text-3xl font-bold text-slate-900">{currentStepDef.title}</h2>
              {currentStepDef.tooltip && (
                <div className="group relative">
                  <HelpCircle 
                    className="text-slate-400 hover:text-blue-500 transition-colors cursor-help" 
                    size={22}
                    aria-label="Help"
                    role="button"
                    tabIndex={0}
                  />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-72 p-4 bg-slate-800 text-white text-sm leading-relaxed rounded-xl shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 z-20 pointer-events-none">
                    {currentStepDef.tooltip}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
            <p className="text-lg text-slate-500 leading-relaxed">{currentStepDef.description}</p>
          </div>

          {/* Options Grid */}
          <div className="grid gap-4" role="radiogroup" aria-labelledby="question-title">
            {currentStepDef.options.map((option, idx) => {
              const isActive = currentSelection === option;
              const optionKey = option as string;
              return (
                <button
                  key={optionKey}
                  ref={idx === 0 ? firstOptionRef : undefined}
                  onClick={() => handleSelect(optionKey)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(optionKey);
                    }
                  }}
                  className={`relative w-full text-left p-5 rounded-2xl border transition-all duration-300 ease-out group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${isActive 
                      ? 'border-blue-500 bg-blue-50/50 shadow-[0_0_0_2px_rgba(59,130,246,0.5)] z-10' 
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 active:scale-[0.98]'
                    }`}
                  role="radio"
                  aria-checked={isActive}
                  aria-label={optionKey}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-medium transition-colors ${isActive ? 'text-blue-700' : 'text-slate-700 group-hover:text-slate-900'}`}>
                      {optionKey}
                    </span>
                    
                    {isActive ? (
                      <CheckCircle2 className="text-blue-600 animate-in zoom-in duration-300" size={24} aria-hidden="true" />
                    ) : (
                      <ArrowRight 
                        size={20} 
                        className="opacity-0 -translate-x-4 text-slate-400 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" 
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50/80 backdrop-blur-sm px-8 md:px-10 py-5 border-t border-slate-100 flex justify-between items-center">
          {stepIndex > 0 ? (
            <button 
              onClick={() => navigate(`/step/${stepIndex}?${searchParams.toString()}`)}
              className="group text-slate-500 hover:text-slate-800 font-semibold text-sm flex items-center gap-2 transition-colors px-2 py-1 rounded-lg hover:bg-slate-200/50"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              Back
            </button>
          ) : (
            <div /> 
          )}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-200/50 px-3 py-1 rounded-full">
            Step {stepIndex + 1} / {STEPS.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;


