'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Competition, ScoreboardEntry } from '@/lib/types';
import { BarChart3, Loader2, Users, Target, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import RankBadge from '@/components/scoreboard/RankBadge';
import GradientDivider from '@/components/ui/GradientDivider';

export default function ScoreboardPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompId, setSelectedCompId] = useState<string>('');
  const [scores, setScores] = useState<ScoreboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Carrega e organiza as operações por prioridade de status
  useEffect(() => {
    api.get<Competition[]>('/competitions/')
      .then(res => {
        const sorted = [...res.data].sort((a, b) => {
          const priority: Record<string, number> = { ativa: 0, em_breve: 1, finalizada: 2 };
          const pA = priority[a.status] ?? 3;
          const pB = priority[b.status] ?? 3;

          if (pA !== pB) return pA - pB;

          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        });

        setCompetitions(sorted);

        if (sorted.length > 0) {
          const firstActive = sorted.find(c => c.status === 'ativa');
          setSelectedCompId(firstActive ? firstActive.id : sorted[0].id);
        }
      })
      .catch(() => toast.error("Falha ao sincronizar rede de operações."));
  }, []);

  useEffect(() => {
    if (!selectedCompId) return;
    setLoading(true);
    api.get<ScoreboardEntry[]>(`/scoreboard/${selectedCompId}`)
      .then(res => setScores(res.data))
      .catch(() => {
        setScores([]);
        toast.error("Erro ao descriptografar ranking da unidade.");
      })
      .finally(() => setLoading(false));
  }, [selectedCompId]);

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header de Comando */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-red-600" />
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Monitoramento de Performance</p>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none">
            QUADRO DE <span className="text-red-600">LIDERANÇA</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-2">Classificação de eficiência dos operadores em campo.</p>
        </div>

        {/* Seletor de Operação Organizado */}
        <div className="w-full md:w-80 group">
          <label className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-2 block ml-1">
            Selecionar Dossiê
          </label>
          <div className="relative">
            <select
              value={selectedCompId}
              onChange={(e) => setSelectedCompId(e.target.value)}
              className="w-full bg-neutral-900/50 backdrop-blur-md border border-neutral-800 text-white py-3.5 px-4 rounded-xl focus:border-red-600 outline-none transition-all text-xs font-bold appearance-none cursor-pointer"
            >
              {competitions.map(c => (
                <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                  {c.status === 'ativa' ? '● ' : ''}{c.name.toUpperCase()}
                  {c.status === 'finalizada' ? ' (ENCERRADA)' : ''}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 group-hover:text-red-500 transition-colors">
              <Target size={14} />
            </div>
          </div>
        </div>
      </header>

      <GradientDivider />

      {/* Tabela de Resultados */}
      <div className="bg-neutral-900/30 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-950/50 border-b border-neutral-800 text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em]">
              <th className="px-8 py-5 w-32 text-center">Rank</th>
              <th className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-red-600" /> Operador
                </div>
              </th>
              <th className="px-8 py-5 text-right">
                <div className="flex items-center justify-end gap-2">
                  Pontuação <Shield size={14} className="text-red-600" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-red-600" size={32} />
                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Sincronizando Banco de Dados...</p>
                  </div>
                </td>
              </tr>
            ) : scores.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-8 py-20 text-center">
                  <p className="text-xs font-bold text-neutral-700 uppercase tracking-widest italic opacity-50">Nenhum registro tático identificado.</p>
                </td>
              </tr>
            ) : (
              scores.map((entry, index) => (
                <tr key={entry.users_id} className="hover:bg-red-600/2 transition-colors group">
                  <td className="px-8 py-4 text-center">
                    <RankBadge rank={index + 1} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">
                        {entry.username}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-600 uppercase">
                        Operative ID: {entry.users_id.split('-')[0]}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-baseline justify-end gap-2">
                      <span className="text-xl font-black text-white tabular-nums tracking-tighter">
                        {entry.score.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-red-600 font-bold uppercase">
                        XP
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}