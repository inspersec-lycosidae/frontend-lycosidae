'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Competition } from '@/lib/types';
import { Trash2, Plus, Calendar, Save, X, Pencil, AlertCircle } from 'lucide-react';

export default function AdminCompetitionsPage() {
	const [competitions, setCompetitions] = useState<Competition[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null); // Estado para saber se estamos editando

	const [formData, setFormData] = useState({
		name: '',
		invite_code: '',
		status: 'active', // Novo campo para controlar status
		start_date: '',
		end_date: ''
	});

	const fetchCompetitions = async () => {
		try {
			const res = await api.get<Competition[]>('/competitions/');
			setCompetitions(res.data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchCompetitions();
	}, []);

	// Prepara o formulário para EDIÇÃO
	const handleEditClick = (comp: Competition) => {
		// Converte ISO (2023-10-25T14:00:00) para o formato do input (2023-10-25T14:00)
		const formatForInput = (isoString: string) => isoString ? isoString.slice(0, 16) : '';

		setFormData({
			name: comp.name,
			invite_code: comp.invite_code,
			status: comp.status,
			start_date: formatForInput(comp.start_date),
			end_date: formatForInput(comp.end_date)
		});
		setEditingId(comp.id);
		setShowForm(true);

		// Scroll suave para o topo onde está o formulário
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// Limpa o formulário
	const resetForm = () => {
		setFormData({ name: '', invite_code: '', status: 'active', start_date: '', end_date: '' });
		setEditingId(null);
		setShowForm(false);
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Tem certeza? Isso pode quebrar exercícios vinculados.')) return;
		try {
			await api.delete(`/competitions/${id}`);
			fetchCompetitions();
		} catch (err) {
			alert('Erro ao deletar.');
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const payload: any = {
				name: formData.name,
				start_date: new Date(formData.start_date).toISOString(),
				end_date: new Date(formData.end_date).toISOString(),
				status: formData.status
			};

			if (editingId) {
				// MODO EDIÇÃO (PATCH)
				// Nota: Não enviamos invite_code pois o backend não permite alterar
				await api.patch(`/competitions/${editingId}`, payload);
				alert('Competição atualizada!');
			} else {
				// MODO CRIAÇÃO (POST)
				payload.invite_code = formData.invite_code; // Aqui enviamos o código
				await api.post('/competitions/', payload);
				alert('Competição criada!');
			}

			resetForm();
			fetchCompetitions();
		} catch (err: any) {
			console.error(err);
			alert('Erro: ' + (err.response?.data?.detail || 'Verifique os dados'));
		}
	};

	return (
		<div className="space-y-6 animate-in fade-in">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-white">Gerenciar Competições</h1>
					<p className="text-neutral-400 text-sm">Controle total sobre os eventos do CTF.</p>
				</div>
				<button
					onClick={() => { resetForm(); setShowForm(!showForm); }}
					className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition"
				>
					{showForm ? <X size={18} /> : <Plus size={18} />}
					{showForm ? 'Fechar' : 'Nova Competição'}
				</button>
			</div>

			{/* Formulário (Reutilizável para Criar e Editar) */}
			{showForm && (
				<div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl border-l-4 border-l-red-600 shadow-xl">
					<h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
						{editingId ? <Pencil size={20} /> : <Plus size={20} />}
						{editingId ? 'Editar Competição' : 'Nova Competição'}
					</h3>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Nome */}
							<div>
								<label className="block text-xs text-neutral-500 uppercase font-bold mb-1">Nome do Evento</label>
								<input
									type="text"
									required
									value={formData.name}
									onChange={e => setFormData({ ...formData, name: e.target.value })}
									className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white focus:border-red-600 outline-none"
								/>
							</div>

							{/* Invite Code (Desabilitado na edição) */}
							<div>
								<label className="block text-xs text-neutral-500 uppercase font-bold mb-1">
									Código de Convite {editingId && <span className="text-red-500 text-[10px]">(Fixo)</span>}
								</label>
								<input
									type="text"
									required
									disabled={!!editingId} // Bloqueia se estiver editando
									value={formData.invite_code}
									onChange={e => setFormData({ ...formData, invite_code: e.target.value })}
									className={`w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white outline-none font-mono uppercase ${editingId ? 'opacity-50 cursor-not-allowed' : 'focus:border-red-600'}`}
								/>
							</div>

							{/* Status */}
							<div>
								<label className="block text-xs text-neutral-500 uppercase font-bold mb-1">Status</label>
								<select
									value={formData.status}
									onChange={e => setFormData({ ...formData, status: e.target.value })}
									className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white focus:border-red-600 outline-none"
								>
									<option value="active">Ativa</option>
									<option value="finished">Encerrada</option>
									<option value="upcoming">Em Breve</option>
								</select>
							</div>

							{/* Datas */}
							<div>
								<label className="block text-xs text-neutral-500 uppercase font-bold mb-1">Início</label>
								<input
									type="datetime-local"
									required
									value={formData.start_date}
									onChange={e => setFormData({ ...formData, start_date: e.target.value })}
									className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white focus:border-red-600 outline-none [color-scheme:dark]"
								/>
							</div>

							<div className="md:col-span-2">
								<label className="block text-xs text-neutral-500 uppercase font-bold mb-1">Fim</label>
								<input
									type="datetime-local"
									required
									value={formData.end_date}
									onChange={e => setFormData({ ...formData, end_date: e.target.value })}
									className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white focus:border-red-600 outline-none [color-scheme:dark]"
								/>
							</div>
						</div>

						<div className="flex justify-end pt-2 gap-2">
							{editingId && (
								<button type="button" onClick={resetForm} className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded font-bold">
									Cancelar
								</button>
							)}
							<button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold flex items-center gap-2 shadow-lg shadow-green-900/20">
								<Save size={18} /> {editingId ? 'Salvar Alterações' : 'Criar Competição'}
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Lista */}
			<div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
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
							<tr key={comp.id} className="hover:bg-neutral-800/50 transition">
								<td className="p-4">
									<div className="font-bold text-white">{comp.name}</div>
									<div className="text-xs text-neutral-500 mt-1 flex gap-3">
										<span className="flex items-center gap-1"><Calendar size={12} /> {new Date(comp.start_date).toLocaleDateString()}</span>
										<span className="text-neutral-700">|</span>
										<span className="flex items-center gap-1"><Calendar size={12} /> {new Date(comp.end_date).toLocaleDateString()}</span>
									</div>
								</td>
								<td className="p-4 text-neutral-300 font-mono text-sm">{comp.invite_code}</td>
								<td className="p-4">
									<span className={`text-[10px] px-2 py-1 rounded uppercase font-bold border ${comp.status === 'active' ? 'border-green-500/30 text-green-500 bg-green-500/10' :
											comp.status === 'finished' ? 'border-red-500/30 text-red-500 bg-red-500/10' :
												'border-neutral-700 text-neutral-500 bg-neutral-800'
										}`}>
										{comp.status}
									</span>
								</td>
								<td className="p-4 text-right">
									<div className="flex justify-end gap-2">
										<button
											onClick={() => handleEditClick(comp)}
											className="bg-blue-600/10 hover:bg-blue-600 hover:text-white text-blue-500 border border-blue-600/20 p-2 rounded transition-all"
											title="Editar"
										>
											<Pencil size={16} />
										</button>
										<button
											onClick={() => handleDelete(comp.id)}
											className="bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 border border-red-600/20 p-2 rounded transition-all"
											title="Deletar"
										>
											<Trash2 size={16} />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}