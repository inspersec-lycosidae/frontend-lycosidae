'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { Tag } from '@/lib/types';
import { Plus, X, Tag as TagIcon, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TagManager({ tags, onFetch }: { tags: Tag[], onFetch: () => void }) {
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<{ id: string, name: string } | null>(null);

  const handleCreateOrUpdate = async () => {
    try {
      if (editingTag) {
        await api.patch(`/tags/${editingTag.id}`, { name: editingTag.name });
        setEditingTag(null);
        toast.success("Categoria atualizada.");
      } else {
        if (!newTagName) return;
        await api.post('/tags/', { name: newTagName });
        setNewTagName('');
        toast.success("Nova categoria registrada.");
      }
      onFetch();
    } catch (err) {
      toast.error("Erro na operação de categoria.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tags/${id}`);
      toast.success("Categoria removida.");
      onFetch();
    } catch (err) {
      toast.error("Falha ao remover categoria.");
    }
  };

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 p-5 rounded-2xl flex flex-wrap items-center gap-4 backdrop-blur-md">
      <div className="flex items-center gap-2 text-[10px] font-black text-neutral-500 uppercase tracking-widest mr-2">
        <TagIcon size={14} className="text-red-600" /> Categorias:
      </div>

      {tags.map(tag => (
        <span key={tag.id} className="bg-neutral-950 text-neutral-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-neutral-800 flex items-center gap-3 group">
          {editingTag?.id === tag.id ? (
            <input
              autoFocus className="bg-transparent outline-none w-24 text-white"
              value={editingTag.name}
              onChange={e => setEditingTag({ ...editingTag, name: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleCreateOrUpdate()}
            />
          ) : (
            <span onClick={() => setEditingTag(tag)} className="cursor-pointer hover:text-red-500 transition-colors uppercase">{tag.name}</span>
          )}
          <button onClick={() => handleDelete(tag.id)} className="text-neutral-700 hover:text-red-500 transition-colors">
            <X size={14} />
          </button>
        </span>
      ))}

      <div className="flex gap-2 ml-auto">
        <input
          placeholder={editingTag ? "Novo nome..." : "REGISTRAR TAG..."}
          className="bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-[10px] font-black uppercase text-white outline-none focus:border-red-600 transition-all placeholder-neutral-800"
          value={editingTag ? editingTag.name : newTagName}
          onChange={e => editingTag ? setEditingTag({ ...editingTag, name: e.target.value }) : setNewTagName(e.target.value)}
        />
        <button
          onClick={handleCreateOrUpdate}
          className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white p-2 rounded-lg border border-red-600/20 transition-all"
        >
          {editingTag ? <Check size={18} /> : <Plus size={18} />}
        </button>
      </div>
    </div>
  );
}