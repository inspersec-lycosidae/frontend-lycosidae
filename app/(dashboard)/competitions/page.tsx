'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Competition } from '@/lib/types';
import { Trophy, Calendar, Hash, ArrowRight, Plus, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function CompetitionsPage() {
  const { user } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const fetchCompetitions = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<Competition[]>('/competitions/');
      setCompetitions(res.data);
    } catch (err) {
      console.error("Erro ao carregar competições:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCompetitions(); }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode) return;

    setIsJoining(true);
    try {
      // Endpoint conforme app/routers/competitions.py
      await api.post('/competitions/join', { invite_code: inviteCode });
      setInviteCode('');
      fetchCompetitions();
      alert("Sucesso! Você entrou na competição.");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Código inválido ou erro ao entrar.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Header com CTA de Entrada */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl border-l-4 border-l-red-600">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="text-yellow-500" size={32} /> Minhas Competições
          </h1>
          <p className="text-neutral-400 mt-1">Participe de eventos, resolva desafios e suba no ranking.</p>
        </div>

        <form onSubmit={handleJoin} className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input
              type="text"
              placeholder="Código de Convite"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-red-600 outline-none transition"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            />
          </div>
          <button
            type="submit"
            disabled={isJoining || !inviteCode}
            className="bg-red-600 hover:bg-red-500 disabled:bg-neutral-800 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition"
          >
            {isJoining ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            Entrar
          </button>
        </form>
      </div>

      {/* Grid de Competições */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-neutral-900/50 border border-neutral-800 rounded-xl animate-pulse" />
          ))
        ) : competitions.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-neutral-900/30 border border-dashed border-neutral-800 rounded-2xl">
            <Sparkles className="mx-auto text-neutral-600 mb-4" size={48} />
            <p className="text-neutral-500 font-medium">Você ainda não participa de nenhuma competição.</p>
            <p className="text-neutral-600 text-sm mt-1">Insira um código acima para começar!</p>
          </div>
        ) : (
          competitions.map((comp) => (
            <Link
              key={comp.id}
              href={`/competitions/${comp.id}`}
              className="group bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-red-600/50 hover:shadow-2xl hover:shadow-red-900/10 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${comp.status === 'ativa'
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                      : comp.status === 'em_breve'
                        ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                        : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                    }`}
                >
                  {comp.status === 'ativa'
                    ? 'Em andamento'
                    : comp.status === 'em breve'
                      ? 'Em breve'
                      : 'Finalizada'}
                </div>

                <Trophy
                  size={20}
                  className="text-neutral-700 group-hover:text-yellow-500 transition-colors"
                />
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                {comp.name}
              </h3>

              <div className="space-y-2 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-neutral-500" />
                  <span>Início: {new Date(comp.start_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-neutral-500" />
                  <span>Fim: {new Date(comp.end_date).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-between items-center">
                <span className="text-xs text-neutral-500 font-mono">ID: {comp.id.split('-')[0]}</span>
                <span className="text-red-500 text-sm font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver Desafios <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}