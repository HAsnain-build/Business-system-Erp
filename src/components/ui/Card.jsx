import React from 'react';

const PADDING_MAP = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

function CardComponent({ children, className = '', padding = 'md' }) {
  return (
    <div
      className={`bg-[#FFFFFF] border border-[#D6E6F2] rounded-[12px] shadow-[0_1px_2px_rgba(20,94,150,0.05)] ${PADDING_MAP[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

export const Card = React.memo(CardComponent);
Card.displayName = 'Card';