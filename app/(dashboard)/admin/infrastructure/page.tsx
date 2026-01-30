'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Container, Exercise } from '@/lib/types';
import {
  Server,
  Activity,
  Trash2,
  RefreshCw,
  Globe,
  Database,
  ShieldAlert,
  Loader2,
  Zap,
  Terminal
} from 'lucide-react';
import toast from 'react-hot-toast';
import GradientDivider from '@/components/ui/GradientDivider';

export default function InfrastructurePage() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [contRes, exRes] = await Promise.all([
        api.get<Container[]>('/containers/'),
        api.get<Exercise[]>('/exercises/')
      ]);
      setContainers(contRes.data);
      setExercises(exRes.data);
    } catch (err) {
      toast.error("Falha ao sincronizar com os servidores Horus.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getExerciseName = (id: string) => {
    return exercises.find(ex => ex.id === id)?.name || "Alvo Desconhecido";
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/containers/sync');
      toast.success(`Sincronização finalizada. ${res.data.cleaned_up} registros órfãos removidos.`);
      fetchData();
    } catch (err) {
      toast.error("Erro no protocolo de sincronização.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKillContainer = async (containerId: string) => {
    if (!confirm("AVISO: Esta ação irá derrubar a instância ativa. Confirmar interrupção?")) return;

    setIsActionLoading(containerId);
    try {
      await api.delete(`/containers/${containerId}`);
      toast.success("Instância encerrada com sucesso.");
      fetchData();
    } catch (err) {
      toast.error("Falha ao encerrar o container.");
    } finally {
      setIsActionLoading(null);
    }
  };

  const handlePanicButton = async () => {
    if (!confirm("ALERTA CRÍTICO: Isto irá derrubar TODA a infraestrutura ativa. Deseja prosseguir?")) return;

    setIsLoading(true);
    try {
      for (const container of containers) {
        await api.delete(`/containers/${container.id}`);
      }
      toast.success("Comando de pânico executado: Toda a infraestrutura foi neutralizada.");
      fetchData();
    } catch (err) {
      toast.error("Erro durante a execução do comando de pânico.");
    } finally {
      setIsLoading(false);
    }
  };

  const activeCount = containers.filter(c => c.is_active).length;

  if (isLoading && containers.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="animate-spin text-red-600" size={40} />
      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em]">Mapeando Infraestrutura...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header de Comando de Infra */}
      <header className="relative">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-red-600" />
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Orquestração de Servidores</p>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none">
              MONITORAMENTO DE <span className="text-red-600">INFRAESTRUTURA</span>
            </h1>
            <p className="text-neutral-500 text-sm mt-2">Status em tempo real dos containers e instâncias Docker da rede Horus.</p>
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <button
              onClick={handleSync}
              disabled={isLoading}
              className="flex-1 lg:flex-none bg-neutral-900 border border-neutral-800 px-5 py-2.5 rounded-xl font-black text-[10px] tracking-widest text-neutral-400 hover:text-white hover:border-neutral-700 transition-all flex items-center justify-center gap-2 uppercase"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Sincronizar
            </button>
            <button
              onClick={handlePanicButton}
              className="flex-1 lg:flex-none bg-red-600/10 text-red-500 border border-red-600/20 px-5 py-2.5 rounded-xl font-black text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-900/10 flex items-center justify-center gap-2 uppercase"
            >
              <ShieldAlert size={16} /> Pânico
            </button>
          </div>
        </div>
      </header>

      <GradientDivider />

      {/* Grid de Métricas de Infra */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfraStatCard
          label="Instâncias Ativas"
          value={activeCount}
          icon={Activity}
          status="online"
          color="text-green-500"
        />
        <InfraStatCard
          label="Registros de Banco"
          value={containers.length}
          icon={Database}
          color="text-red-600"
        />
        <InfraStatCard
          label="Pendentes / Inativos"
          value={containers.length - activeCount}
          icon={Server}
          color="text-neutral-600"
        />
      </div>

      {/* Tabela de Orquestração */}
      <div className="bg-neutral-900/30 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-950/50 border-b border-neutral-800 text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em]">
              <th className="px-6 py-5">Codinome do Desafio</th>
              <th className="px-6 py-5 text-center">Docker ID</th>
              <th className="px-6 py-5">Vetor de Conexão</th>
              <th className="px-6 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Controle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {containers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-neutral-600 italic text-sm">
                  Nenhum container em execução no momento.
                </td>
              </tr>
            ) : (
              containers.map((container) => (
                <tr key={container.id} className="hover:bg-red-600/1 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                      {getExerciseName(container.exercises_id)}
                    </div>
                    <div className="text-[10px] text-neutral-600 font-mono mt-1 uppercase">ID: {container.exercises_id.substring(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <code className="text-[10px] bg-neutral-950 px-2 py-1 rounded text-red-500 border border-neutral-800 font-mono uppercase">
                      {container.docker_id.substring(0, 12)}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-neutral-500 text-[11px] font-mono lowercase">
                      <Globe size={14} className="text-neutral-700" />
                      {container.connection}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 ${container.is_active
                          ? 'border-green-500/20 text-green-500 bg-green-500/5'
                          : 'border-neutral-800 text-neutral-600 bg-neutral-900/50'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${container.is_active ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-neutral-700'}`} />
                        {container.is_active ? 'Ativo' : 'Inativo'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleKillContainer(container.id)}
                        disabled={isActionLoading === container.id}
                        className="p-2.5 text-red-500 border border-red-600/20 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-lg disabled:opacity-30"
                        title="Derrubar Instância"
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

// Subcomponente de Card de Estatística de Infra
function InfraStatCard({ label, value, icon: Icon, status, color }: any) {
  return (
    <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-6 rounded-2xl group hover:border-red-900/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 ${color}`}>
          <Icon size={22} />
        </div>
        {status && (
          <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-full uppercase tracking-widest border border-green-500/20">
            {status}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-white tracking-tighter">{value}</span>
        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
}