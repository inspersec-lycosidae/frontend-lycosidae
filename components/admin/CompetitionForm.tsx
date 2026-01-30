'use client';
import { Pencil, Plus, Save } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface CompetitionFormProps {
  editingId: string | null;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function CompetitionForm({
  editingId,
  formData,
  setFormData,
  onSubmit,
  onCancel
}: CompetitionFormProps) {
  return (
    <div className="bg-neutral-900/50 backdrop-blur-md border border-neutral-800 p-8 rounded-2xl relative overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-500">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-red-950/20 border border-red-900/30 rounded-lg text-red-600">
          {editingId ? <Pencil size={20} /> : <Plus size={20} />}
        </div>
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            {editingId ? 'Ajustar Parâmetros' : 'Inicializar Operação'}
          </h3>
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em]">Protocolo de Gestão Horus</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nome da Operação"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Aula 1 - SQLInjection"
          />

          <div className="space-y-1">
            <label className="block text-[10px] text-neutral-500 uppercase font-black tracking-widest ml-1 mb-1">
              Código de Acesso {editingId && <span className="text-red-600/50">(Fixo)</span>}
            </label>
            <input
              type="text"
              required
              disabled={!!editingId}
              value={formData.invite_code}
              onChange={e => setFormData({ ...formData, invite_code: e.target.value.toUpperCase() })}
              className={`w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white outline-none font-mono uppercase transition-all ${editingId ? 'opacity-30 cursor-not-allowed' : 'focus:border-red-600 placeholder-neutral-800'
                }`}
              placeholder="SECRET_KEY"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] text-neutral-500 uppercase font-black tracking-widest ml-1 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3.5 text-white focus:border-red-600 outline-none transition-all uppercase text-[11px] font-bold cursor-pointer"
            >
              <option value="ativa" className="bg-neutral-950">Operação Ativa</option>
              <option value="finalizada" className="bg-neutral-950">Encerrada</option>
              <option value="em_breve" className="bg-neutral-950">Em Preparação</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] text-neutral-500 uppercase font-black tracking-widest ml-1 mb-1">Início</label>
            <div className="relative">
              <input
                type="datetime-local"
                required
                value={formData.start_date}
                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-red-600 outline-none scheme-dark font-mono text-xs"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="block text-[10px] text-neutral-500 uppercase font-black tracking-widest ml-1 mb-1">Fim</label>
            <div className="relative">
              <input
                type="datetime-local"
                required
                value={formData.end_date}
                onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-red-600 outline-none scheme-dark font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end pt-4 gap-4">
          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 rounded-xl font-black text-[10px] tracking-[0.2em] text-neutral-500 hover:text-white transition-all uppercase"
            >
              Abortar Alteração
            </button>
          )}
          <div className="sm:w-64">
            <Button type="submit">
              <div className="flex items-center justify-center gap-2">
                <Save size={18} />
                {editingId ? 'ATUALIZAR OPERAÇÃO' : 'CONFIRMAR OPERAÇÃO'}
              </div>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}