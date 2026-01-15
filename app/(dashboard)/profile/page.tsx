'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Shield, User as UserIcon, Mail, Lock, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Erro ao atualizar perfil';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações de Perfil</h1>
        <p className="text-neutral-400">Atualize suas informações.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Status do Usuário */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 h-fit">
          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-red-600/10 flex items-center justify-center text-red-500 mb-4">
              <UserIcon size={40} />
            </div>
            <h2 className="text-white font-bold text-lg">{user?.username}</h2>
            <div className="mt-2 px-3 py-1 bg-neutral-800 rounded-full text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Shield size={12} />
              {user?.is_admin ? 'Administrador' : 'Aluno'}
            </div>
          </div>
        </div>

        {/* Formulário Principal */}
        <div className="md:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-red-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase">Sobrenome</label>
                <input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-500 uppercase">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                <input
                  type="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-500 uppercase">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase flex items-center gap-2">
                  <Lock size={12} /> Alterar Senha (opcional)
                </label>
                <input
                  type="password"
                  placeholder="Deixe em branco para manter a atual"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:ring-1 focus:ring-red-600 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? 'Processando...' : 'Atualizar Perfil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}