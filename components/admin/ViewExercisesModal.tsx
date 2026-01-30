'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Exercise } from '@/lib/types';
import { X, Terminal, Trash2, Loader2, ShieldAlert, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import GradientDivider from '@/components/ui/GradientDivider';

interface ViewExercisesModalProps {
  competitionId: string | null;
  competitionName: string;
  onClose: () => void;
}

export default function ViewExercisesModal({ competitionId, competitionName, onClose }: ViewExercisesModalProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinkedExercises = async () => {
    if (!competitionId) return;
    setLoading(true);
    try {
      const res = await api.get<Exercise[]>(`/competitions/${competitionId}/exercises`);
      setExercises(res.data);
    } catch (err) {
      toast.error("Erro ao descriptografar alvos vinculados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinkedExercises();
  }, [competitionId]);

  const handleUnlink = async (exId: string) => {
    if (!confirm("Confirmar desvinculação do alvo desta missão?")) return;
    try {
      await api.delete(`/exercises/${exId}/competition/${competitionId}`);
      toast.success("Alvo removido do dossiê.");
      fetchLinkedExercises();
    } catch (err) {
      toast.error("Falha ao processar desvinculação.");
    }
  };

  if (!competitionId) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-3xl rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-600 to-transparent opacity-50" />

        {/* Header Tático */}
        <div className="p-8 border-b border-neutral-800/50 flex justify-between items-center bg-neutral-950/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert size={14} className="text-red-600" />
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Ambiente de Operação</p>
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              ALVOS EM: <span className="text-red-600">{competitionName}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-600 hover:text-white hover:bg-neutral-800 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo Central */}
        <div className="p-8 max-h-125 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="animate-spin text-red-600" size={40} />
              <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Sincronizando Dossiês...</p>
            </div>
          ) : exercises.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-neutral-800 rounded-3xl bg-neutral-950/20">
              <Target className="mx-auto text-neutral-800 mb-4" size={48} />
              <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest">Nenhum alvo designado para esta missão.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exercises.map(ex => (
                <div key={ex.id} className="flex items-center justify-between p-4 bg-neutral-950/50 border border-neutral-800 rounded-xl group hover:border-red-900/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center text-neutral-600 group-hover:text-red-500 transition-colors shadow-inner">
                      <Terminal size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">
                        {ex.name}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[9px] uppercase font-black text-neutral-600 border border-neutral-800 px-2 py-0.5 rounded tracking-widest">
                          {ex.difficulty || 'Normal'}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-red-600 tracking-tighter">
                          {ex.points} XP
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnlink(ex.id)}
                    className="p-3 text-neutral-600 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all border border-transparent hover:border-red-900/20"
                    title="Remover do Dossiê"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}