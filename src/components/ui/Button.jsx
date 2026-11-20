import React from 'react';

const VARIANT_STYLES = {
  primary:
    'bg-[#1C7AC0] text-[#FFFFFF] border border-[#1C7AC0] hover:bg-[#145E96] hover:border-[#145E96]',
  secondary:
    'bg-[#FFFFFF] text-[#0D7F72] border border-[#12A594] hover:bg-[#E3F5F1]',
  outline:
    'bg-[#FFFFFF] text-[#1F2937] border border-[#D6E6F2] hover:bg-[#E6F2FB] hover:text-[#145E96]',
  danger:
    'bg-[#FDECEA] text-[#D9534F] border border-[#D9534F]/30 hover:bg-[#D9534F] hover:text-[#FFFFFF]',
  ghost:
    'bg-transparent text-[#1C7AC0] border border-transparent hover:bg-[#E6F2FB] hover:text-[#145E96]',
};

const SIZE_STYLES = {
  sm: 'min-h-[36px] px-4 py-1.5 text-[13px]',
  md: 'min-h-[40px] px-4 py-2 text-[14px]',
};

function ButtonComponent({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-[8px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export const Button = React.memo(ButtonComponent);
Button.displayName = 'Button';