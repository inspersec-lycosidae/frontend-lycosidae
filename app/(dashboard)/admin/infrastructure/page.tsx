'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Container } from '@/lib/types';
import { Server, Activity, Globe, Power, Trash2, Cpu, RefreshCw, AlertTriangle } from 'lucide-react';

export default function AdminInfrastructurePage() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContainers = async () => {
    setLoading(true);
    try {
      // Endpoint que lista todos os containers registados no sistema
      const res = await api.get<Container[]>('/containers/');
      setContainers(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar infraestrutura:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContainers(); }, []);

  const handleKillContainer = async (containerId: string) => {
    if (!confirm("AVISO: Isto irá encerrar a instância do aluno e remover o container do Docker. Continuar?")) return;

    try {
      // Endpoint que remove o registo e interrompe o container
      await api.delete(`/containers/${containerId}`);
      fetchContainers(); // Atualiza a lista
    } catch (err) {
      alert("Erro ao encerrar container.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header com Stats Rápidas */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Server className="text-red-600" size={32} /> Monitoramento de Infra
          </h1>
          <p className="text-neutral-400 mt-1">Gestão de instâncias Docker em tempo real.</p>
        </div>
        <button
          onClick={fetchContainers}
          className="p-2 bg-neutral-800 text-neutral-400 rounded-lg hover:text-white transition border border-neutral-700"
          title="Atualizar Estado"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><Activity size={24} /></div>
          <div>
            <div className="text-2xl font-bold text-white">{containers.filter(c => c.is_active).length}</div>
            <div className="text-xs text-neutral-500 uppercase font-bold">Instâncias Ativas</div>
          </div>
        </div>
        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-lg text-red-600"><Cpu size={24} /></div>
          <div>
            <div className="text-2xl font-bold text-white">{containers.length}</div>
            <div className="text-xs text-neutral-500 uppercase font-bold">Total de Registos</div>
          </div>
        </div>
      </div>

      {/* Tabela de Containers */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-950 border-b border-neutral-800 text-xs text-neutral-500 uppercase tracking-widest">
              <th className="p-5">Docker ID / Imagem</th>
              <th className="p-5">Exercício ID</th>
              <th className="p-5">Endereço de Conexão</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {containers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-neutral-500 italic">
                  Nenhum container ativo ou registado no momento.
                </td>
              </tr>
            ) : (
              containers.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-800/30 transition group">
                  <td className="p-5">
                    <div className="font-mono text-sm text-red-500 font-bold">{c.docker_id?.slice(0, 12) || 'N/A'}</div>
                    <div className="text-[10px] text-neutral-500 mt-1">{c.image_tag}</div>
                  </td>
                  <td className="p-5 text-xs text-neutral-400 font-mono">
                    {c.exercises_id}
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-sm text-neutral-300 bg-black px-3 py-1 rounded border border-neutral-800 w-fit">
                      <Globe size={14} className="text-blue-500" /> {c.connection}:{c.port}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold border flex items-center gap-1 w-fit ${c.is_active ? 'border-green-500/30 text-green-500 bg-green-500/5' : 'border-neutral-700 text-neutral-600 bg-neutral-800'
                      }`}>
                      <Power size={10} />
                      {c.is_active ? 'Rodando' : 'Offline'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => handleKillContainer(c.id)}
                      className="p-2 bg-red-600/10 text-red-500 border border-red-600/20 rounded hover:bg-red-600 hover:text-white transition"
                      title="Kill Instance"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-red-900/10 border border-red-900/20 p-4 rounded-xl flex gap-3 items-start text-red-500/80">
        <AlertTriangle className="shrink-0" size={20} />
        <p className="text-xs italic leading-relaxed">
          <strong>Aviso de Infraestrutura:</strong> O encerramento (Kill) remove o container do host Docker e limpa o registo no Interpreter. Utilize esta função para limpar containers zumbis ou instâncias abusivas.
        </p>
      </div>
    </div>
  );
}