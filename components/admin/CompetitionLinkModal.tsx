// components/admin/CompetitionLinkModal.tsx
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Competition } from '@/lib/types';
import { X, Link as LinkIcon, Trophy, Loader2, Unlink } from 'lucide-react';

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
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [exerciseId]);

  const toggleLink = async (compId: string, isLinked: boolean) => {
    try {
      if (isLinked) {
        await api.delete(`/exercises/${exerciseId}/competition/${compId}`);
      } else {
        await api.post(`/exercises/${exerciseId}/link-competition/${compId}`);
      }
      fetchData();
    } catch (err) { alert("Falha na operação."); }
  };

  if (!exerciseId) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
          <h3 className="text-xl font-bold text-white flex items-center gap-2"><LinkIcon className="text-red-600" /> Gerir Vínculos</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-white"><X size={24} /></button>
        </div>
        <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
          {loading ? <Loader2 className="animate-spin mx-auto text-red-600" /> : competitions.map(comp => {
            const isLinked = linkedIds.includes(comp.id);
            return (
              <div key={comp.id} className="flex items-center justify-between p-3 bg-neutral-800/30 border border-neutral-800 rounded-xl hover:bg-neutral-800/50 transition">
                <div className="flex items-center gap-3">
                  <Trophy size={16} className={isLinked ? "text-green-500" : "text-neutral-600"} />
                  <span className="text-sm font-bold text-white">{comp.name}</span>
                </div>
                <button
                  onClick={() => toggleLink(comp.id, isLinked)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${isLinked ? "bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white" : "bg-green-600/10 text-green-500 hover:bg-green-600 hover:text-white"
                    }`}
                >
                  {isLinked ? <><Unlink size={14} /> Vinculado</> : <><LinkIcon size={14} /> Vincular</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}