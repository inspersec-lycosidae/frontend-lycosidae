'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '' 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas de segurança não conferem.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        surname: formData.surname,
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      await api.post('/auth/register', payload);
      router.push('/login');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Erro no protocolo de registro.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12">
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl bg-neutral-900/80 backdrop-blur-sm rounded-xl border border-neutral-800 shadow-2xl shadow-red-900/10 p-8 relative z-10">
        
        <div className="mb-8 border-l-4 border-red-600 pl-4">
          <h1 className="text-3xl font-bold text-white">Novo Aluno</h1>
          <p className="text-neutral-400 text-sm mt-1">Preencha o formulário para credenciamento no sistema.</p>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-800/50 text-red-400 p-4 rounded-lg mb-8 flex items-center gap-3 text-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Dados Pessoais */}
          <div className="space-y-4 md:col-span-2">
             <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-widest border-b border-neutral-800 pb-2">
               Identificação
             </h3>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-500 ml-1">NOME</label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg p-3 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all placeholder-neutral-700"
              placeholder="Eduardo"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-500 ml-1">SOBRENOME</label>
            <input
              name="surname"
              type="text"
              required
              value={formData.surname}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg p-3 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all placeholder-neutral-700"
              placeholder="Costa"
            />
          </div>

          {/* Dados de Acesso */}
          <div className="space-y-4 md:col-span-2 mt-2">
             <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-widest border-b border-neutral-800 pb-2">
               Credenciais
             </h3>
          </div>

          <div className="md:col-span-2 space-y-1">
             <label className="text-xs font-semibold text-neutral-500 ml-1">CODINOME</label>
             <input
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg p-3 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all placeholder-neutral-700"
              placeholder="m1st3r_h4ck3r (público)"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
             <label className="text-xs font-semibold text-neutral-500 ml-1">EMAIL DE ESTUDANTE</label>
             <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg p-3 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all placeholder-neutral-700"
              placeholder="aluno@al.insper.edu.br"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-500 ml-1">SENHA</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg p-3 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all placeholder-neutral-700"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-500 ml-1">CONFIRMAR SENHA</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-neutral-950 border rounded-lg p-3 pr-10 text-neutral-200 focus:outline-none focus:ring-1 transition-all placeholder-neutral-700 ${
                    formData.confirmPassword
                      ? formData.password === formData.confirmPassword
                        ? 'border-green-500 focus:border-green-500 focus:ring-green-500/50'
                        : 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                      : 'border-neutral-800 focus:border-red-600 focus:ring-red-600/50'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.68 0 1.35-.06 1.99-.17" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="md:col-span-2 mt-6">
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/30 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Processando...' : 'Finalizar Registro'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-500">
          Já possui acesso?{' '}
          <Link href="/login" className="text-red-500 hover:text-red-400 font-semibold transition-colors">
            Retornar ao Login
          </Link>
        </div>
      </div>
    </div>
  );
}