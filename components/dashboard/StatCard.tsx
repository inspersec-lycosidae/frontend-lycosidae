'use client';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export default function StatCard({ label, value, icon: Icon, description }: StatCardProps) {
  return (
    <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-6 rounded-xl hover:border-red-900/50 transition-all duration-300 group">
      <div className="mb-4">
        <div className="w-fit p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-red-500 group-hover:text-red-400 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.1)] transition-all">
          <Icon size={20} />
        </div>
      </div>
      <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-white tracking-tight">
          {value}
        </span>
        {description && (
          <span className="text-xs font-mono text-neutral-600 uppercase tracking-widest font-bold">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}