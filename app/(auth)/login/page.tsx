'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GradientDivider from '@/components/ui/GradientDivider';

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
      toast.success('Acesso autorizado. Inicializando terminal...');
    } catch (error) {
      toast.error('Credenciais inválidas. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Acesso ao Terminal"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email de Estudante"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="aluno@al.insper.edu.br"
        />

        <Input
          label="Senha"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <Button type="submit" loading={loading}>
          Inicializar Sessão
        </Button>
      </form>

      <div className="mt-8 mb-6">
        <GradientDivider />
      </div>

      <div className="text-center text-sm text-neutral-500">
        Novo na Horus?{' '}
        <Link href="/register" className="text-red-500 hover:text-red-400 font-bold transition-colors">
          Registrar
        </Link>
      </div>
    </AuthLayout>
  );
}