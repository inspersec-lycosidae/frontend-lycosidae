'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Exercise, Competition, ScoreboardEntry } from '@/lib/types';
import { Trophy, Target, Flag, Crosshair, Loader2, BarChart3 } from 'lucide-react';

// Tipagem para o log de atividades (SolveReadDTO mapeado)
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
      fácil: { solved: 0, total: 0 },
      médio: { solved: 0, total: 0 },
      difícil: { solved: 0, total: 0 },
    }
  });

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        // Buscamos dados básicos, resolvidos e a lista total de exercícios
        const [compRes, solvesRes, allExercisesRes] = await Promise.all([
          api.get<Competition[]>('/competitions/'),
          api.get<any[]>('/exercises/my-solves'),
          api.get<Exercise[]>('/exercises/')
        ]);

        const competitions = compRes.data;
        const mySolves = solvesRes.data;
        const allExercises = allExercisesRes.data;

        // --- CORREÇÃO 1: Unicidade de Solves para Mastery ---
        // Criamos um Set de IDs únicos para garantir que um exercício 
        // em várias competições conte apenas uma vez no progresso.
        const uniqueSolvedIds = new Set(mySolves.map(s => s.exercises_id));

        const totalPerDifficulty = { fácil: 0, médio: 0, difícil: 0 };
        const solvedPerDifficulty = { fácil: 0, médio: 0, difícil: 0 };

        allExercises.forEach(ex => {
          const diff = ex.difficulty?.toLowerCase() as keyof typeof totalPerDifficulty;
          if (totalPerDifficulty[diff] !== undefined) {
            totalPerDifficulty[diff]++;
            // Se o ID deste exercício está no Set de únicos, incrementamos o resolvido
            if (uniqueSolvedIds.has(ex.id)) {
              solvedPerDifficulty[diff]++;
            }
          }
        });

        // --- CORREÇÃO 2: Ranking Global ---
        // Alterado para buscar do endpoint de scoreboard global em vez de um ID específico.
        let userRank = '-';
        try {
          const globalSbRes = await api.get<ScoreboardEntry[]>('/scoreboard/global');
          const position = globalSbRes.data.findIndex(entry => entry.users_id === user.id);
          if (position !== -1) userRank = `#${position + 1}`;
        } catch (e) {
          console.warn("Ranking global não disponível. Verifique o endpoint /scoreboard/global");
        }

        // Histórico formatado para exibição
        const activity = mySolves
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 6)
          .map(s => ({
            id: s.id,
            timestamp: s.timestamp,
            points_awarded: s.points_awarded,
            exerciseName: allExercises.find(ex => ex.id === s.exercises_id)?.name || "Desafio"
          }));

        setRecentActivity(activity);
        setStats({
          totalScore: mySolves.reduce((acc, s) => acc + (s.points_awarded || 0), 0),
          totalSolves: uniqueSolvedIds.size, // Total de exercícios ÚNICOS capturados
          enrolledCompetitions: competitions.length,
          rank: userRank,
          mastery: {
            fácil: { solved: solvedPerDifficulty.fácil, total: totalPerDifficulty.fácil },
            médio: { solved: solvedPerDifficulty.médio, total: totalPerDifficulty.médio },
            difícil: { solved: solvedPerDifficulty.difícil, total: totalPerDifficulty.difícil },
          }
        });

      } catch (error) {
        console.error("Erro no Dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="animate-spin text-red-500" size={32} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white">
          Operador: <span className="text-red-500">{user?.username}</span>
        </h1>
        <p className="text-neutral-400 text-sm">Visão geral do sistema e performance tática.</p>
      </header>

      {/* Grid de Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Score Total" value={stats.totalScore} icon={Trophy} color="text-yellow-500" />
        <StatCard title="Flags Únicas" value={stats.totalSolves} icon={Target} color="text-green-500" />
        <StatCard title="Inscrições" value={stats.enrolledCompetitions} icon={Flag} color="text-blue-400" />
        <StatCard title="Ranking Global" value={stats.rank} icon={BarChart3} color="text-red-500" isHighlight />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Histórico/Log */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Crosshair size={14} /> Log de Resoluções
          </h3>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-neutral-800/20 border border-neutral-800">
                <div>
                  <p className="font-bold text-neutral-200">{item.exerciseName}</p>
                  <p className="text-[10px] text-neutral-500 uppercase">{new Date(item.timestamp).toLocaleString('pt-BR')}</p>
                </div>
                <span className="text-green-500 font-mono font-bold">+{item.points_awarded} PTS</span>
              </div>
            ))}
          </div>
        </div>

        {/* Maestria/Progresso Único */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-6">Masteria de Conteúdo</h3>
          <div className="space-y-8">
            <ProgressBar label="Fácil" solved={stats.mastery.fácil.solved} total={stats.mastery.fácil.total} color="bg-emerald-500" />
            <ProgressBar label="Médio" solved={stats.mastery.médio.solved} total={stats.mastery.médio.total} color="bg-amber-500" />
            <ProgressBar label="Difícil" solved={stats.mastery.difícil.solved} total={stats.mastery.difícil.total} color="bg-rose-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponentes para manter a organização
function StatCard({ title, value, icon: Icon, color, isHighlight }: any) {
  return (
    <div className={`p-5 rounded-2xl bg-neutral-900 border ${isHighlight ? 'border-red-600/50' : 'border-neutral-800'}`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{title}</span>
        <Icon size={16} className={color} />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function ProgressBar({ label, solved, total, color }: { label: string, solved: number, total: number, color: string }) {
  const percentage = total > 0 ? (solved / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold uppercase">
        <span className="text-neutral-400">{label}</span>
        <span className="text-neutral-500">{solved}/{total}</span>
      </div>
      <div className="h-1.5 w-full bg-neutral-800 rounded-full">
        <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}