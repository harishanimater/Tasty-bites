import React from 'react';

interface VegBadgeProps {
  isVeg: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VegBadge: React.FC<VegBadgeProps> = ({ isVeg, size = 'md', showLabel = false }) => {
  const dimensions = {
    sm: 'w-3.5 h-3.5 border',
    md: 'w-4 h-4 border-[1.5px]',
    lg: 'w-5 h-5 border-2',
  };

  const innerSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div
        className={`${dimensions[size]} bg-white rounded-xs flex items-center justify-center shrink-0 ${
          isVeg ? 'border-emerald-600' : 'border-rose-700'
        }`}
        title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      >
        {isVeg ? (
          <div className={`${innerSize[size]} rounded-full bg-emerald-600`} />
        ) : (
          <div
            className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-rose-700"
            style={{ transform: 'translateY(-0.5px)' }}
          />
        )}
      </div>
      {showLabel && (
        <span
          className={`text-[11px] font-semibold tracking-wide uppercase ${
            isVeg ? 'text-emerald-700' : 'text-rose-700'
          }`}
        >
          {isVeg ? 'Pure Veg' : 'Non-Veg'}
        </span>
      )}
    </div>
  );
};
