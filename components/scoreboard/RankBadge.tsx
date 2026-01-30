'use client';
import { Trophy, Medal, Target } from 'lucide-react';

interface RankBadgeProps {
  rank: number;
}

export default function RankBadge({ rank }: RankBadgeProps) {
  const configs: Record<number, { bg: string, text: string, border: string, icon: any }> = {
    1: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20', icon: Trophy },
    2: { bg: 'bg-neutral-300/10', text: 'text-neutral-300', border: 'border-neutral-300/20', icon: Medal },
    3: { bg: 'bg-orange-600/10', text: 'text-orange-600', border: 'border-orange-600/20', icon: Medal },
  };

  const config = configs[rank];

  if (config) {
    const Icon = config.icon;
    return (
      <div className={`mx-auto w-10 h-10 ${config.bg} ${config.text} border ${config.border} rounded-xl flex items-center justify-center shadow-lg`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center">
      <span className="text-neutral-500 font-mono text-xs font-bold">#{rank}</span>
    </div>
  );
}