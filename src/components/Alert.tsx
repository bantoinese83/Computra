import React, { useEffect } from 'react';
import { Icon } from './Icon';
import { TIMEOUTS, ICON_SIZES } from '../constants';

interface AlertProps {
  message: string;
  type?: 'info' | 'warning' | 'error';
  duration?: number;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ 
  message, 
  type = 'info', 
  duration = TIMEOUTS.COPY_LINK_FEEDBACK,
  onClose 
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIconName = (): 'info' | 'alert-triangle' | 'x-circle' => {
    switch (type) {
      case 'warning':
        return 'alert-triangle';
      case 'error':
        return 'x-circle';
      default:
        return 'info';
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-surface border-ice-cyan text-ice-cyan';
      case 'error':
        return 'bg-surface border-red-500 text-red-400';
      default:
        return 'bg-surface border-ice-cyan text-ice-cyan';
    }
  };

  return (
    <div 
      className={`fixed top-4 right-4 z-50 bg-surface border ${getStyles()} p-4 max-w-md shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 font-mono text-sm`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <Icon 
          name={getIconName()} 
          size={ICON_SIZES.MD} 
          className="flex-shrink-0 mt-0.5"
        />
        <p className="flex-1 leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Close alert"
        >
          <Icon name="x" size={ICON_SIZES.SM} />
        </button>
      </div>
    </div>
  );
};

export default Alert;

