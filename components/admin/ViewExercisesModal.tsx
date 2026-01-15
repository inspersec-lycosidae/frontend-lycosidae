'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Exercise } from '@/lib/types';
import { X, Terminal, Trash2, Loader2 } from 'lucide-react';

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
      console.error("Erro ao carregar exercícios vinculados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinkedExercises();
  }, [competitionId]);

  const handleUnlink = async (exId: string) => {
    if (!confirm("Deseja remover este exercício desta competição?")) return;
    try {
      await api.delete(`/exercises/${exId}/competition/${competitionId}`);
      fetchLinkedExercises(); // Atualiza a lista
    } catch (err) {
      alert("Erro ao desvincular exercício.");
    }
  };

  if (!competitionId) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-3xl rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="text-red-500" size={20} /> Exercícios em: {competitionName}
            </h3>
            <p className="text-neutral-500 text-xs mt-1">Visualize e gerencie os desafios ativos nesta competição.</p>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Lista de Exercícios */}
        <div className="p-6 max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
              <Loader2 className="animate-spin mb-2" size={32} />
              <p className="text-sm italic">Buscando desafios vinculados...</p>
            </div>
          ) : exercises.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl">
              <p className="text-neutral-500 text-sm">Nenhum exercício vinculado a esta competição ainda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exercises.map(ex => (
                <div key={ex.id} className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-xl group hover:border-red-900/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center text-neutral-500 group-hover:text-red-500 transition-colors">
                      <Terminal size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{ex.name}</div>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 border border-neutral-800 px-1.5 rounded">{ex.difficulty}</span>
                        <span className="text-[10px] font-mono text-red-500">{ex.points} pts</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnlink(ex.id)}
                    className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Remover da Competição"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-neutral-800 text-white text-sm font-bold rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}