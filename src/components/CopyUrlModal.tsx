import React, { useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { ICON_SIZES } from '../constants';

interface CopyUrlModalProps {
  url: string;
  onClose: () => void;
}

const CopyUrlModal: React.FC<CopyUrlModalProps> = ({ url, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus and select the input text
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      onClose();
    } catch (err) {
      // Fallback: select text for manual copy
      inputRef.current?.select();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="copy-url-title"
    >
      <div 
        className="bg-surface border border-border p-6 max-w-lg w-full mx-4 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 
            id="copy-url-title"
            className="text-lg font-bold text-white font-mono uppercase tracking-wide"
          >
            [COPY_LINK]
          </h3>
          <button
            onClick={onClose}
            className="hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            <Icon name="x" size={ICON_SIZES.MD} className="text-text-muted" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={url}
              readOnly
              className="w-full bg-void border border-border px-4 py-3 text-sm font-mono text-ice-cyan focus:outline-none focus:border-ice-cyan focus:ring-1 focus:ring-ice-cyan"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 bg-surface-light border border-ice-cyan text-ice-cyan px-4 py-2.5 text-sm font-mono uppercase tracking-wide hover:bg-ice-cyan hover:text-void transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="copy" size={ICON_SIZES.SM} />
              <span>Copy</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-border text-text-muted text-sm font-mono uppercase tracking-wide hover:border-ice-cyan hover:text-ice-cyan transition-colors"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-text-muted font-mono text-center">
            [TIP] Click the URL above to select, or use the Copy button
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopyUrlModal;

