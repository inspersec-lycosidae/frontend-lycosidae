'use client';
import { Competition } from '@/lib/types';
import { Calendar, Pencil, Trash2, Terminal, Shield, Clock, CheckCircle } from 'lucide-react';

interface CompetitionTableProps {
  competitions: Competition[];
  onEdit: (comp: Competition) => void;
  onDelete: (id: string) => void;
  onViewExercises: (comp: Competition) => void;
}

export default function CompetitionTable({ competitions, onEdit, onDelete, onViewExercises }: CompetitionTableProps) {
  const formatLocalDate = (isoString: string) => {
    if (!isoString) return '--/--/----';
    return new Date(isoString).toLocaleDateString('pt-BR');
  };

  const statusIcons = {
    ativa: <Shield size={12} className="text-green-500" />,
    finalizada: <CheckCircle size={12} className="text-red-500" />,
    em_breve: <Clock size={12} className="text-yellow-500" />
  };

  return (
    <div className="bg-neutral-900/30 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-neutral-950/50 border-b border-neutral-800 text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em]">
            <th className="px-6 py-5">Operação</th>
            <th className="px-6 py-5 text-center">Código</th>
            <th className="px-6 py-5 text-center">Status</th>
            <th className="px-8 py-5 text-right">Controle</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/50">
          {competitions.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-neutral-600 italic text-sm">
                Nenhuma operação identificada.
              </td>
            </tr>
          ) : (
            competitions.map((comp) => (
              <tr key={comp.id} className="hover:bg-red-600/1 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                    {comp.name}
                  </div>
                  <div className="text-[10px] text-neutral-600 mt-1 flex gap-3 font-mono">
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {formatLocalDate(comp.start_date)}</span>
                    <span className="text-neutral-800">|</span>
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {formatLocalDate(comp.end_date)}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <code className="bg-neutral-950 px-2 py-1 rounded text-red-500 font-mono text-xs border border-neutral-800 uppercase tracking-tighter inline-block">
                    {comp.invite_code}
                  </code>
                </td>

                <td className="px-6 py-4 text-center">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${comp.status === 'ativa' ? 'border-green-500/20 text-green-500 bg-green-500/5' :
                      comp.status === 'finalizada' ? 'border-red-500/20 text-red-500 bg-red-500/5' :
                        'border-neutral-700 text-neutral-500 bg-neutral-800/20'
                    }`}>
                    {statusIcons[comp.status as keyof typeof statusIcons]}
                    {comp.status}
                  </div>
                </td>

                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <ActionButton onClick={() => onViewExercises(comp)} icon={Terminal} />
                    <ActionButton onClick={() => onEdit(comp)} icon={Pencil} />
                    <ActionButton onClick={() => onDelete(comp.id)} icon={Trash2} variant="danger" />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ActionButton({ onClick, icon: Icon, variant = 'default' }: { onClick: () => void, icon: any, variant?: 'default' | 'danger' }) {
  const styles = variant === 'danger'
    ? 'text-red-500 hover:bg-red-600 hover:text-white border-red-600/20'
    : 'text-neutral-500 hover:bg-red-600 hover:text-white border-neutral-800';

  return (
    <button onClick={onClick} className={`p-2 rounded-lg border transition-all duration-300 ${styles}`}>
      <Icon size={16} />
    </button>
  );
}