'use client';
import { Pencil, Plus, Save, ShieldCheck, Tag as TagIcon, Terminal } from 'lucide-react';
import { Tag } from '@/lib/types';

interface ExerciseFormProps {
  editingId: string | null;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  allTags: Tag[];
  selectedTags: string[];
  onToggleTag: (tagId: string, isLinked: boolean) => void;
}

export default function ExerciseForm({
  editingId,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  allTags,
  selectedTags,
  onToggleTag
}: ExerciseFormProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl border-l-4 border-l-red-600 shadow-2xl animate-in slide-in-from-top-4">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        {editingId ? <Pencil size={22} className="text-blue-500" /> : <Plus size={22} className="text-green-500" />}
        {editingId ? 'Editar Desafio' : 'Cadastrar Novo Desafio'}
      </h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Nome do Desafio */}
          <div className="md:col-span-2">
            <label className="block text-xs text-neutral-500 uppercase font-bold mb-2">Nome</label>
            <input
              type="text" required
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-white focus:border-red-600 outline-none transition"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Dificuldade */}
          <div>
            <label className="block text-xs text-neutral-500 uppercase font-bold mb-2">Dificuldade</label>
            <select
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-white focus:border-red-600 outline-none transition"
              value={formData.difficulty || 'fácil'}
              onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
            >
              <option value="fácil">Fácil</option>
              <option value="médio">Médio</option>
              <option value="difícil">Difícil</option>
            </select>
          </div>

          {/* Descrição */}
          <div className="md:col-span-3">
            <label className="block text-xs text-neutral-500 uppercase font-bold mb-2">Descrição (Markdown)</label>
            <textarea
              rows={4} required
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-white focus:border-red-600 outline-none transition font-mono text-sm"
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Pontos */}
          <div className="md:col-span-1">
            <label className="block text-xs text-neutral-500 uppercase font-bold mb-2">Pontos</label>
            <input
              type="number" required
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-white focus:border-red-600 outline-none transition"
              value={formData.points || 0}
              onChange={e => setFormData({ ...formData, points: Number(e.target.value) })}
            />
          </div>

          {/* Imagem Docker (GHCR) - Implementação Solução 3 */}
          <div className="md:col-span-2">
            <label className="block text-xs text-neutral-500 uppercase font-bold mb-2 flex items-center gap-2">
              <Terminal size={14} className="text-blue-500" /> Imagem Docker (GHCR)
            </label>
            <input
              type="text"
              placeholder="ghcr.io/inspersec-lycosidae/welcome-web:latest"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-white focus:border-red-600 outline-none transition font-mono text-sm"
              value={formData.docker_image || ''}
              onChange={e => setFormData({ ...formData, docker_image: e.target.value })}
            />
            <p className="mt-1 text-[10px] text-neutral-500 italic">
              A porta interna será detectada automaticamente via Label "lycosidae.port".
            </p>
          </div>

          {/* Flag do Sistema */}
          <div className="md:col-span-3">
            <label className="block text-xs text-neutral-500 uppercase font-bold mb-2 flex items-center gap-2">
              <ShieldCheck size={14} className="text-red-600" /> Flag do Sistema {editingId && <span className="text-[10px] lowercase text-neutral-500">(Vazio para manter atual)</span>}
            </label>
            <input
              type="text" placeholder="lycos{...}"
              required={!editingId}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-white focus:border-red-600 outline-none transition font-mono"
              value={formData.flag || ''}
              onChange={e => setFormData({ ...formData, flag: e.target.value })}
            />
          </div>

          {/* Lógica das TAGS */}
          <div className="md:col-span-3">
            <label className="block text-xs text-neutral-500 uppercase font-bold mb-3 flex items-center gap-2">
              <TagIcon size={14} /> Vincular Categorias
            </label>
            <div className="flex flex-wrap gap-2 p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
              {allTags.length === 0 ? (
                <span className="text-xs text-neutral-600 italic">Nenhuma tag disponível.</span>
              ) : (
                allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => onToggleTag(tag.id, isSelected)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-2 ${isSelected
                        ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/40'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-300'
                        }`}
                    >
                      {isSelected ? <ShieldCheck size={12} /> : <Plus size={12} />}
                      {tag.name}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-6 border-t border-neutral-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-neutral-400 hover:text-white transition font-bold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-500 text-white px-8 py-2 rounded-lg font-bold transition flex items-center gap-2"
          >
            <Save size={18} /> {editingId ? 'Salvar Alterações' : 'Publicar Desafio'}
          </button>
        </div>
      </form>
    </div>
  );
}