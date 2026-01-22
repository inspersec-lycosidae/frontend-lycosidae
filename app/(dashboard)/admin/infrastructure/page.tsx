'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Container, Exercise } from '@/lib/types'; // Importado Exercise para o mapeamento
import {
  Server, Activity, Trash2, RefreshCw,
  Globe, Database, Skull, ShieldAlert,
  Loader2
} from 'lucide-react';

export default function InfrastructurePage() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]); // Estado para nomes dos exercícios
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Busca containers e exercícios em paralelo para o mapeamento de nomes
      const [contRes, exRes] = await Promise.all([
        api.get<Container[]>('/containers/'),
        api.get<Exercise[]>('/exercises/')
      ]);
      setContainers(contRes.data);
      setExercises(exRes.data);
    } catch (err) {
      console.error("Erro ao listar infraestrutura:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Helper para encontrar o nome do exercício pelo ID
  const getExerciseName = (id: string) => {
    return exercises.find(ex => ex.id === id)?.name || "Exercício Desconhecido";
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/containers/sync');
      alert(`Sincronização concluída! ${res.data.cleaned_up} registros órfãos removidos.`);
      fetchData();
    } catch (err) {
      alert("Falha ao sincronizar infraestrutura.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKillContainer = async (containerId: string) => {
    if (!confirm("Deseja realmente interromper este container?")) return;

    setIsActionLoading(containerId);
    try {
      await api.delete(`/containers/${containerId}`);
      fetchData();
    } catch (err) {
      alert("Falha ao remover container.");
    } finally {
      setIsActionLoading(null);
    }
  };

  const handlePanicButton = async () => {
    if (!confirm("AVISO: Isso irá derrubar TODA a infraestrutura ativa. Continuar?")) return;

    setIsLoading(true);
    try {
      for (const container of containers) {
        await api.delete(`/containers/${container.id}`);
      }
      alert("Comando de pânico executado.");
      fetchData();
    } catch (err) {
      alert("Erro durante execução do pânico.");
    } finally {
      setIsLoading(false);
    }
  };

  const activeCount = containers.filter(c => c.is_active).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Server className="text-blue-500" size={32} /> Monitoramento de Infra
          </h1>
          <p className="text-neutral-400 mt-1">Status em tempo real dos containers e orquestração Docker.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSync}
            disabled={isLoading}
            className="bg-blue-600/10 text-blue-500 border border-blue-600/20 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-600 hover:text-white transition disabled:opacity-50"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            Sincronizar
          </button>
          <button
            onClick={handlePanicButton}
            className="bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-600 hover:text-white transition"
          >
            <Skull size={18} /> Pânico
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <Activity className="text-green-500" size={24} />
            <span className="text-[10px] text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full uppercase font-bold">Online</span>
          </div>
          <div className="text-3xl font-bold text-white">{activeCount}</div>
          <div className="text-neutral-500 text-sm">Containers Ativos</div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <Database className="text-blue-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-white">{containers.length}</div>
          <div className="text-neutral-500 text-sm">Registros no Banco</div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <ShieldAlert className="text-orange-500" size={24} />
          </div>
          <div className="text-3xl font-bold text-white">
            {containers.length - activeCount}
          </div>
          <div className="text-neutral-500 text-sm">Inativos / Pendentes</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-950 border-b border-neutral-800 text-xs text-neutral-500 uppercase tracking-widest">
              <th className="p-5">Desafio</th>
              <th className="p-5">Docker ID</th>
              <th className="p-5">Conexão</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {isLoading && containers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-neutral-500">
                  <Loader2 size={32} className="animate-spin mx-auto mb-2 text-blue-500" />
                  Carregando infraestrutura...
                </td>
              </tr>
            ) : containers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-neutral-500 italic">
                  Nenhum container registrado.
                </td>
              </tr>
            ) : (
              containers.map((container) => (
                <tr key={container.id} className="hover:bg-neutral-800/30 transition">
                  <td className="p-5">
                    {/* Alterado para mostrar o Nome em vez do ID */}
                    <div className="font-bold text-white">{getExerciseName(container.exercises_id)}</div>
                    <div className="text-[10px] text-neutral-600 font-mono">{container.exercises_id}</div>
                  </td>
                  <td className="p-5">
                    <code className="text-[10px] bg-neutral-950 px-2 py-1 rounded text-blue-400 border border-blue-900/30 font-mono">
                      {container.docker_id.substring(0, 12)}
                    </code>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-neutral-400 text-sm font-mono">
                      <Globe size={14} className="text-neutral-600" />
                      {/* Corrigido para não duplicar a porta na URL */}
                      {container.connection}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${container.is_active ? 'text-green-500' : 'text-neutral-500'}`}>
                      <span className={`w-2 h-2 rounded-full ${container.is_active ? 'bg-green-500 animate-pulse' : 'bg-neutral-700'}`} />
                      {container.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleKillContainer(container.id)}
                        disabled={isActionLoading === container.id}
                        className="p-2 bg-red-600/10 text-red-500 border border-red-600/20 rounded hover:bg-red-600 hover:text-white transition disabled:opacity-30"
                        title="Derrubar Container"
                      >
                        {isActionLoading === container.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}