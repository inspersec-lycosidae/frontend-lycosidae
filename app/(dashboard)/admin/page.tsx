'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Trophy, Users, Box, Terminal, ArrowRight, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
	const { user, loading } = useAuth();
	const router = useRouter();

	// Proteção de Rota (Redireciona se não for admin)
	useEffect(() => {
		if (!loading && (!user || !user.is_admin)) {
			router.push('/dashboard');
		}
	}, [user, loading, router]);

	if (loading || !user?.is_admin) return null;

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<div>
				<h1 className="text-3xl font-bold text-white flex items-center gap-3">
					<ShieldAlert className="text-red-500" size={32} /> Painel de Controle
				</h1>
				<p className="text-neutral-400">Gerenciamento global da plataforma Lycosidae.</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<AdminCard
					title="Competições"
					desc="Criar, editar e encerrar CTFs e salas de aula."
					href="/admin/competitions"
					icon={Trophy}
				/>
				<AdminCard
					title="Exercícios"
					desc="Gerenciar biblioteca global de desafios."
					href="/admin/exercises"
					icon={Terminal}
				/>
				<AdminCard
					title="Usuários"
					desc="Listar alunos e verificar acessos."
					href="/admin/users"
					icon={Users}
				/>
				<AdminCard
					title="Infraestrutura"
					desc="Monitorar containers Docker ativos."
					href="/admin/containers"
					icon={Box}
				/>
			</div>
		</div>
	);
}

function AdminCard({ title, desc, href, icon: Icon }: any) {
	return (
		<Link href={href} className="group bg-neutral-900 border border-neutral-800 p-6 rounded-xl hover:border-red-600/50 hover:bg-neutral-800/80 transition-all">
			<div className="flex justify-between items-start mb-4">
				<div className="p-3 bg-red-900/10 text-red-500 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
					<Icon size={24} />
				</div>
				<ArrowRight className="text-neutral-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0" />
			</div>
			<h3 className="text-xl font-bold text-white mb-2">{title}</h3>
			<p className="text-neutral-400 text-sm">{desc}</p>
		</Link>
	);
}