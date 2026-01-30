'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { Exercise } from '@/lib/types';
import { CheckCircle2, ExternalLink, Lock, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './ui/Button';

interface Props {
  exercise: Exercise;
  competitionId: string;
  isSolved: boolean;
  activeConnection?: string;
  onRefresh: () => void;
}

export default function ChallengeCard({
  exercise,
  competitionId,
  isSolved,
  activeConnection,
  onRefresh
}: Props) {
  const [flag, setFlag] = useState('');
  const [loading, setLoading] = useState(false);

  const difficultyStyles = {
    facil: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    medio: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    dificil: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  const difficultyLabels: Record<string, string> = {
    facil: "Fácil",
    medio: "Médio",
    dificil: "Difícil",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag) return;

    setLoading(true);
    try {
      const payload = {
        exercises_id: exercise.id,
        competitions_id: competitionId,
        content: flag
      };

      const res = await api.post('/exercises/submit', payload);

      if (res.data.success) {
        toast.success(`Alvo neutralizado: ${exercise.name}`);
        setFlag('');
        onRefresh();
      } else {
        toast.error(res.data.message || "Assinatura de flag inválida.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erro de conexão com o terminal Horus.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-neutral-900/40 backdrop-blur-sm border rounded-xl p-6 flex flex-col h-full transition-all duration-500 group ${isSolved
        ? 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]'
        : 'border-neutral-800 hover:border-red-900/30'
      }`}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="bg-red-600/10 text-red-600 text-[9px] px-2 py-0.5 rounded font-black border border-red-600/20 uppercase tracking-widest">
              {exercise.points} XP
            </span>
            <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-widest border ${difficultyStyles[exercise.difficulty as keyof typeof difficultyStyles] || difficultyStyles.dificil}`}>
              {difficultyLabels[exercise.difficulty] || exercise.difficulty}
            </span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {exercise.tags?.map((tag) => (
              <span key={tag.id} className="text-[8px] text-neutral-600 font-bold uppercase tracking-tighter">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
        {isSolved && <CheckCircle2 size={18} className="text-emerald-500" />}
      </div>

      <h3 className="text-lg font-black text-white mb-3 group-hover:text-red-500 transition-colors tracking-tight uppercase">
        {exercise.name}
      </h3>

      <p className="text-neutral-500 text-sm mb-6 grow leading-relaxed font-medium italic">
        {exercise.description}
      </p>

      <div className="mb-6 space-y-2">
        <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest flex items-center gap-1.5">
          <Terminal size={12} /> Vetor de Acesso
        </p>
        {activeConnection ? (
          <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-lg flex items-center justify-between gap-3">
            <code className="text-[11px] text-red-500 font-mono truncate">{activeConnection}</code>
            <a href={activeConnection} target="_blank" rel="noreferrer" className="text-neutral-600 hover:text-white transition-colors">
              <ExternalLink size={14} />
            </a>
          </div>
        ) : (
          <div className="bg-neutral-950/50 border border-neutral-800/50 p-3 rounded-lg flex items-center gap-2 text-neutral-700 italic">
            <Lock size={12} />
            <span className="text-[9px] font-bold uppercase">Aguardando autorização da infra</span>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-neutral-800/50">
        {isSolved ? (
          <div className="w-full bg-emerald-500/5 text-emerald-500 py-3 rounded-lg border border-emerald-500/20 text-center text-[10px] font-black tracking-[0.2em] flex items-center justify-center gap-2">
            OBJETIVO CONCLUÍDO
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="HORUS{flag_de_acesso}"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              disabled={loading}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-xs text-white font-mono outline-none focus:border-red-600 transition-all placeholder-neutral-800"
            />
            <Button type="submit" loading={loading} disabled={!flag}>
              SUBMETER FLAG
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}