'use client';
import { Pencil, Plus, Save } from 'lucide-react';

interface CompetitionFormProps {
  editingId: string | null;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function CompetitionForm({ editingId, formData, setFormData, onSubmit, onCancel }: CompetitionFormProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl border-l-4 border-l-red-600 shadow-xl animate-in slide-in-from-top-4">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        {editingId ? <Pencil size={20} className="text-blue-500" /> : <Plus size={20} className="text-green-500" />}
        {editingId ? 'Editar Competição' : 'Nova Competição'}
      </h3>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome */}
          <div>
            <label className="block text-xs text-neutral-500 uppercase font-bold mb-1">Nome do Evento</label>
            <input
              type="text" required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white focus:border-red-600 outline-none transition"
            />
          </div>

          {/* Invite Code */}
          <div>
            <label className="block text-xs text-neutral-500 uppercase font-bold mb-1">
              Código de Convite {editingId && <span className="text-red-500 text-[10px]">(Fixo)</span>}
            </label>
            <input
              type="text" required
              disabled={!!editingId}
              value={formData.invite_code}
              onChange={e => setFormData({ ...formData, invite_code: e.target.value.toUpperCase() })}
              className={`w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white outline-none font-mono uppercase transition ${editingId ? 'opacity-50 cursor-not-allowed' : 'focus:border-red-600'}`}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs text-neutral-500 uppercase font-bold mb-1">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white focus:border-red-600 outline-none transition"
            >
              <option value="ativa">Ativa</option>
              <option value="finalizada">Encerrada</option>
              <option value="em breve">Em Breve</option>
            </select>
          </div>

          {/* Datas */}
          <div>
            <label className="block text-xs text-neutral-500 uppercase font-bold mb-1">Início</label>
            <input
              type="datetime-local" required
              value={formData.start_date}
              onChange={e => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white focus:border-red-600 outline-none [color-scheme:dark]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-neutral-500 uppercase font-bold mb-1">Fim</label>
            <input
              type="datetime-local" required
              value={formData.end_date}
              onChange={e => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-700 rounded p-2 text-white focus:border-red-600 outline-none [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 gap-2">
          {editingId && (
            <button type="button" onClick={onCancel} className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded font-bold transition">
              Cancelar
            </button>
          )}
          <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold flex items-center gap-2 shadow-lg shadow-green-900/20 transition">
            <Save size={18} /> {editingId ? 'Salvar Alterações' : 'Criar Competição'}
          </button>
        </div>
      </form>
    </div>
  );
}