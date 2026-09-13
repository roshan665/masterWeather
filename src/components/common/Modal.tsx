import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthStyles = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Clickable backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal / Bottom Sheet */}
      <div
        className={`w-full ${widthStyles[maxWidth]} bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] z-10 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with 44px close button */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/90 shrink-0">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate pr-2">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 min-w-[44px] min-h-[44px] text-slate-400 hover:text-slate-800 hover:bg-slate-200/70 active:scale-95 rounded-xl transition-all flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 pb-safe sm:pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};
