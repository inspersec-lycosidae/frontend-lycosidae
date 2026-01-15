'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Competition } from '@/lib/types';
import { Trophy, Plus, ArrowRight, Hash, Calendar, Loader2 } from 'lucide-react';

export default function CompetitionsListPage() {
	const [competitions, setCompetitions] = useState<Competition[]>([]);
	const [inviteCode, setInviteCode] = useState('');
	const [loading, setLoading] = useState(true);
	const [joining, setJoining] = useState(false);

	// Busca APENAS as competições que o usuário participa
	// (Assumindo que o endpoint GET /competitions/ retorna o contexto do usuário logado)
	const fetchCompetitions = async () => {
		try {
			const res = await api.get<Competition[]>('/competitions/');
			setCompetitions(res.data);
		} catch (error) {
			console.error("Erro ao buscar competições", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCompetitions();
	}, []);

	const handleJoin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inviteCode) return;
		setJoining(true);

		try {
			// Endpoint para entrar: POST /competitions/join
			await api.post('/competitions/join', { invite_code: inviteCode });

			// Limpa e recarrega a lista
			setInviteCode('');
			await fetchCompetitions();
			alert('Inscrição confirmada com sucesso!');
		} catch (error) {
			alert('Código inválido ou você já participa desta competição.');
		} finally {
			setJoining(false);
		}
	};

	return (
		<div className="space-y-10 animate-in fade-in duration-500">

			{/* Cabeçalho */}
			<div>
				<h1 className="text-3xl font-bold text-white mb-2">Minhas Competições</h1>
				<p className="text-neutral-400">Gerencie suas inscrições ou entre em novos desafios.</p>
			</div>

			{/* CARD DE INSCRIÇÃO (JOIN) */}
			<div className="bg-gradient-to-r from-neutral-900 to-neutral-900 border border-neutral-800 rounded-xl p-8 relative overflow-hidden shadow-lg shadow-black/50">
				{/* Efeito decorativo de fundo */}
				<div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

				<div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
					<div className="max-w-md">
						<h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
							<Plus className="text-red-500" /> Nova Inscrição
						</h2>
						<p className="text-sm text-neutral-400">
							Possui um código de convite? Insira abaixo para desbloquear o acesso a uma nova sala de aula ou CTF.
						</p>
					</div>

					<form onSubmit={handleJoin} className="flex w-full md:w-auto gap-2">
						<div className="relative group">
							<Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-red-500 transition-colors" />
							<input
								type="text"
								placeholder="CÓDIGO DE CONVITE"
								value={inviteCode}
								onChange={(e) => setInviteCode(e.target.value)}
								className="pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-700 text-white rounded-lg outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 uppercase font-mono w-full md:w-64 transition-all"
							/>
						</div>
						<button
							type="submit"
							disabled={joining || !inviteCode}
							className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold transition shadow-lg shadow-red-900/20 flex items-center gap-2"
						>
							{joining ? <Loader2 className="animate-spin" /> : 'Entrar'}
						</button>
					</form>
				</div>
			</div>

			{/* LISTA DE COMPETIÇÕES INSCRITAS */}
			<div>
				<h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-6 border-b border-neutral-800 pb-2">
					Inscrições Ativas
				</h3>

				{loading ? (
					<div className="text-center py-12"><Loader2 className="animate-spin mx-auto text-red-500" /></div>
				) : competitions.length === 0 ? (
					<div className="text-center py-16 bg-neutral-900/50 border border-dashed border-neutral-800 rounded-xl">
						<Trophy size={48} className="mx-auto text-neutral-700 mb-4" />
						<p className="text-neutral-400 font-medium">Você ainda não está inscrito em nenhuma competição.</p>
						<p className="text-neutral-600 text-sm mt-1">Use o formulário acima para começar.</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{competitions.map((comp) => (
							<Link href={`/competitions/${comp.id}`} key={comp.id} className="group">
								<div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-red-600/50 hover:bg-neutral-800/80 transition-all duration-300 relative h-full flex flex-col justify-between">
									<div>
										<div className="flex justify-between items-start mb-4">
											<div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${comp.status === 'active'
													? 'bg-green-900/10 text-green-500 border-green-900/30'
													: 'bg-neutral-800 text-neutral-500 border-neutral-700'
												}`}>
												{comp.status === 'active' ? 'Ativa' : comp.status}
											</div>
											<Trophy size={20} className="text-neutral-600 group-hover:text-red-500 transition-colors" />
										</div>
										<h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">{comp.name}</h3>
										<div className="text-sm text-neutral-500 space-y-1">
											<p className="flex items-center gap-2"><Calendar size={14} /> Início: {new Date(comp.start_date).toLocaleDateString('pt-BR')}</p>
											<p className="flex items-center gap-2"><Calendar size={14} /> Fim: {new Date(comp.end_date).toLocaleDateString('pt-BR')}</p>
										</div>
									</div>

									<div className="mt-6 flex items-center text-sm font-bold text-red-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
										Acessar Arena <ArrowRight size={16} className="ml-2" />
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
}