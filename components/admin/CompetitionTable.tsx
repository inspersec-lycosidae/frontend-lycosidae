'use client';
import { Competition } from '@/lib/types';
import { Calendar, Pencil, Trash2, Terminal } from 'lucide-react';

interface CompetitionTableProps {
  competitions: Competition[];
  onEdit: (comp: Competition) => void;
  onDelete: (id: string) => void;
  onViewExercises: (comp: Competition) => void;
}

export default function CompetitionTable({ competitions, onEdit, onDelete, onViewExercises }: CompetitionTableProps) {

  const formatLocalDate = (isoString: string) => {
    if (!isoString) return '--/--/----';
    const utcString = isoString.endsWith('Z') ? isoString : `${isoString}Z`;
    return new Date(utcString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-neutral-950 border-b border-neutral-800 text-xs text-neutral-500 uppercase tracking-wider">
            <th className="p-4">Evento</th>
            <th className="p-4">Código</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {competitions.map((comp) => (
            <tr key={comp.id} className="hover:bg-neutral-800/50 transition group">
              <td className="p-4">
                <div className="font-bold text-white group-hover:text-red-500 transition-colors">
                  {comp.name}
                </div>
                <div className="text-xs text-neutral-500 mt-1 flex gap-3 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {formatLocalDate(comp.start_date)}
                  </span>
                  <span className="text-neutral-700">|</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {formatLocalDate(comp.end_date)}
                  </span>
                </div>
              </td>
              <td className="p-4 text-neutral-300 font-mono text-sm uppercase">
                {comp.invite_code}
              </td>
              <td className="p-4">
                <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold border ${comp.status === 'ativa' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
                    comp.status === 'finalizada' ? 'border-red-500/30 text-red-500 bg-red-500/10' :
                      'border-neutral-700 text-neutral-500 bg-neutral-800'
                  }`}>
                  {comp.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onViewExercises(comp)} className="bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 border border-red-600/20 p-2 rounded transition-all">
                    <Terminal size={16} />
                  </button>
                  <button onClick={() => onEdit(comp)} className="bg-blue-600/10 hover:bg-blue-600 hover:text-white text-blue-500 border border-blue-600/20 p-2 rounded transition-all">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => onDelete(comp.id)} className="bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 border border-red-600/20 p-2 rounded transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}