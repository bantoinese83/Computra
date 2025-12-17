import React from 'react';
import { Icon } from './Icon';
import { ICON_SIZES } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-surface-light py-6 px-4 mt-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
          <span className="text-ice-cyan/60">[BUILT_BY]</span>
          <a
            href="https://www.monarch-labs.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ice-cyan hover:text-ice-cyan-bright transition-colors flex items-center gap-1.5 group"
          >
            <span>Monarch Labs Inc.</span>
            <Icon 
              name="external-link" 
              size={ICON_SIZES.XS} 
              className="opacity-60 group-hover:opacity-100 transition-opacity"
            />
          </a>
        </div>
        <div className="text-[10px] font-mono text-text-muted/60 uppercase tracking-widest">
          [COMPUTRA] AI COMPUTE MARKETPLACE
        </div>
      </div>
    </footer>
  );
};

export default Footer;

