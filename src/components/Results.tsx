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
  ProviderOffer,
} from '../types';
import { ArrowLeft, Check, ExternalLink, Server, Zap, Globe, Share2, Info, Layers, Loader2, Search, Cpu, ArrowRight } from 'lucide-react';
import GeminiAssistant from './GeminiAssistant';
import CompareModal from './CompareModal';
import { useGpuRecommendations } from '../hooks/useGpuRecommendations';

const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedOffers, setSelectedOffers] = useState<Set<string>>(new Set());
  const [hasCopiedLink, setHasCopiedLink] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

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
      window.setTimeout(() => setHasCopiedLink(false), 2500);
    } else {
      // Fallback: select URL for manual copy
      window.prompt('Copy this link:', url);
    }
  };

  const toggleComparison = (id: string) => {
    const next = new Set(selectedOffers);
    if (next.has(id)) {
      next.delete(id);
    } else {
      if (next.size >= 4) {
        alert("You can compare up to 4 offers at a time.");
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 text-center max-w-md w-full animate-in fade-in zoom-in duration-500">
            <div className="relative w-20 h-20 mx-auto mb-8">
                 <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Search className="text-blue-600 animate-pulse" size={24} />
                 </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Finding the best fits</h2>
            <p className="text-slate-500 leading-relaxed mb-8">Looking at your answers and searching for matching compute options...</p>
            <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-xs font-semibold text-slate-500 uppercase tracking-wide">
                <Globe size={12} className="text-blue-500" />
                <span>Using live web data</span>
            </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !recommendation) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
            <div className="text-center p-8 max-w-lg">
                <div className="bg-red-50 text-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Info size={32} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Something went wrong</h2>
                <p className="text-slate-500 text-lg mb-8">{error || "We could not find a suggestion this time."}</p>
                <Link to="/" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                    <ArrowLeft size={18} /> Start Over
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-slate-50 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 transition-all">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold text-sm">Restart</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                Computra
              </span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                AI Compute Flight Finder
              </span>
            </div>
            <button
              onClick={copyLink}
              className="relative p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
              title="Share configuration"
            >
              <Share2 size={20} />
              {hasCopiedLink && (
                <span className="absolute right-0 -bottom-7 translate-x-2 whitespace-nowrap rounded-full bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 shadow-lg">
                  Link copied
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        
        {/* Hero Recommendation Card */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl shadow-slate-200 overflow-hidden text-white relative animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="p-8 md:p-10 relative z-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-wide mb-4 shadow-sm">
                  <Zap size={14} className="fill-current" /> 
                  <span>Recommended Tier: {recommendation.tier}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 capitalize tracking-tight leading-tight">
                   {recommendation.suggestedGpus.join(' / ')}
                </h1>
                <div className="flex items-baseline gap-3">
                    <span className="text-slate-400 text-lg">Estimated Cost:</span>
                    <span className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                        {recommendation.priceRange}
                    </span>
                </div>
              </div>
              <div className="md:text-right md:max-w-sm bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-sm">
                <div className="text-sm text-slate-200 leading-relaxed font-light">
                    "{recommendation.explanation}"
                </div>
              </div>
            </div>
          </div>
          
          {/* Specs Summary Bar */}
          <div className="bg-slate-950/30 backdrop-blur-md px-8 py-5 flex flex-wrap gap-6 md:gap-12 border-t border-white/5 text-sm">
            <div className="flex items-center gap-3 text-slate-300">
                <Server size={18} className="text-blue-400" />
                <span className="font-medium">{prefs.workload}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
                <div className="w-4.5 h-4.5 rounded bg-indigo-500/80 flex items-center justify-center text-[10px] font-bold text-white">M</div>
                <span className="font-medium">{prefs.modelSize?.split(' ')[0]} Model</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
                <Globe size={18} className="text-emerald-400" />
                <span className="font-medium">{prefs.region}</span>
            </div>
          </div>
        </section>

        {/* Sources Section */}
        {groundingSources.length > 0 && (
            <section className="animate-in fade-in duration-700 delay-150">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                    <Search size={14} />
                    <span>Data Sources</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {groundingSources.slice(0, 5).map((source, idx) => (
                        <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="group bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 shadow-sm text-sm text-slate-600 hover:shadow-md">
                            <span className="max-w-[200px] truncate">{source.title}</span>
                            <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
                        </a>
                    ))}
                </div>
            </section>
        )}

        {/* Offers Table */}
        <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <div className="flex items-end justify-between mb-6 px-1">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Live Market Offers</h2>
                <p className="text-slate-500 text-sm mt-1">Real-time pricing from verified providers</p>
            </div>
            <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-500 border border-slate-200">
              {offers.length} Providers
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider backdrop-blur-sm">
                    <th className="px-4 py-5 w-16 text-center">
                        <Layers size={16} className="mx-auto text-slate-300" />
                    </th>
                    <th className="px-6 py-5">Provider</th>
                    <th className="px-6 py-5">Machine details</th>
                    <th className="px-6 py-5">Region</th>
                    <th className="px-6 py-5">Price / Hr</th>
                    <th className="px-6 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {offers.map((offer) => {
                    const gpu = gpuSpecs[offer.gpuId] || gpuSpecs['l4']; // Use dynamic specs
                    const isSelected = selectedOffers.has(offer.id);
                    return (
                      <tr key={offer.id} className={`transition-all duration-200 group ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/50'}`}>
                        <td className="px-4 py-5 text-center">
                            <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => toggleComparison(offer.id)}
                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
                            />
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-slate-900 text-base">{offer.providerName}</span>
                            {offer.isVerified && (
                              <div className="text-blue-500" title="Found via Search">
                                <Check size={14} strokeWidth={4} />
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-1 font-medium capitalize tracking-wide">{offer.commitment.toLowerCase()}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-semibold text-slate-700 flex items-center gap-2">
                            <Cpu size={16} className="text-slate-400" />
                            {gpu.name}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                             <div className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{gpu.vram} GB memory</div>
                             <div className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Speed score: {gpu.fp16Tflops}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-slate-600 text-sm font-medium">
                          {offer.region}
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-extrabold text-slate-900 text-lg tracking-tight">${offer.pricePerHour.toFixed(3)}</div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <a 
                            href={offer.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-900/10 whitespace-nowrap"
                          >
                            View Deal <ExternalLink size={14} />
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
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                  <Info size={36} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No structured offers found</h3>
                <p className="text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">We found relevant data but couldn't parse it into the comparison table. Please check the source links above.</p>
              </div>
            )}
          </div>
        </section>

        <div className="text-center text-xs font-medium text-slate-400 mt-16 pb-8 uppercase tracking-wider">
            Prices can change • Please double-check details on the provider website
        </div>
      </main>

      {/* Floating Compare Button */}
      {selectedOffers.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <button 
            onClick={() => setIsCompareOpen(true)}
            className="group bg-slate-900 text-white pl-6 pr-8 py-4 rounded-full shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-4 font-bold border border-slate-700/50 hover:scale-105 active:scale-95"
          >
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">{selectedOffers.size}</span>
            <span className="flex items-center gap-2">Compare Selection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
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

      {/* Gemini Assistant Integration */}
      {recommendation && (
        <GeminiAssistant recommendation={recommendation} preferences={prefs} />
      )}
    </div>
  );
};

export default Results;


