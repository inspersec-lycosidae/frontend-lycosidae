'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Competition } from '@/lib/types';
import { Hash, Loader2, Sparkles, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';
import OperationCard from '@/components/competitions/OperationCard';
import GradientDivider from '@/components/ui/GradientDivider';
import Button from '@/components/ui/Button';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const fetchCompetitions = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<Competition[]>('/competitions/');
      
      const sortedOperations = [...res.data].sort((a, b) => {
        const priority: Record<string, number> = { ativa: 0, em_breve: 1, finalizada: 2 };
        const pA = priority[a.status] ?? 3;
        const pB = priority[b.status] ?? 3;

        if (pA !== pB) return pA - pB;

        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      });

      setCompetitions(sortedOperations);
    } catch (err) {
      toast.error("Falha na sincronização com a rede Horus.");
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
      await api.post('/competitions/join', { invite_code: inviteCode });
      setInviteCode('');
      toast.success("Acesso concedido. Nova operação adicionada ao seu terminal.");
      fetchCompetitions();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Código de acesso inválido ou expirado.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header Tático */}
      <header className="relative">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-neutral-900/40 border border-neutral-800 p-8 rounded-2xl backdrop-blur-md">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-red-600" />
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Operações Disponíveis</p>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight leading-none">CENTRAL DE <span className="text-red-600">MISSÕES</span></h1>
            <p className="text-neutral-500 text-sm max-w-md mt-2">Monitore o progresso das suas operações de campo ou descriptografe novos dossiês.</p>
          </div>

          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
            <div className="relative flex-1 sm:w-72">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" size={18} />
              <input
                type="text"
                placeholder="CÓDIGO DE ACESSO"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-3.5 pl-12 pr-4 text-white font-mono text-xs focus:border-red-600 focus:ring-1 focus:ring-red-600/20 outline-none transition-all placeholder-neutral-700"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              />
            </div>
            <div className="sm:w-44">
              <Button type="submit" loading={isJoining} disabled={!inviteCode}>
                DESBLOQUEAR
              </Button>
            </div>
          </form>
        </div>
      </header>

      <GradientDivider />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-72 bg-neutral-900/50 border border-neutral-800 rounded-xl animate-pulse" />
          ))
        ) : competitions.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-neutral-900/20 border border-dashed border-neutral-800 rounded-3xl">
            <Sparkles className="mx-auto text-neutral-700 mb-6" size={56} />
            <h3 className="text-white font-bold text-lg">Nenhum Dossiê Identificado</h3>
            <p className="text-neutral-500 text-sm mt-2 max-w-xs mx-auto">Seu terminal não possui operações vinculadas. Insira um código de convite para começar.</p>
          </div>
        ) : (
          competitions.map((comp) => (
            <OperationCard key={comp.id} operation={comp} />
          ))
        )}
      </section>
    </div>
  );
}