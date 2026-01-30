'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Competition } from '@/lib/types';
import { X, Loader2, ShieldAlert, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import GradientDivider from '@/components/ui/GradientDivider';

export default function CompetitionLinkModal({ exerciseId, onClose }: { exerciseId: string | null, onClose: () => void }) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [linkedIds, setLinkedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!exerciseId) return;
    setLoading(true);
    try {
      const [allComp, linkedComp] = await Promise.all([
        api.get<Competition[]>('/competitions/'),
        api.get<Competition[]>(`/exercises/${exerciseId}/competitions`)
      ]);
      setCompetitions(allComp.data);
      setLinkedIds(linkedComp.data.map(c => c.id));
    } catch (err) {
      toast.error("Falha ao mapear vínculos de operação.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [exerciseId]);

  const toggleLink = async (compId: string, isLinked: boolean) => {
    try {
      if (isLinked) {
        await api.delete(`/exercises/${exerciseId}/competition/${compId}`);
        toast.success("Exercício desvinculado da operação.");
      } else {
        await api.post(`/exercises/${exerciseId}/link-competition/${compId}`);
        toast.success("Exercício vinculado à operação.");
      }
      fetchData();
    } catch (err) {
      toast.error("Falha no vínculo.");
    }
  };

  if (!exerciseId) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-600 to-transparent opacity-50" />

        {/* Header Tático */}
        <div className="p-8 border-b border-neutral-800/50 flex justify-between items-center bg-neutral-950/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert size={14} className="text-red-600" />
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Gestão de Ativos</p>
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              GERIR <span className="text-red-600 text-3xl">VÍNCULOS</span>
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-600 hover:text-white transition-all"><X size={24} /></button>
        </div>

        {/* Lista de Operações */}
        <div className="p-8 max-h-112.5 overflow-y-auto space-y-3 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-red-600" size={32} />
              <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest italic">Sincronizando Rede...</p>
            </div>
          ) : competitions.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-neutral-800 rounded-3xl">
              <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest">Nenhuma operação tática disponível.</p>
            </div>
          ) : (
            competitions.map(comp => {
              const isLinked = linkedIds.includes(comp.id);
              return (
                <div key={comp.id} className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-red-900/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg border ${isLinked ? "border-green-500/20 text-green-500 bg-green-500/5" : "border-neutral-800 text-neutral-700"} group-hover:scale-110 transition-transform`}>
                      <Target size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">{comp.name}</span>
                      <p className="text-[9px] font-mono text-neutral-600 uppercase">Status: {comp.status}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleLink(comp.id, isLinked)}
                    className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all border shadow-lg ${isLinked
                      ? "bg-red-600/10 text-red-500 border-red-600/20 hover:bg-red-600 hover:text-white"
                      : "bg-green-600/10 text-green-500 border-green-500/20 hover:bg-green-600 hover:text-white shadow-green-900/10"
                      }`}
                  >
                    {isLinked ? "DESVINCULAR" : "VINCULAR"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <GradientDivider />
        <div className="p-6 bg-neutral-950/30 text-right">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-neutral-800 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-700 transition-all"
          >
            ENCERRAR GESTÃO
          </button>
        </div>
      </div>
    </div>
  );
}