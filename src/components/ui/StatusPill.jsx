import React, { useMemo } from 'react';
import { getStatusVariant } from '../../utils/formatters.js';

const VARIANT_CLASSES = {
  success: 'bg-[#E3F5F1] text-[#0D7F72]',
  info: 'bg-[#E6F2FB] text-[#145E96]',
  danger: 'bg-[#FDECEA] text-[#D9534F]',
};

function StatusPillComponent({ label, variant }) {
  const resolvedVariant = useMemo(
    () => variant ?? getStatusVariant(label),
    [variant, label]
  );

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium leading-none whitespace-nowrap ${VARIANT_CLASSES[resolvedVariant]}`}
    >
      {label}
    </span>
  );
}

export const StatusPill = React.memo(StatusPillComponent);
StatusPill.displayName = 'StatusPill';