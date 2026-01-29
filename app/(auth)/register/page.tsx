'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import AuthLayout from '@/components/auth/AuthLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GradientDivider from '@/components/ui/GradientDivider';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas de segurança não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...payload } = formData;
      await api.post('/auth/register', payload);
      toast.success('Registro concluído. Você já pode acessar o sistema.');
      router.push('/login');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Erro no protocolo de registro.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <div className="md:col-span-2">
          <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-2">Identidade do Operador</p>
          <GradientDivider className="opacity-50" />
        </div>

        <Input label="Nome" name="name" required value={formData.name} onChange={handleChange} placeholder="João" />
        <Input label="Sobrenome" name="surname" required value={formData.surname} onChange={handleChange} placeholder="Souza" />

        <div className="md:col-span-2">
          <Input label="Username" name="username" required value={formData.username} onChange={handleChange} placeholder="m1st3r_h4ck3r" />
        </div>

        <div className="md:col-span-2">
          <Input label="Email de Estudante" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="aluno@al.insper.edu.br" />
        </div>

        <Input label="Senha" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
        <Input
          label="Confirmar Senha"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
        />

        <div className="md:col-span-2 mt-8">
          <Button type="submit" loading={loading}>
            Finalizar Registro
          </Button>
        </div>
      </form>

      <div className="mt-8 mb-6">
        <GradientDivider />
      </div>

      <div className="text-center text-sm text-neutral-500">
        Já possui acesso?{' '}
        <Link href="/login" className="text-red-500 hover:text-red-400 font-bold transition-colors">
          Retornar ao Login
        </Link>
      </div>
    </AuthLayout>
  );
}