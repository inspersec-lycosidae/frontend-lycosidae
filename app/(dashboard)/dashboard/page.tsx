'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Competition } from '@/lib/types';
import { Trophy, Target, Zap, Activity, ArrowRight, Clock, Flag, Crosshair } from 'lucide-react';

// Tipagem baseada no retorno de /exercises/my-solves (SolveReadDTO)
interface Solve {
	id: string;
	timestamp: string;
	users_id: string;
	exercises_id: string;
	points_awarded: number;
}

export default function DashboardPage() {
	const { user } = useAuth();

	// Estados para dados reais
	const [stats, setStats] = useState({
		totalScore: 0,
		totalSolves: 0,
		activeStreaks: 0, // Calculado via frontend (simples)
		enrolledCompetitions: 0
	});

	const [activeComp, setActiveComp] = useState<Competition | null>(null);
	const [recentActivity, setRecentActivity] = useState<Solve[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				// Buscamos em paralelo: Competições e Solves do Usuário
				const [compRes, solvesRes] = await Promise.all([
					api.get<Competition[]>('/competitions/'),
					api.get<Solve[]>('/exercises/my-solves')
				]);

				const competitions = compRes.data;
				const solves = solvesRes.data;

				// 1. Processar Competição Ativa (Banner)
				const active = competitions.find(c => c.status === 'active');
				setActiveComp(active || null);

				// 2. Calcular Score Total e Quantidade de Solves
				const totalScore = solves.reduce((acc, solve) => acc + solve.points_awarded, 0);

				// 3. Processar Atividade Recente (Pegar os 5 últimos)
				// Ordena por data (mais recente primeiro)
				const sortedSolves = solves.sort((a, b) =>
					new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
				);
				setRecentActivity(sortedSolves.slice(0, 5));

				// 4. Calcular "Streak" simples (dias consecutivos com submits)
				// Lógica simplificada: verifica se houve solve hoje e ontem
				const today = new Date().toDateString();
				const hasSolveToday = solves.some(s => new Date(s.timestamp).toDateString() === today);

				setStats({
					totalScore,
					totalSolves: solves.length,
					activeStreaks: hasSolveToday ? 1 : 0, // Placeholder: para streak real precisa de lógica mais complexa
					enrolledCompetitions: competitions.length
				});

			} catch (error) {
				console.error("Erro ao carregar dashboard:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	if (loading) return <div className="p-8 text-neutral-500">Carregando dados táticos...</div>;

	return (
		<div className="space-y-6 animate-in fade-in duration-500">

			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-white">
					Bem-vindo, <span className="text-red-500">{user?.username || 'Operador'}</span>
				</h1>
				<p className="text-neutral-400 text-sm">Visão geral do seu desempenho.</p>
			</div>

			{/* 1. Grid de Estatísticas (Row 1) */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					title="Score Total"
					value={stats.totalScore.toString()}
					icon={Trophy}
					iconBg="bg-red-900/20 text-red-500"
				/>
				<StatCard
					title="Competições"
					value={stats.enrolledCompetitions.toString()}
					icon={Flag}
					iconBg="bg-neutral-800 text-neutral-400"
				/>
				<StatCard
					title="Flags Capturadas"
					value={stats.totalSolves.toString()}
					icon={Target}
					iconBg="bg-neutral-800 text-neutral-400"
				/>
				<StatCard
					title="Atividade Hoje"
					value={stats.activeStreaks > 0 ? "Detectada" : "Nenhuma"}
					icon={Zap}
					iconBg={stats.activeStreaks > 0 ? "bg-yellow-900/20 text-yellow-500" : "bg-neutral-800 text-neutral-500"}
				/>
			</div>

			{/* 2. Layout Dividido: Atividade (Esq) vs Banner (Dir) */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

				{/* Atividade Recente (2/3) */}
				<div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col">
					<h3 className="text-sm font-bold text-neutral-300 mb-4 flex items-center gap-2">
						<Clock size={16} /> Log de Resoluções
					</h3>

					<div className="space-y-1 flex-1">
						{recentActivity.length > 0 ? (
							recentActivity.map((solve) => (
								<ActivityItem
									key={solve.id}
									date={solve.timestamp}
									points={solve.points_awarded}
								/>
							))
						) : (
							<p className="text-sm text-neutral-500 py-4">Nenhuma atividade registrada ainda.</p>
						)}
					</div>
				</div>

				{/* Sugestões / Banner Lateral (1/3) */}
				<div className="space-y-6">
					{/* Banner Competição Ativa */}
					{activeComp ? (
						<div className="bg-gradient-to-br from-neutral-900 to-red-950/30 border border-red-900/30 rounded-xl p-6 relative overflow-hidden group">
							<div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

							<div className="relative z-10">
								<div className="flex items-center gap-2 mb-3">
									<span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
									<span className="text-red-400 text-[10px] font-bold uppercase tracking-wider">AO VIVO</span>
								</div>
								<h2 className="text-xl font-bold text-white mb-1">{activeComp.name}</h2>
								<p className="text-neutral-400 text-xs mb-4">Competição ativa. Conquiste pontos agora.</p>

								<Link href={`/competitions/${activeComp.id}`} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-lg shadow-red-900/20">
									Entrar na Arena <ArrowRight size={14} />
								</Link>
							</div>
						</div>
					) : (
						<div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center">
							<Flag className="mx-auto text-neutral-600 mb-2" />
							<p className="text-sm text-neutral-400">Nenhuma competição ao vivo.</p>
						</div>
					)}

					{/* Card Informativo Estático */}
					<div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
						<div className="flex items-center gap-2 mb-2 text-neutral-300 font-bold text-sm">
							<Activity size={16} /> Status do Sistema
						</div>
						<div className="text-xs text-neutral-500 space-y-2">
							<div className="flex justify-between">
								<span>Servidor de Desafios</span>
								<span className="text-green-500">Online</span>
							</div>
							<div className="flex justify-between">
								<span>Latência</span>
								<span className="text-neutral-300">9ms</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// --- Componentes Visuais ---

function StatCard({ title, value, icon: Icon, iconBg }: any) {
	return (
		<div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl flex flex-col justify-between h-28 hover:border-neutral-700 transition duration-300">
			<div className="flex justify-between items-start">
				<span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">{title}</span>
				<div className={`p-1.5 rounded-md ${iconBg}`}>
					<Icon size={16} />
				</div>
			</div>
			<div>
				<h4 className="text-2xl font-bold text-white tracking-tight">{value}</h4>
			</div>
		</div>
	)
}

function ActivityItem({ date, points }: { date: string, points: number }) {
	// Formata data: "12/05 às 14:30"
	const dateObj = new Date(date);
	const dateStr = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
	const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

	return (
		<div className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-800/50 transition border border-transparent hover:border-neutral-800 group">
			<div className="flex items-center gap-3">
				<div className="w-8 h-8 rounded flex items-center justify-center bg-green-900/20 text-green-500">
					<Crosshair size={16} />
				</div>
				<div>
					<p className="text-sm font-semibold text-neutral-200 group-hover:text-white transition">
						Desafio Resolvido
					</p>
					<p className="text-xs text-neutral-500">{dateStr} às {timeStr}</p>
				</div>
			</div>
			<span className="text-green-500 font-mono text-sm font-bold">+{points} pts</span>
		</div>
	)
}