'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { Exercise } from '@/lib/types';
import { Loader2, CheckCircle, XCircle, Send } from 'lucide-react';

interface Props {
  exercise: Exercise;
  competitionId: string;
}

export default function ChallengeCard({ exercise, competitionId }: Props) {
  const [flag, setFlag] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag) return;

    setStatus('loading');
    setMessage('');

    try {
      // Payload exato conforme app/schemas/solve.py: SolveSubmitDTO
      const payload = {
        exercises_id: exercise.id,
        competitions_id: competitionId,
        content: flag
      };

      const res = await api.post('/exercises/submit', payload);

      // O backend retorna SolveResponseDTO: { success, message, points_awarded }
      if (res.data.success) {
        setStatus('success');
        setPointsAwarded(res.data.points_awarded);
        setMessage(res.data.message || 'Flag correta!');
      } else {
        setStatus('error');
        setMessage(res.data.message || 'Flag incorreta.');
      }
    } catch (error: any) {
      setStatus('error');
      // Tenta extrair a mensagem de erro específica do FastAPI (ex: "Competição encerrada")
      const errorMsg = error.response?.data?.detail || 'Erro ao comunicar com o servidor.';
      setMessage(errorMsg);
    }
  };

  return (
    <div className={`bg-neutral-900 border rounded-xl p-6 flex flex-col h-full transition-all duration-300 ${status === 'success' ? 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-neutral-800 hover:border-neutral-700'}`}>

      {/* Header: Pontos e Dificuldade */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded font-mono font-bold border border-blue-500/20">
            {exercise.points} PTS
          </span>
          <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider border ${exercise.difficulty === 'facil' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
              exercise.difficulty === 'medio' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                'bg-red-500/10 text-red-500 border-red-500/20'
            }`}>
            {exercise.difficulty}
          </span>
        </div>
        {/* Renderização de Tags */}
        <div className="flex gap-1 flex-wrap justify-end max-w-[50%]">
          {exercise.tags?.map((tag: any) => (
            <span key={tag.id} className="text-[10px] border border-neutral-700 bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400 font-mono">
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{exercise.name}</h3>

      {/* Descrição */}
      {exercise.description && (
        <div className="text-neutral-400 text-sm mb-6 flex-grow whitespace-pre-wrap leading-relaxed">
          {exercise.description}
        </div>
      )}

      {/* Área de Resposta */}
      <div className="mt-auto">
        <form onSubmit={handleSubmit} className="relative">
          {status === 'success' ? (
            <div className="bg-green-500/10 text-green-500 p-3 rounded-lg border border-green-500/20 text-center text-sm font-bold flex items-center justify-center gap-2 animate-in zoom-in duration-300">
              <CheckCircle size={18} />
              Resolvido (+{pointsAwarded || exercise.points})
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="lycosidae{...}"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  disabled={status === 'loading'}
                  className={`w-full bg-neutral-950 border rounded-lg pl-4 pr-4 py-2.5 text-sm text-white font-mono outline-none transition-all placeholder-neutral-700
                                ${status === 'error'
                      ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-neutral-700 focus:border-red-600 focus:ring-1 focus:ring-red-600/50'
                    }`}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading' || !flag}
                className="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded-lg transition shadow-lg shadow-red-900/20 flex items-center justify-center min-w-[50px]"
              >
                {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          )}
        </form>

        {/* Mensagens de Feedback */}
        {status === 'error' && (
          <div className="mt-3 flex items-start gap-2 text-xs text-red-400 animate-in slide-in-from-top-1">
            <XCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}