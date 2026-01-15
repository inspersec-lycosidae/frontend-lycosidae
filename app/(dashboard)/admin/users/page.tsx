'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User } from '@/lib/types';
import { Users, Shield, ShieldAlert, Trash2, Mail, User as UserIcon } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get<User[]>('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Erro ao carregar utilizadores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleAdmin = async (user: User) => {
    const action = user.is_admin ? "remover privilégios de admin" : "tornar admin";
    if (!confirm(`Deseja realmente ${action} para ${user.username}?`)) return;

    try {
      await api.put(`/auth/users/${user.id}`, { is_admin: !user.is_admin });
      fetchUsers();
    } catch (err) {
      alert("Erro ao alterar cargo.");
    }
  };

  const deleteUser = async (user: User) => {
    if (!confirm(`ATENÇÃO: Deseja apagar permanentemente a conta de ${user.username}?`)) return;

    try {
      await api.delete(`/auth/users/${user.id}`);
      fetchUsers();
    } catch (err) {
      alert("Erro ao apagar utilizador.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="text-red-600" size={32} /> Gestão de Membros
          </h1>
          <p className="text-neutral-400 mt-1">Administre as permissões e contas da organização.</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-950 border-b border-neutral-800 text-xs text-neutral-500 uppercase tracking-widest">
              <th className="p-5">Membro</th>
              <th className="p-5">Contato</th>
              <th className="p-5">Cargo</th>
              <th className="p-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-neutral-800/30 transition group">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-red-500 font-bold border border-neutral-700">
                      {u.name[0]}{u.surname[0]}
                    </div>
                    <div>
                      <div className="font-bold text-white">{u.name} {u.surname}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">@{u.username}</div>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2 text-neutral-400 text-sm italic">
                    <Mail size={14} /> {u.email}
                  </div>
                </td>
                <td className="p-5">
                  <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold border flex items-center gap-1 w-fit ${u.is_admin ? 'border-red-500/30 text-red-500 bg-red-500/5' : 'border-blue-500/30 text-blue-500 bg-blue-500/5'
                    }`}>
                    {u.is_admin ? <Shield size={10} /> : <UserIcon size={10} />}
                    {u.is_admin ? 'Admin' : 'Aluno'}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => toggleAdmin(u)}
                      className={`p-2 rounded transition border ${u.is_admin
                        ? 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                        : 'bg-red-600/10 text-red-500 border-red-600/20 hover:bg-red-600 hover:text-white'
                        }`}
                      title={u.is_admin ? "Remover Admin" : "Promover a Admin"}
                    >
                      {u.is_admin ? <ShieldAlert size={16} /> : <Shield size={16} />}
                    </button>
                    <button
                      onClick={() => deleteUser(u)}
                      className="p-2 bg-red-600/10 text-red-500 border border-red-600/20 rounded hover:bg-red-600 hover:text-white transition"
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