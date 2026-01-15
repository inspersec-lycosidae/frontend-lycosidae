'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await login(email, password);
		} catch (error) {
			alert('Falha no login. Verifique suas credenciais.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
			{/* Background Decorativo (Glow) */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

			<div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-sm rounded-xl border border-neutral-800 shadow-2xl shadow-red-900/20 p-8 relative z-10">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
						Kairo<span className="text-red-600">.</span>
					</h1>
					<p className="text-neutral-400 text-sm">Acesse a plataforma</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
							Email de estudante
						</label>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg p-3 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all placeholder-neutral-700"
							placeholder="aluno@al.insper.edu.br"
						/>
					</div>

					<div>
						<div className="flex justify-between items-center mb-2">
							<label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
								Senha
							</label>
						</div>
						<input
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg p-3 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all placeholder-neutral-700"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/30 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Autenticando...' : 'Inicializar Sessão'}
					</button>
				</form>

				<div className="mt-8 pt-6 border-t border-neutral-800 text-center text-sm text-neutral-400">
					Não possui credenciais?{' '}
					<Link href="/register" className="text-red-500 hover:text-red-400 font-semibold transition-colors">
						Solicitar Acesso
					</Link>
				</div>
			</div>
		</div>
	);
}