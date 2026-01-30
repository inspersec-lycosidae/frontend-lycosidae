'use client';
import { Pencil, Plus, Save, ShieldCheck, Tag as TagIcon, Terminal } from 'lucide-react';
import { Tag } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

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
  editingId, formData, setFormData, onSubmit, onCancel, allTags, selectedTags, onToggleTag
}: ExerciseFormProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl relative overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-500">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-red-950/20 border border-red-900/30 rounded-lg text-red-600">
          {editingId ? <Pencil size={20} /> : <Plus size={20} />}
        </div>
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            {editingId ? 'Ajustar exercício' : 'Registrar novo exercício'}
          </h3>
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em]">Especificações do Dossiê</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Nome do Desafio"
              required
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="SQLi"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] text-neutral-500 uppercase font-black tracking-widest ml-1 mb-1">Dificuldade</label>
            <select
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3.5 text-white focus:border-red-600 outline-none transition-all uppercase text-[11px] font-bold cursor-pointer"
              value={formData.difficulty || 'facil'}
              onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
            >
              <option value="facil">Fácil</option>
              <option value="medio">Médio</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="block text-[10px] text-neutral-500 uppercase font-black tracking-widest ml-1 mb-1">Descrição (Markdown)</label>
            <textarea
              rows={4} required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:border-red-600 outline-none transition font-mono text-sm placeholder-neutral-800"
              placeholder="Descreva as vulnerabilidades e objetivos..."
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Input
            label="Pontuação"
            type="number"
            required
            value={formData.points || 0}
            onChange={e => setFormData({ ...formData, points: Number(e.target.value) })}
          />

          <div className="md:col-span-2">
            <Input
              label="Imagem Docker (GHCR)"
              placeholder="ghcr.io/inspersec-lycosidae/exercises-lycosidae/welcome-web:latest"
              value={formData.docker_image || ''}
              onChange={e => setFormData({ ...formData, docker_image: e.target.value })}
            />
          </div>

          <div className="md:col-span-3">
            <Input
              label={`Flag ${editingId ? '(Vazio para manter atual)' : ''}`}
              placeholder="HORUS{flag_aqui}"
              required={!editingId}
              value={formData.flag || ''}
              onChange={e => setFormData({ ...formData, flag: e.target.value })}
            />
          </div>

          <div className="md:col-span-3 space-y-3">
            <label className="text-[10px] text-neutral-500 uppercase font-black tracking-widest ml-1 flex items-center gap-2">
              <TagIcon size={12} /> Categorias
            </label>
            <div className="flex flex-wrap gap-2 p-5 bg-neutral-950/50 border border-neutral-800 rounded-xl">
              {allTags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id} type="button"
                    onClick={() => onToggleTag(tag.id, isSelected)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${isSelected
                      ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/20'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'
                      }`}
                  >
                    {isSelected ? <ShieldCheck size={12} /> : <Plus size={12} />}
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-neutral-800/50">
          <button type="button" onClick={onCancel} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition">
            ABORTAR
          </button>
          <div className="w-64">
            <Button type="submit">
              <Save size={18} className="mr-2 inline" />
              {editingId ? 'ATUALIZAR EXERCÍCIO' : 'PUBLICAR EXERCÍCIO'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}