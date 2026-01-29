'use client';

interface GradientDividerProps {
  className?: string;
}

export default function GradientDivider({ className = "" }: GradientDividerProps) {
  return (
    <div 
      role="separator" 
      className={`h-px w-full bg-linear-to-r from-transparent via-neutral-800 to-transparent ${className}`}
    />
  );
}