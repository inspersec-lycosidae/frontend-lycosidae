'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Competition, ScoreboardEntry } from '@/lib/types';
import { Trophy, Medal, Crown } from 'lucide-react';

export default function ScoreboardPage() {
	const [competitions, setCompetitions] = useState<Competition[]>([]);
	const [selectedCompId, setSelectedCompId] = useState<string>('');
	const [scores, setScores] = useState<ScoreboardEntry[]>([]);
	const [loading, setLoading] = useState(false);

	// 1. Carrega competições para o dropdown
	useEffect(() => {
		api.get<Competition[]>('/competitions/').then(res => {
			setCompetitions(res.data);
			// Seleciona a primeira ativa ou a primeira da lista por padrão
			if (res.data.length > 0) {
				const active = res.data.find(c => c.status === 'active');
				setSelectedCompId(active ? active.id : res.data[0].id);
			}
		});
	}, []);

	// 2. Carrega placar quando muda a competição selecionada
	useEffect(() => {
		if (!selectedCompId) return;
		setLoading(true);
		api.get<ScoreboardEntry[]>(`/scoreboard/${selectedCompId}`)
			.then(res => setScores(res.data))
			.catch(err => setScores([])) // Limpa se der erro ou vazio
			.finally(() => setLoading(false));
	}, [selectedCompId]);


	return (
		<div className="space-y-6">

			{/* Header e Filtro */}
			<div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-neutral-800 pb-6">
				<div>
					<h1 className="text-2xl font-bold text-white flex items-center gap-2">
						<Crown className="text-yellow-500" /> Ranking Global
					</h1>
					<p className="text-neutral-400 text-sm mt-1">Veja quem domina o sistema.</p>
				</div>

				<div className="w-full md:w-64">
					<label className="text-xs text-neutral-500 uppercase font-bold mb-1 block">Competição</label>
					<select
						value={selectedCompId}
						onChange={(e) => setSelectedCompId(e.target.value)}
						className="w-full bg-neutral-900 border border-neutral-800 text-white p-2.5 rounded-lg focus:border-red-600 outline-none text-sm"
					>
						{competitions.map(c => (
							<option key={c.id} value={c.id}>{c.name}</option>
						))}
					</select>
				</div>
			</div>

			{/* Tabela */}
			<div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-neutral-950/50 border-b border-neutral-800 text-xs text-neutral-500 uppercase tracking-wider">
							<th className="p-4 w-24 text-center">Rank</th>
							<th className="p-4">Hacker</th>
							<th className="p-4 text-right">Pontuação</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-neutral-800">
						{loading ? (
							<tr><td colSpan={3} className="p-8 text-center text-neutral-500">Carregando dados...</td></tr>
						) : scores.length === 0 ? (
							<tr><td colSpan={3} className="p-8 text-center text-neutral-500">Nenhum registro encontrado.</td></tr>
						) : (
							scores.map((entry, index) => (
								<tr key={entry.users_id} className="hover:bg-neutral-800/50 transition group">
									<td className="p-4 text-center">
										<RankBadge rank={index + 1} />
									</td>
									<td className="p-4">
										<div className="font-bold text-neutral-200 group-hover:text-white">{entry.username}</div>
									</td>
									<td className="p-4 text-right font-mono text-red-400 font-bold">
										{entry.score}
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

// Badge visual para 1º, 2º e 3º lugar
function RankBadge({ rank }: { rank: number }) {
	if (rank === 1) return <div className="mx-auto w-8 h-8 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full flex items-center justify-center"><Trophy size={14} /></div>
	if (rank === 2) return <div className="mx-auto w-8 h-8 bg-neutral-400/10 text-neutral-400 border border-neutral-400/20 rounded-full flex items-center justify-center"><Medal size={14} /></div>
	if (rank === 3) return <div className="mx-auto w-8 h-8 bg-orange-700/10 text-orange-700 border border-orange-700/20 rounded-full flex items-center justify-center"><Medal size={14} /></div>
	return <span className="text-neutral-500 font-mono text-sm">#{rank}</span>
}