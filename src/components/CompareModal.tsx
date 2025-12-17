import React, { useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { ProviderOffer, GpuSpec } from '../types';
import { ICON_SIZES, LIMITS } from '../constants';

interface Props {
  offers: ProviderOffer[];
  gpuSpecs: Record<string, GpuSpec>;
  isOpen: boolean;
  onClose: () => void;
}

const CompareModal: React.FC<Props> = ({ offers, gpuSpecs, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle Escape key and click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    // Focus close button when modal opens
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-surface border border-border w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 cyber-glow"
      >
        <div className="p-4 border-b border-border flex justify-between items-center bg-surface-light">
          <h3 id="compare-modal-title" className="font-bold text-lg text-white font-mono">[COMPARE]</h3>
          <button 
            ref={closeButtonRef}
            onClick={onClose} 
            className="p-2 hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-ice-cyan focus:ring-offset-2 focus:ring-offset-void"
            aria-label="Close comparison"
          >
            <Icon name="close" size={ICON_SIZES.XL} className="text-ice-cyan" />
          </button>
        </div>
        
        <div className="overflow-auto p-6 scrollbar-hide bg-void">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="p-4 border-b-2 border-border min-w-[150px] sticky left-0 bg-surface z-10 font-mono text-ice-cyan text-xs uppercase">[DETAIL]</th>
                {offers.map(offer => {
                   const spec = gpuSpecs[offer.gpuId] || { name: offer.gpuId, vram: 0, fp16Tflops: 0 };
                   return (
                      <th key={offer.id} className="p-4 border-b-2 border-border min-w-[200px]">
                        <div className="font-bold text-white">{offer.providerName}</div>
                        <div className="text-xs text-text-muted font-mono">{spec.name}</div>
                      </th>
                   );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-4 font-semibold text-text-muted bg-surface-light sticky left-0 font-mono text-xs uppercase">[PRICE/HR]</td>
                {offers.map(offer => (
                  <td key={offer.id} className="p-4 font-bold text-ice-cyan font-mono">
                    ${offer.pricePerHour.toFixed(LIMITS.PRICE_DECIMAL_PLACES)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-text-muted bg-surface-light sticky left-0 font-mono text-xs uppercase">[MEMORY]</td>
                {offers.map(offer => {
                   const spec = gpuSpecs[offer.gpuId];
                   return (
                      <td key={offer.id} className="p-4 text-white font-mono">
                        {spec ? `${spec.vram}GB` : '-'}
                      </td>
                   );
                })}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-text-muted bg-surface-light sticky left-0 font-mono text-xs uppercase">[TFLOPS]</td>
                {offers.map(offer => {
                   const spec = gpuSpecs[offer.gpuId];
                   return (
                      <td key={offer.id} className="p-4 text-white font-mono">
                        {spec ? spec.fp16Tflops : '-'}
                      </td>
                   );
                })}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-text-muted bg-surface-light sticky left-0 font-mono text-xs uppercase">[REGION]</td>
                {offers.map(offer => (
                  <td key={offer.id} className="p-4 text-white font-mono uppercase">
                    {offer.region}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-text-muted bg-surface-light sticky left-0 font-mono text-xs uppercase">[COMMITMENT]</td>
                {offers.map(offer => (
                  <td key={offer.id} className="p-4 text-white font-mono uppercase">
                    {offer.commitment}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;


