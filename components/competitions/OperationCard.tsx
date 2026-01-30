'use client';
import { Competition } from '@/lib/types';
import { Calendar, ArrowRight, Shield, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface OperationCardProps {
  operation: Competition;
}

export default function OperationCard({ operation }: OperationCardProps) {
  const statusConfig: Record<string, { label: string, color: string, bg: string, border: string, icon: any }> = {
    ativa: { label: 'Operação Ativa', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: Shield },
    em_breve: { label: 'Aguardando Início', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: Clock },
    finalizada: { label: 'Operação Encerrada', color: 'text-neutral-500', bg: 'bg-neutral-800/50', border: 'border-neutral-700', icon: CheckCircle2 }
  };

  const status = statusConfig[operation.status] || statusConfig.finalizada;
  const StatusIcon = status.icon;

  return (
    <Link
      href={`/competitions/${operation.id}`}
      className="group bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-900/10 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${status.bg} ${status.color} ${status.border} flex items-center gap-1.5`}>
          <span className="relative flex h-1.5 w-1.5">
            {operation.status === 'ativa' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${operation.status === 'ativa' ? 'bg-green-500' : operation.status === 'em_breve' ? 'bg-yellow-500' : 'bg-neutral-600'}`}></span>
          </span>
          {status.label}
        </div>
        <StatusIcon size={16} className={`${status.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
      </div>

      <h3 className="text-xl font-black text-white mb-2 group-hover:text-red-500 transition-colors tracking-tight uppercase">
        {operation.name}
      </h3>

      <div className="space-y-3 mt-4 flex-1">
        <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-mono">
          <Calendar size={14} className="text-red-600" />
          <span className="tracking-tighter uppercase">Início: {new Date(operation.start_date).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-mono">
          <Calendar size={14} className="text-red-600" />
          <span className="tracking-tighter uppercase">Término: {new Date(operation.end_date).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-neutral-800/50 flex justify-between items-center">
        <span className="text-[10px] text-neutral-600 font-mono uppercase">ID: {operation.id.split('-')[0]}</span>
        <div className="flex items-center gap-2 text-red-500 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 tracking-widest">
          DESCRIPTOGRAFAR <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}