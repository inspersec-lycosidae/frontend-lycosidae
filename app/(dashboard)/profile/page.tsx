'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { User as UserIcon, Mail, Lock, Fingerprint, Shield, Terminal, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GradientDivider from '@/components/ui/GradientDivider';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        surname: user.surname || '',
        username: user.username || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = {
        name: formData.name,
        surname: formData.surname,
        username: formData.username,
        email: formData.email,
      };

      if (formData.password && formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      const res = await api.put('/auth/me', payload);

      updateUser(res.data);

      setFormData(prev => ({ ...prev, password: '' }));
      toast.success('Identidade tática atualizada com sucesso.');
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Falha ao sincronizar dados com Horus.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <header className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Fingerprint size={16} className="text-red-600" />
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Credenciamento Digital</p>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none">
              PERFIL DO <span className="text-red-600">OPERADOR</span>
            </h1>
            <p className="text-neutral-500 text-sm mt-2">Gerencie suas credenciais de acesso e informações de campo.</p>
          </div>
        </div>
      </header>

      <GradientDivider />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cartão de Identidade Visual */}
        <div className="space-y-6">
          <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800 rounded-2xl p-8 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 opacity-20 group-hover:opacity-100 transition-opacity" />

            <div className="h-24 w-24 rounded-full bg-red-950/20 border border-red-900/30 flex items-center justify-center text-red-500 mb-6 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
              <UserIcon size={48} strokeWidth={1.5} />
            </div>

            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-1">{user?.username}</h2>
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-6">
              Status: {user?.is_admin ? 'Alpha-01' : 'Operativo'}
            </p>

            <div className="w-full space-y-3">
              <div className="flex justify-between items-center px-4 py-2 bg-neutral-950 rounded-lg border border-neutral-800/50">
                <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">Nível de Acesso</span>
                <span className="text-[10px] font-black text-red-600 uppercase font-mono">
                  {user?.is_admin ? 'Root' : 'Padrão'}
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-2 bg-neutral-950 rounded-lg border border-neutral-800/50">
                <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">Protocolo</span>
                <span className="text-[10px] font-black text-white uppercase font-mono">Horus-v2.6</span>
              </div>
            </div>
          </div>

          <div className="bg-red-600/5 border border-red-900/10 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={14} className="text-red-500" />
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Segurança da Rede</p>
            </div>
            <p className="text-[11px] text-neutral-500 italic leading-relaxed">
              Mantenha seu codinome e e-mail institucional sempre atualizados para garantir a integridade dos seus logs de missão.
            </p>
          </div>
        </div>

        {/* Formulário de Edição */}
        <div className="lg:col-span-2 bg-neutral-900/30 border border-neutral-800/50 rounded-2xl p-8 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Terminal size={12} /> Identificação Básica
                </p>
              </div>
              <Input
                label="Nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Eduardo"
              />
              <Input
                label="Sobrenome"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                placeholder="Ex: Costa"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Mail size={12} /> Comunicação e Acesso
                </p>
              </div>
              <Input
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="m1st3r_h4ck3r"
              />
              <Input
                label="E-mail de Estudante"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="aluno@al.insper.edu.br"
              />
            </div>

            <div className="pt-6">
              <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Lock size={12} /> Segurança de Terminal
              </p>
              <Input
                label="Nova Senha (Opcional)"
                type="password"
                placeholder="Deixe em branco para manter a atual"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="pt-4">
              <Button type="submit" loading={loading}>
                <div className="flex items-center justify-center gap-2">
                  <Save size={18} />
                  SINCRONIZAR IDENTIDADE
                </div>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}