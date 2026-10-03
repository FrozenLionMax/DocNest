'use client';

import React from 'react';

interface DocNestLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  animated?: boolean;
  className?: string;
}

export default function DocNestLogo({
  size = 'md',
  showText = true,
  subtitle = 'Healthcare Platform',
  animated = true,
  className = '',
}: DocNestLogoProps) {
  const sizeMap = {
    sm: {
      mark: 'w-7 h-7 text-xs',
      textTitle: 'text-lg',
      textSub: 'text-[9px]',
      gap: 'space-x-2.5',
      dot: 'w-1.5 h-1.5',
    },
    md: {
      mark: 'w-9 h-9 text-sm',
      textTitle: 'text-2xl',
      textSub: 'text-[10px]',
      gap: 'space-x-3',
      dot: 'w-2 h-2',
    },
    lg: {
      mark: 'w-12 h-12 text-base',
      textTitle: 'text-3xl',
      textSub: 'text-xs',
      gap: 'space-x-3.5',
      dot: 'w-2.5 h-2.5',
    },
    xl: {
      mark: 'w-16 h-16 text-xl',
      textTitle: 'text-4xl',
      textSub: 'text-xs',
      gap: 'space-x-4',
      dot: 'w-3 h-3',
    },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${current.gap} select-none group ${className}`}>
      {/* Refined Minimalist Clinical Monogram "DN" with subtle Vital Pulse */}
      <div className="relative flex-shrink-0">
        {/* Soft Ambient Halo */}
        {animated && (
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#8dbcc7]/30 to-[#ebffd8]/25 blur-md pointer-events-none group-hover:from-[#8dbcc7]/50 group-hover:to-[#ebffd8]/40 transition duration-300" />
        )}

        {/* Monogram Base */}
        <div
          className={`${current.mark} relative rounded-2xl bg-gradient-to-br from-[#141e28] via-[#0c1219] to-[#1a2836] border border-[rgba(196,225,230,0.22)] shadow-xl flex items-center justify-center font-['Outfit',sans-serif] font-black tracking-tighter text-white transition-all duration-300 group-hover:border-[#8dbcc7]/60 group-hover:shadow-[#8dbcc7]/20 group-hover:scale-105`}
        >
          <span className="text-white">D</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-tr from-[#8dbcc7] to-[#ebffd8]">N</span>
          {/* Micro heartbeat vital node inside icon */}
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#ebffd8] border-2 border-[#0c1219] shadow-sm shadow-[#ebffd8]" />
        </div>
      </div>

      {/* Elegant Typographic Wordmark */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className={`font-['Outfit',sans-serif] font-black ${current.textTitle} tracking-tight leading-none flex items-center`}>
            {/* "Doc" with clean, bright modern white typography */}
            <span className="text-white tracking-tight drop-shadow-sm font-extrabold group-hover:text-slate-100 transition-colors">
              Doc
            </span>

            {/* "Nest" with luminous teal/ceramic gradient */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8dbcc7] via-[#a4ccd9] to-[#ebffd8] font-black tracking-tight ml-0.5">
              Nest
            </span>

            {/* Micro Precision Pulse Dot */}
            <span
              className={`inline-block ${current.dot} rounded-full bg-gradient-to-r from-[#8dbcc7] to-[#ebffd8] ml-1 shadow-sm shadow-[#ebffd8]/60 transition-transform group-hover:scale-125`}
            />
          </div>

          {subtitle && (
            <span
              className={`${current.textSub} font-['Plus_Jakarta_Sans',sans-serif] text-[#a4ccd9]/70 font-bold uppercase tracking-[0.22em] mt-1 group-hover:text-[#ebffd8] transition-colors`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
