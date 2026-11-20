import React, { useEffect, useId } from 'react';
import { X } from 'lucide-react';

function ModalComponent({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidthClass = 'max-w-lg',
}) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2937]/30 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full ${maxWidthClass} bg-[#FFFFFF] border border-[#D6E6F2] rounded-[12px] shadow-[0_8px_24px_rgba(20,94,150,0.12)] overflow-hidden`}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-[#D6E6F2]">
          <div>
            <h2 id={titleId} className="text-[18px] font-semibold text-[#1F2937]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-[13px] text-[#5B6B7C]">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex items-center justify-center w-9 h-9 rounded-[8px] text-[#5B6B7C] hover:bg-[#E6F2FB] hover:text-[#145E96] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export const Modal = React.memo(ModalComponent);
Modal.displayName = 'Modal';