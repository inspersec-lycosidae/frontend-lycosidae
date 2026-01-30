'use client';

interface MissionProgressProps {
  label: string;
  solved: number;
  total: number;
  color: string;
}

export default function MissionProgress({ label, solved, total, color }: MissionProgressProps) {
  const percentage = total > 0 ? (solved / total) * 100 : 0;
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-mono text-neutral-500">{solved} / {total}</span>
      </div>
      <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-800/50 p-px">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
}