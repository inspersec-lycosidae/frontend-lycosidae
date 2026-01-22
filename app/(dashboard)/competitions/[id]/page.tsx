'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Exercise, Competition } from '@/lib/types';
import ChallengeCard from '@/components/ChallengeCard';
import {
  Calendar,
  Flag,
  ChevronLeft,
  AlertTriangle,
  Loader2,
  Trophy,
  CheckCircle
} from 'lucide-react';

export default function CompetitionArenaPage() {
  const params = useParams();
  const router = useRouter();
  const competitionId = params.id as string;

  const [exercises, setExercises] = useState<any[]>([]);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    try {
      const [compRes, exRes, solveRes] = await Promise.all([
        api.get<Competition>(`/competitions/${competitionId}`),
        api.get<any[]>(`/competitions/${competitionId}/exercises`),
        api.get<any[]>(`/exercises/my-solves`)
      ]);

      // Normalização do ID da competição atual para comparação segura
      const currentCompId = String(competitionId).trim().toLowerCase();

      // FILTRO ESTRITO: Apenas resoluções que pertencem a ESTA competição
      const solvedInThisComp = solveRes.data.filter((solve: any) => {
        const solveCompId = String(solve.competitions_id || '').trim().toLowerCase();
        return solveCompId === currentCompId;
      });

      // Extraímos os IDs dos exercícios resolvidos NESTA competição
      const solvedExerciseIds = solvedInThisComp.map((s: any) =>
        String(s.exercises_id).trim().toLowerCase()
      );

      // SOMA DE PONTOS: Baseado no campo points_awarded do solve (Source of Truth)
      const score = solvedInThisComp.reduce((acc: number, solve: any) => acc + (solve.points_awarded || 0), 0);

      setCompetition(compRes.data);
      setExercises(exRes.data);
      setSolvedIds(solvedExerciseIds);
      setTotalScore(score);
    } catch (err) {
      console.error("Erro ao carregar arena:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (competitionId) loadData();
  }, [competitionId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-neutral-500">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p className="animate-pulse font-medium">Sincronizando ambiente da arena...</p>
    </div>
  );

  if (error || !competition) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-4">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Acesso Negado ou Arena Inválida</h2>
        <button onClick={() => router.push('/competitions')} className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2.5 rounded-lg transition-all mt-4">
          Voltar para Minhas Competições
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">

      <button onClick={() => router.push('/competitions')} className="flex items-center text-neutral-500 hover:text-white transition text-sm group">
        <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Voltar para lista
      </button>

      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between lg:items-center gap-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/10 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">{competition.name}</h1>
          <div className="flex flex-wrap gap-5 text-sm text-neutral-400">
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-red-600" />
              Fim: <span className="text-neutral-200">{new Date(competition.end_date).toLocaleDateString('pt-BR')}</span>
            </span>
            <span className="flex items-center gap-2">
              <Flag size={16} className="text-red-600" />
              <span className="text-neutral-200">{exercises.length}</span> Desafios
            </span>
          </div>
        </div>

        <div className="relative z-10 flex gap-10 border-l border-neutral-800 lg:pl-10">
          <div className="text-center lg:text-left">
            <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest mb-1">Resolvidos</p>
            <p className="text-2xl font-black text-white flex items-center gap-2 justify-center lg:justify-start">
              <CheckCircle size={22} className="text-green-500" /> {solvedIds.length}/{exercises.length}
            </p>
          </div>
          <div className="text-center lg:text-left">
            <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest mb-1">Sua Pontuação</p>
            <p className="text-2xl font-black text-red-500 flex items-center gap-2 justify-center lg:justify-start">
              <Trophy size={22} className="text-yellow-500" /> {totalScore}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((ex) => (
          <ChallengeCard
            key={ex.id}
            exercise={ex}
            competitionId={competitionId}
            // Comparação de ID normalizada para o estado visual
            isSolved={solvedIds.includes(String(ex.id).trim().toLowerCase())}
            activeConnection={ex.connection}
            onRefresh={loadData}
          />
        ))}
      </div>
    </div>
  );
}