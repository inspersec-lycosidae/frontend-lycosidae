'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Trophy, Users, Box, Terminal, ShieldAlert } from 'lucide-react';
import GradientDivider from '@/components/ui/GradientDivider';
import AdminCard from '@/components/admin/AdminCard';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user?.is_admin) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <header className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={16} className="text-red-600" />
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Acesso Nível: Alpha-01</p>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none">
              CENTRO DE <span className="text-red-600">COMANDO</span>
            </h1>
            <p className="text-neutral-500 text-sm mt-2">Gerenciamento global e supervisão tática da rede Horus.</p>
          </div>
          <div className="hidden lg:block text-right font-mono text-[10px] text-neutral-700 uppercase">
            <p>Faça um bom trabalho,</p>
            <p>Administrador {user.username}!</p>
          </div>
        </div>
      </header>

      <GradientDivider />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminCard
          title="Operações"
          desc="Criar, editar e supervisionar aulas e competições."
          href="/admin/competitions"
          icon={Trophy}
          tag="OPE-ADM"
        />
        <AdminCard
          title="Exercícios"
          desc="Gerenciar biblioteca global de exercícios e tags."
          href="/admin/exercises"
          icon={Terminal}
          tag="EXE-ADM"
        />
        <AdminCard
          title="Operadores"
          desc="Monitorar acesso e histórico de todos os usuários."
          href="/admin/users"
          icon={Users}
          tag="USER-ADM"
        />
        <AdminCard
          title="Infraestrutura"
          desc="Controle total sobre containers e instâncias."
          href="/admin/infrastructure"
          icon={Box}
          tag="INFRA-ADM"
        />
      </div>
    </div>
  );
}