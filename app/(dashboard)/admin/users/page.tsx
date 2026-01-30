'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User } from '@/lib/types';
import { Users, Shield, ShieldAlert, Trash2, Mail, Terminal, Fingerprint, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import GradientDivider from '@/components/ui/GradientDivider';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get<User[]>('/auth/users');
      setUsers(res.data);
    } catch (err) {
      toast.error("Falha ao sincronizar base de operadores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleAdmin = async (user: User) => {
    const action = user.is_admin ? "revogar privilégios do" : "conceder acesso Alpha ao";
    if (!confirm(`Confirmar protocolo para ${action} operador ${user.username}?`)) return;

    try {
      await api.put(`/auth/users/${user.id}`, { is_admin: !user.is_admin });
      toast.success("Credenciais de acesso atualizadas no terminal.");
      fetchUsers();
    } catch (err) {
      toast.error("Erro ao modificar nível de autorização.");
    }
  };

  const deleteUser = async (user: User) => {
    if (!confirm(`AVISO CRÍTICO: Eliminar permanentemente o registo do operador ${user.username}?`)) return;

    try {
      await api.delete(`/auth/users/${user.id}`);
      toast.success("Registro expurgado do sistema.");
      fetchUsers();
    } catch (err) {
      toast.error("Falha na eliminação do ativo.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-red-600" size={40} />
      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em]">Mapeando Operadores...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header de Gestão Horus */}
      <header className="relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Fingerprint size={16} className="text-red-600" />
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Gestão de Ativos Humanos</p>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none">
              CONTROLE DE <span className="text-red-600">OPERADORES</span>
            </h1>
            <p className="text-neutral-500 text-sm mt-2">Monitore permissões e autorizações de acesso à rede Horus.</p>
          </div>
          <div className="hidden lg:block text-right font-mono text-[10px] text-neutral-700 uppercase">
            <p>Total Actives: {users.length}</p>
          </div>
        </div>
      </header>

      <GradientDivider />

      {/* Tabela de Inteligência */}
      <div className="bg-neutral-900/30 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-950/50 border-b border-neutral-800 text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em]">
              <th className="px-8 py-5">Identificação</th>
              <th className="px-6 py-5 text-center">Email</th>
              <th className="px-6 py-5 text-center">Nível de Acesso</th>
              <th className="px-8 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-neutral-600 italic text-sm">
                  Nenhum operador identificado no perímetro.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-red-600/1 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {/* Avatar Tático */}
                      <div className="w-11 h-11 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center text-red-600 font-black shadow-inner group-hover:border-red-900/50 transition-colors">
                        {u.name[0].toUpperCase()}{u.surname[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                          {u.name} {u.surname}
                        </div>
                        <div className="text-[10px] text-neutral-600 font-mono tracking-tighter uppercase">
                          @{u.username} • <span className="text-neutral-700">ID: {u.id.substring(0, 8)}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2 text-neutral-500 text-xs font-mono lowercase">
                      <Mail size={14} className="text-red-900/40" /> {u.email}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border flex items-center gap-2 ${u.is_admin
                        ? 'border-red-500/20 text-red-500 bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.05)]'
                        : 'border-blue-500/20 text-blue-500 bg-blue-500/5'
                        }`}>
                        {u.is_admin ? <ShieldAlert size={10} /> : <Terminal size={10} />}
                        {u.is_admin ? 'ALPHA-ADMIN' : 'OPERADOR'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleAdmin(u)}
                        className={`p-2.5 rounded-lg border transition-all duration-300 ${u.is_admin
                          ? 'bg-neutral-800 text-neutral-500 border-neutral-700 hover:text-white hover:border-neutral-500'
                          : 'text-blue-500 border-blue-500/20 hover:bg-blue-600 hover:text-white shadow-lg shadow-blue-900/10'
                          }`}
                        title={u.is_admin ? "Revogar Admin" : "Conceder Acesso Alpha"}
                      >
                        {u.is_admin ? <ShieldAlert size={16} /> : <Shield size={16} />}
                      </button>
                      <button
                        onClick={() => deleteUser(u)}
                        className="p-2.5 text-red-500 border border-red-600/20 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg shadow-red-900/10"
                        title="Eliminar Registro"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Informativo */}
      <div className="flex justify-center">
        <div className="bg-neutral-900/50 border border-neutral-800 px-6 py-3 rounded-full flex items-center gap-4">
          <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
          <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
            Todas as alterações de privilégios são registradas pelo protocolo Horus
          </p>
        </div>
      </div>
    </div>
  );
}