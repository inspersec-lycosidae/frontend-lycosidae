'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Exercise, Competition, ScoreboardEntry } from '@/lib/types';
import { Trophy, Target, Flag, Loader2, BarChart3, Zap, ShieldCheck, Activity } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import MissionProgress from '@/components/dashboard/MissionProgress';
import GradientDivider from '@/components/ui/GradientDivider';

interface SolveActivity {
  id: string;
  timestamp: string;
  points_awarded: number;
  exerciseName: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<SolveActivity[]>([]);
  const [stats, setStats] = useState({
    totalScore: 0,
    totalSolves: 0,
    enrolledCompetitions: 0,
    rank: '-',
    mastery: {
      facil: { solved: 0, total: 0 },
      medio: { solved: 0, total: 0 },
      dificil: { solved: 0, total: 0 },
    }
  });

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const [compRes, solvesRes, allExercisesRes] = await Promise.all([
          api.get<Competition[]>('/competitions/'),
          api.get<any[]>('/exercises/my-solves'),
          api.get<Exercise[]>('/exercises/')
        ]);

        const mySolves = solvesRes.data;
        const allExercises = allExercisesRes.data;
        const uniqueSolvedIds = new Set(mySolves.map((s: any) => s.exercises_id));

        const totalPerDifficulty = { facil: 0, medio: 0, dificil: 0 };
        const solvedPerDifficulty = { facil: 0, medio: 0, dificil: 0 };

        allExercises.forEach(ex => {
          const diff = ex.difficulty?.toLowerCase() as keyof typeof totalPerDifficulty;
          if (totalPerDifficulty[diff] !== undefined) {
            totalPerDifficulty[diff]++;
            if (uniqueSolvedIds.has(ex.id)) solvedPerDifficulty[diff]++;
          }
        });

        let userRank = '-';
        try {
          const globalSbRes = await api.get<ScoreboardEntry[]>('/scoreboard/global');
          const position = globalSbRes.data.findIndex(entry => entry.users_id === user.id);
          if (position !== -1) userRank = `#${position + 1}`;
        } catch (e) { console.warn("Ranking global indisponível."); }

        const activity = mySolves
          .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5)
          .map((s: any) => ({
            id: s.id,
            timestamp: s.timestamp,
            points_awarded: s.points_awarded,
            exerciseName: allExercises.find(ex => ex.id === s.exercises_id)?.name || "Desafio"
          }));

        setRecentActivity(activity);
        setStats({
          totalScore: mySolves.reduce((acc: number, s: any) => acc + (s.points_awarded || 0), 0),
          totalSolves: uniqueSolvedIds.size,
          enrolledCompetitions: compRes.data.length,
          rank: userRank,
          mastery: {
            facil: { solved: solvedPerDifficulty.facil, total: totalPerDifficulty.facil },
            medio: { solved: solvedPerDifficulty.medio, total: totalPerDifficulty.medio },
            dificil: { solved: solvedPerDifficulty.dificil, total: totalPerDifficulty.dificil },
          }
        });
      } catch (error) { console.error("Erro no Dashboard Horus:", error); }
      finally { setLoading(false); }
    }
    fetchData();
  }, [user]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-red-600" size={40} />
      <p className="text-xs font-bold text-neutral-500 uppercase tracking-[0.3em]">Sincronizando com Horus...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Status: Conexão Estável</p>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none">
              Bem-vindo, <span className="text-red-600">{user?.username}</span>
            </h1>
            <p className="text-neutral-500 text-sm mt-2">Painel de monitoramento e performance de campo.</p>
          </div>
        </div>
      </header>

      <GradientDivider />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Score Total" value={stats.totalScore} icon={Trophy} description="PTS" />
        <StatCard label="Flags Únicas" value={stats.totalSolves} icon={Target} description="CAPTURAS" />
        <StatCard label="Operações" value={stats.enrolledCompetitions} icon={Flag} description="INSCRITO" />
        <StatCard label="Rank Global" value={stats.rank} icon={BarChart3} description="POSIÇÃO" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-neutral-900/30 border border-neutral-800/50 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-red-500" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Logs de Resolução</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between group p-3 rounded-xl hover:bg-neutral-800/30 transition-all border border-transparent hover:border-neutral-800">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-neutral-500 group-hover:text-red-500">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-red-500">{item.exerciseName}</p>
                    <p className="text-[10px] text-neutral-500 uppercase font-mono">{new Date(item.timestamp).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
                <span className="text-sm font-black text-red-500 font-mono">+{item.points_awarded} XP</span>
              </div>
            )) : <p className="text-center text-neutral-600 py-10 text-xs uppercase tracking-widest">Nenhuma atividade detectada.</p>}
          </div>
        </div>

        <div className="bg-neutral-950/50 border border-neutral-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-8">
            <Activity size={18} className="text-red-500" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Maestria Horus</h2>
          </div>
          <div className="space-y-8">
            <MissionProgress label="Fácil" solved={stats.mastery.facil.solved} total={stats.mastery.facil.total} color="bg-emerald-500" />
            <MissionProgress label="Médio" solved={stats.mastery.medio.solved} total={stats.mastery.medio.total} color="bg-amber-500" />
            <MissionProgress label="Difícil" solved={stats.mastery.dificil.solved} total={stats.mastery.dificil.total} color="bg-rose-500" />
          </div>
        </div>
      </div>
    </div>
  );
}