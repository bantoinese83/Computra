import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { STEPS, TIMEOUTS, ICON_SIZES } from '../constants';
import StepIndicator from './StepIndicator';
import { Icon } from './Icon';
import { Logo } from './Logo';

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
    }, TIMEOUTS.FOCUS_DELAY);
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
    <div className="min-h-screen bg-void relative overflow-hidden flex flex-col items-center pt-16 px-4 font-sans">
      {/* Brand */}
      <div className="mb-12 text-center z-10 space-y-4">
        <div className="flex justify-center">
          <Logo size="xl" showText={true} />
        </div>
        <p className="text-text-muted font-medium text-sm">
          Answer {STEPS.length} quick questions to find the right GPU for your workload.
        </p>
        <p className="font-mono text-xs text-ice-cyan tracking-widest uppercase">
          [001] INITIALIZING • [002] NO SIGNUP REQUIRED
        </p>
      </div>

      <StepIndicator currentStep={stepIndex} totalSteps={STEPS.length} />

      {/* Question Card */}
      <div 
        ref={cardRef}
        className="w-full max-w-2xl bg-surface border border-border overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500"
        role="region"
        aria-labelledby="question-title"
      >
        <div className="p-8 md:p-10">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-ice-cyan text-sm tracking-wider">
                [{String(stepIndex + 1).padStart(3, '0')}]
              </span>
              <h2 id="question-title" className="text-2xl md:text-3xl font-bold text-white tracking-tight">{currentStepDef.title}</h2>
              {currentStepDef.tooltip && (
                <div className="group relative">
                  <Icon
                    name="help"
                    className="text-text-muted hover:text-ice-cyan transition-colors cursor-help"
                    size={ICON_SIZES.XXL}
                    aria-label="Help"
                    role="button"
                    tabIndex={0}
                  />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-72 p-4 bg-surface-light border border-border text-white text-sm leading-relaxed opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 z-20 pointer-events-none cyber-glow">
                    {currentStepDef.tooltip}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface-light border-l border-b border-border rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
            <p className="text-text-muted leading-relaxed">{currentStepDef.description}</p>
          </div>

          {/* Options Grid */}
          <div className="grid gap-3" role="radiogroup" aria-labelledby="question-title">
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
                  className={`relative w-full text-left p-5 border transition-all duration-200 ease-out group focus:outline-none focus:ring-2 focus:ring-ice-cyan focus:ring-offset-2 focus:ring-offset-void
                    ${isActive 
                      ? 'border-ice-cyan bg-surface-light cyber-glow z-10' 
                      : 'border-border bg-surface hover:border-ice-cyan/50 hover:bg-surface-light active:scale-[0.98]'
                    }`}
                  role="radio"
                  aria-checked={isActive}
                  aria-label={optionKey}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-ice-cyan/60 text-xs">
                        [{String(idx + 1).padStart(2, '0')}]
                      </span>
                      <span className={`text-base font-medium transition-colors ${isActive ? 'text-white' : 'text-text-muted group-hover:text-white'}`}>
                        {optionKey}
                      </span>
                    </div>
                    
                    {isActive ? (
                      <Icon
                        name="check-circle"
                        className="text-ice-cyan animate-in zoom-in duration-300"
                        size={ICON_SIZES.XXXL}
                      />
                    ) : (
                      <Icon
                        name="arrow-right"
                        size={ICON_SIZES.XL}
                        className="opacity-0 -translate-x-4 text-ice-cyan/40 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-surface-light border-t border-border px-8 md:px-10 py-5 flex justify-between items-center">
          {stepIndex > 0 ? (
            <button 
              onClick={() => navigate(`/step/${stepIndex}?${searchParams.toString()}`)}
              className="group text-text-muted hover:text-ice-cyan font-semibold text-sm flex items-center gap-2 transition-colors px-2 py-1 hover:bg-surface"
            >
              <Icon name="arrow-left" size={ICON_SIZES.MD} className="transition-transform group-hover:-translate-x-1" />
              <span className="font-mono">[BACK]</span>
            </button>
          ) : (
            <div /> 
          )}
          <div className="font-mono text-xs text-ice-cyan uppercase tracking-widest border border-border px-3 py-1 bg-surface">
            [{String(stepIndex + 1).padStart(2, '0')}/{String(STEPS.length).padStart(2, '0')}]
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;


