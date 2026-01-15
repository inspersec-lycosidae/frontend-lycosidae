'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Exercise, Competition } from '@/lib/types';
import ChallengeCard from '@/components/ChallengeCard';
import { Calendar, Flag, ChevronLeft, AlertTriangle } from 'lucide-react';

export default function CompetitionArenaPage() {
  const params = useParams();
  const router = useRouter();
  const competitionId = params.id as string;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Tenta buscar os dados. Se o usuário não estiver inscrito,
        // o backend deve retornar 403 ou 404 (dependendo da sua implementação)
        const [compRes, exRes] = await Promise.all([
          api.get<Competition>(`/competitions/${competitionId}`),
          api.get<Exercise[]>(`/competitions/${competitionId}/exercises`)
        ]);

        setCompetition(compRes.data);
        setExercises(exRes.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (competitionId) {
      loadData();
    }
  }, [competitionId]);

  if (loading) return <div className="p-8 text-neutral-500">Carregando ambiente da arena...</div>;

  // Tratamento se o usuário tentar acessar via URL direta sem estar inscrito
  if (error || !competition) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Acesso Negado ou Competição Inválida</h2>
        <p className="text-neutral-400 mb-6">Você não está inscrito nesta competição ou ela não existe.</p>
        <button
          onClick={() => router.push('/competitions')}
          className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-lg transition"
        >
          Voltar para Minhas Competições
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">

      {/* Botão Voltar */}
      <button
        onClick={() => router.push('/competitions')}
        className="flex items-center text-neutral-500 hover:text-white transition text-sm group"
      >
        <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Voltar para lista
      </button>

      {/* Header da Arena */}
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl relative overflow-hidden">
        {/* Glow Decorativo */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-red-900/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${competition.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-neutral-800 text-neutral-500 border-neutral-700'}`}>
                {competition.status === 'active' ? 'Arena Aberta' : 'Encerrada'}
              </span>
              <span className="text-neutral-600 text-xs font-mono">{competition.id}</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2">{competition.name}</h1>
            <div className="flex gap-4 text-sm text-neutral-400">
              <span className="flex items-center gap-1"><Calendar size={14} /> Fim: {new Date(competition.end_date).toLocaleDateString('pt-BR')}</span>
              <span className="flex items-center gap-1"><Flag size={14} /> {exercises.length} desafios</span>
            </div>
          </div>

          {/* Ação secundária (ex: ver ranking desta competição específica) */}
          <button
            onClick={() => router.push('/scoreboard')}
            className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Ver Ranking
          </button>
        </div>
      </div>

      {/* Grid de Desafios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((ex) => (
          <ChallengeCard
            key={ex.id}
            exercise={ex}
            competitionId={competitionId}
          />
        ))}
      </div>

      {exercises.length === 0 && (
        <div className="text-center py-20 border border-dashed border-neutral-800 rounded-xl">
          <p className="text-neutral-500">O instrutor ainda não liberou exercícios para esta competição.</p>
        </div>
      )}
    </div>
  );
}