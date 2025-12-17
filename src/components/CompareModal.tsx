import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ProviderOffer, GpuSpec } from '../types';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 id="compare-modal-title" className="font-bold text-lg text-slate-900">Compare Offers</h3>
          <button 
            ref={closeButtonRef}
            onClick={onClose} 
            className="p-2 hover:bg-slate-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Close comparison"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        
        <div className="overflow-auto p-6 scrollbar-hide">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="p-4 border-b-2 border-slate-100 min-w-[150px] sticky left-0 bg-white z-10 shadow-sm">Detail</th>
                {offers.map(offer => {
                   const spec = gpuSpecs[offer.gpuId] || { name: offer.gpuId, vram: 0, fp16Tflops: 0 };
                   return (
                      <th key={offer.id} className="p-4 border-b-2 border-slate-100 min-w-[200px]">
                        <div className="font-bold text-slate-900">{offer.providerName}</div>
                        <div className="text-xs text-slate-500 font-normal">{spec.name}</div>
                      </th>
                   );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50/50 sticky left-0 shadow-sm">Price per hour</td>
                {offers.map(offer => (
                  <td key={offer.id} className="p-4 font-bold text-green-600">
                    ${offer.pricePerHour.toFixed(3)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50/50 sticky left-0 shadow-sm">Memory (GB)</td>
                {offers.map(offer => {
                   const spec = gpuSpecs[offer.gpuId];
                   return (
                      <td key={offer.id} className="p-4">
                        {spec ? `${spec.vram} GB` : '-'}
                      </td>
                   );
                })}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50/50 sticky left-0 shadow-sm">Speed score</td>
                {offers.map(offer => {
                   const spec = gpuSpecs[offer.gpuId];
                   return (
                      <td key={offer.id} className="p-4">
                        {spec ? spec.fp16Tflops : '-'}
                      </td>
                   );
                })}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50/50 sticky left-0 shadow-sm">Region</td>
                {offers.map(offer => (
                  <td key={offer.id} className="p-4">
                    {offer.region}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-600 bg-slate-50/50 sticky left-0 shadow-sm">Commitment</td>
                {offers.map(offer => (
                  <td key={offer.id} className="p-4 capitalize">
                    {offer.commitment.toLowerCase()}
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


