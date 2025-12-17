import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  UserPreferences,
  WorkloadType,
  ModelSize,
  BudgetSensitivity,
  LatencyTolerance,
  Region,
  Commitment,
} from '../types';
import { TIMEOUTS, LIMITS, ICON_SIZES, STROKE_WIDTH, SPACING } from '../constants';
import { Icon } from './Icon';
import { Logo } from './Logo';
import GeminiAssistant from './GeminiAssistant';
import CompareModal from './CompareModal';
import LoadingAnimation from './LoadingAnimation';
import Alert from './Alert';
import CopyUrlModal from './CopyUrlModal';
import { useGpuRecommendations } from '../hooks/useGpuRecommendations';

const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedOffers, setSelectedOffers] = useState<Set<string>>(new Set());
  const [hasCopiedLink, setHasCopiedLink] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'info' | 'warning' | 'error' } | null>(null);
  const [showCopyModal, setShowCopyModal] = useState(false);

  // Reconstruct state from URL
  const prefs: UserPreferences = {
    workload: searchParams.get('workload') as WorkloadType || null,
    modelSize: searchParams.get('modelSize') as ModelSize || null,
    budget: searchParams.get('budget') as BudgetSensitivity || null,
    latency: searchParams.get('latency') as LatencyTolerance || null,
    region: searchParams.get('region') as Region || null,
    commitment: searchParams.get('commitment') as Commitment || null,
  };

  const {
    recommendation,
    offers,
    gpuSpecs,
    groundingSources,
    isLoading,
    error,
  } = useGpuRecommendations(prefs);

  const copyLink = () => {
    const url = window.location.href;

    // Gracefully handle browsers/environments without Clipboard API support
    if (navigator.clipboard && navigator.clipboard.writeText) {
      void navigator.clipboard.writeText(url);
      setHasCopiedLink(true);
      window.setTimeout(() => setHasCopiedLink(false), TIMEOUTS.COPY_LINK_FEEDBACK);
    } else {
      // Fallback: show styled modal for manual copy
      setShowCopyModal(true);
    }
  };

  const toggleComparison = (id: string) => {
    const next = new Set(selectedOffers);
    if (next.has(id)) {
      next.delete(id);
    } else {
      if (next.size >= LIMITS.MAX_COMPARISON_OFFERS) {
        setAlert({ 
          message: `You can compare up to ${LIMITS.MAX_COMPARISON_OFFERS} offers at a time.`, 
          type: 'warning' 
        });
        return;
      }
      next.add(id);
    }
    setSelectedOffers(next);
  };

  const getOffersForComparison = () => {
    return offers.filter(o => selectedOffers.has(o.id));
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-void p-4 font-sans">
        <div className="bg-surface border border-border p-10 text-center max-w-md w-full animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center mb-8">
              <LoadingAnimation size={180} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 tracking-tight font-mono">[SCANNING]</h2>
            <p className="text-text-muted leading-relaxed mb-8">Analyzing parameters and querying compute marketplace...</p>
            <div className="inline-flex items-center gap-2 border border-border bg-surface-light px-4 py-2 text-xs font-mono text-ice-cyan uppercase tracking-wide">
                <Icon name="globe" size={ICON_SIZES.XS} className="text-ice-cyan" />
                <span>[LIVE_DATA]</span>
            </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !recommendation) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-void font-sans">
            <div className="text-center p-8 max-w-lg">
                <div className="border-2 border-border text-ice-cyan w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Icon name="info" size={ICON_SIZES.HUGE} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">[ERROR]</h2>
                <p className="text-text-muted text-lg mb-8">{error || "We could not find a suggestion this time."}</p>
                <Link to="/" className="inline-flex items-center gap-2 border border-ice-cyan bg-surface text-ice-cyan px-6 py-3 font-semibold hover:bg-surface-light transition-colors cyber-glow font-mono text-sm">
            <Icon name="arrow-left" size={ICON_SIZES.LG} /> <span>[RESTART]</span>
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-void font-sans">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-30 transition-all">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-text-muted hover:text-ice-cyan transition-colors px-3 py-1.5 hover:bg-surface-light font-mono text-sm"
          >
            <Icon name="arrow-left" size={ICON_SIZES.XL} />
            <span>[RESTART]</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Logo size="sm" />
              <div className="flex flex-col items-start leading-tight">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  Computra
                </span>
                <span className="text-[11px] font-mono text-ice-cyan/60 uppercase tracking-widest">
                  [AI_COMPUTE_ENGINE]
                </span>
              </div>
            </div>
            <button
              onClick={copyLink}
              className="relative p-2.5 text-text-muted hover:text-ice-cyan hover:bg-surface-light transition-all border border-transparent hover:border-border"
              title="Share configuration"
            >
              <Icon name="external-link" size={ICON_SIZES.XL} />
              {hasCopiedLink && (
                <span className="absolute right-0 -bottom-7 translate-x-2 whitespace-nowrap border border-ice-cyan bg-surface text-ice-cyan text-[10px] font-mono px-2 py-1 cyber-glow">
                  [COPIED]
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        
        {/* Hero Recommendation Card */}
        <section className="bg-surface border border-border overflow-hidden text-white relative animate-in fade-in slide-in-from-bottom-4 duration-700 cyber-glow">
          <div className="p-8 md:p-10 relative z-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-ice-cyan bg-surface-light text-ice-cyan text-xs font-mono uppercase tracking-wide mb-4">
                <Icon name="zap" size={ICON_SIZES.SM} className="fill-current" /> 
                  <span>[TIER: {recommendation.tier.toUpperCase()}]</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 capitalize tracking-tight leading-tight text-white">
                   {recommendation.suggestedGpus.join(' / ')}
                </h1>
                <div className="flex items-baseline gap-3">
                    <span className="text-text-muted text-lg font-mono">[COST]</span>
                    <span className="text-2xl font-bold text-ice-cyan font-mono">
                        {recommendation.priceRange}
                    </span>
                </div>
              </div>
              <div className="md:text-right md:max-w-sm bg-surface-light p-5 border border-border">
                <div className="text-sm text-text-muted leading-relaxed font-handwriting italic">
                    "{recommendation.explanation}"
                </div>
              </div>
            </div>
          </div>
          
          {/* Specs Summary Bar */}
          <div className="bg-surface-light border-t border-border px-8 py-5 flex flex-wrap gap-6 md:gap-12 text-sm">
            <div className="flex items-center gap-3 text-text-muted">
                <Icon name="server" size={ICON_SIZES.LG} className="text-ice-cyan" />
                <span className="font-mono text-xs">[WORKLOAD: {prefs.workload?.toUpperCase()}]</span>
            </div>
            <div className="flex items-center gap-3 text-text-muted">
                <div className="w-5 h-5 border border-ice-cyan flex items-center justify-center text-[10px] font-bold text-ice-cyan font-mono">M</div>
                <span className="font-mono text-xs">[MODEL: {prefs.modelSize?.split(' ')[0].toUpperCase()}]</span>
            </div>
            <div className="flex items-center gap-3 text-text-muted">
                <Icon name="globe" size={ICON_SIZES.LG} className="text-ice-cyan" />
                <span className="font-mono text-xs">[REGION: {prefs.region?.toUpperCase()}]</span>
            </div>
          </div>
        </section>

        {/* Sources Section */}
        {groundingSources.length > 0 && (
            <section className="animate-in fade-in duration-700 delay-150">
                <div className="flex items-center gap-2 mb-3 text-xs font-mono text-ice-cyan uppercase tracking-widest px-1">
                    <Icon name="search" size={ICON_SIZES.SM} />
                    <span>[DATA_SOURCES]</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {groundingSources.slice(0, LIMITS.MAX_GROUNDING_SOURCES_DISPLAY).map((source, idx) => (
                        <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="group bg-surface border border-border hover:border-ice-cyan hover:text-ice-cyan px-4 py-2 transition-all duration-200 flex items-center gap-2 text-sm text-text-muted hover:bg-surface-light">
                            <span className="font-mono text-xs">[{String(idx + 1).padStart(2, '0')}]</span>
                            <span className="max-w-[200px] truncate">{source.title}</span>
                            <Icon name="external-link" size={ICON_SIZES.XS} className="opacity-50 group-hover:opacity-100 text-ice-cyan" />
                        </a>
                    ))}
                </div>
            </section>
        )}

        {/* Offers Table */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="flex items-end justify-between mb-6 px-1">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">[MARKET_OFFERS]</h2>
                <p className="text-text-muted text-sm mt-1 font-mono">Real-time pricing from verified providers</p>
            </div>
            <div className="px-3 py-1 bg-surface-light border border-border text-xs font-mono text-ice-cyan">
              [{String(offers.length).padStart(2, '0')}] PROVIDERS
            </div>
          </div>

          <div className="bg-surface border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-light border-b border-border text-xs font-mono text-ice-cyan uppercase tracking-wider">
                    <th className="px-4 py-5 w-16 text-center">
                        <Icon name="layers" size={ICON_SIZES.MD} className="mx-auto text-ice-cyan" />
                    </th>
                    <th className="px-6 py-5">[PROVIDER]</th>
                    <th className="px-6 py-5">[SPECS]</th>
                    <th className="px-6 py-5">[REGION]</th>
                    <th className="px-6 py-5">[PRICE/HR]</th>
                    <th className="px-6 py-5 text-right">[ACTION]</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {offers.map((offer, idx) => {
                    const gpu = gpuSpecs[offer.gpuId] || gpuSpecs['l4']; // Use dynamic specs
                    const isSelected = selectedOffers.has(offer.id);
                    return (
                      <tr key={offer.id} className={`transition-all duration-200 group ${isSelected ? 'bg-surface-light cyber-glow' : 'hover:bg-surface-light'}`}>
                        <td className="px-4 py-5 text-center">
                            <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => toggleComparison(offer.id)}
                                className="w-5 h-5 border-border bg-surface text-ice-cyan focus:ring-ice-cyan cursor-pointer transition-all accent-ice-cyan"
                            />
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs text-ice-cyan/60">[{String(idx + 1).padStart(2, '0')}]</span>
                            <span className="font-bold text-white text-base">{offer.providerName}</span>
                            {offer.isVerified && (
                              <div className="text-ice-cyan" title="Found via Search">
                                <Icon name="check" size={ICON_SIZES.SM} strokeWidth={STROKE_WIDTH.THICK} />
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-text-muted mt-1 font-mono uppercase tracking-wide">{offer.commitment.toUpperCase()}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-semibold text-white flex items-center gap-2">
                            <Icon name="cpu" size={ICON_SIZES.MD} className="text-ice-cyan" />
                            {gpu.name}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                             <div className="text-[10px] font-mono text-ice-cyan/80 bg-surface-light px-2 py-0.5 border border-border">{gpu.vram}GB</div>
                             <div className="text-[10px] font-mono text-ice-cyan/80 bg-surface-light px-2 py-0.5 border border-border">{gpu.fp16Tflops} TFLOPS</div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-text-muted text-sm font-mono uppercase">
                          {offer.region}
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-extrabold text-ice-cyan text-lg tracking-tight font-mono">${offer.pricePerHour.toFixed(LIMITS.PRICE_DECIMAL_PLACES)}</div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <a 
                            href={offer.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 border border-ice-cyan bg-surface text-ice-cyan px-5 py-2.5 text-sm font-semibold hover:bg-surface-light hover:cyber-glow transition-all whitespace-nowrap font-mono"
                          >
                            [VIEW] <Icon name="external-link" size={ICON_SIZES.SM} />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {offers.length === 0 && (
              <div className="p-16 text-center">
                <div className="border-2 border-border w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Icon name="info" size={ICON_SIZES.EXTRA_HUGE} className="text-ice-cyan" />
                </div>
                <h3 className="text-xl font-bold text-white">[NO_OFFERS]</h3>
                <p className="text-text-muted mt-3 max-w-md mx-auto leading-relaxed font-mono text-sm">Data found but parsing failed. Check source links above.</p>
              </div>
            )}
          </div>
        </section>

        <div className="text-center text-xs font-mono text-ice-cyan/60 mt-16 pb-8 uppercase tracking-wider">
            [NOTE] PRICES VOLATILE • VERIFY ON PROVIDER SITE
        </div>
      </main>

      {/* Floating Compare Button */}
      {selectedOffers.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button 
            onClick={() => setIsCompareOpen(true)}
            className="group border border-ice-cyan bg-surface text-ice-cyan pl-6 pr-8 py-4 hover:bg-surface-light transition-all flex items-center gap-4 font-bold cyber-glow hover:cyber-glow-strong font-mono"
          >
            <span className="border border-ice-cyan bg-surface-light text-ice-cyan w-6 h-6 flex items-center justify-center text-xs font-mono">{selectedOffers.size}</span>
            <span className="flex items-center gap-2">[COMPARE] <Icon name="arrow-right" size={ICON_SIZES.MD} className="group-hover:translate-x-1 transition-transform" /></span>
          </button>
        </div>
      )}

      {/* Comparison Modal */}
      <CompareModal 
        offers={getOffersForComparison()} 
        gpuSpecs={gpuSpecs}
        isOpen={isCompareOpen} 
        onClose={() => setIsCompareOpen(false)} 
      />

      {/* Alert Notification */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Copy URL Modal */}
      {showCopyModal && (
        <CopyUrlModal
          url={window.location.href}
          onClose={() => setShowCopyModal(false)}
        />
      )}

      {/* Gemini Assistant Integration */}
      {recommendation && (
        <GeminiAssistant recommendation={recommendation} preferences={prefs} />
      )}
    </div>
  );
};

export default Results;


