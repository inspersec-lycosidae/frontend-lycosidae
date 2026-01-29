'use client';
import { Eye } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = "", size = 'md' }: LogoProps) {
  const sizes = {
    sm: { text: "text-xl", icon: 20, subtitle: "text-[8px]", gap: "gap-1.5" },
    md: { text: "text-2xl", icon: 24, subtitle: "text-[9px]", gap: "gap-2" },
    lg: { text: "text-4xl", icon: 32, subtitle: "text-[10px]", gap: "gap-2.5" }
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full ${className}`}>
      <div className={`flex items-center justify-center ${sizes[size].gap} mb-1`}>
        <Eye
          size={sizes[size].icon}
          className="text-red-600 fill-red-600/10 shrink-0"
          strokeWidth={2.5}
        />
        <h1 className={`${sizes[size].text} font-extrabold text-white tracking-tighter leading-none`}>
          Horus<span className="text-red-600">.</span>
        </h1>
      </div>

      {size === 'lg' && (
        <div className="flex items-center justify-center gap-3 w-full max-w-65">
          <div className="h-px flex-1 bg-linear-to-l from-neutral-800 to-transparent"></div>
          <span className={`${sizes[size].subtitle} text-neutral-500 uppercase tracking-[0.4em] font-bold whitespace-nowrap`}>
            CYBER OPERATIONS
          </span>
          <div className="h-px flex-1 bg-linear-to-r from-neutral-800 to-transparent"></div>
        </div>
      )}
    </div>
  );
}