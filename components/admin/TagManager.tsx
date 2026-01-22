// components/admin/TagManager.tsx
'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { Tag } from '@/lib/types';
import { Plus, X, Tag as TagIcon, Check } from 'lucide-react';

export default function TagManager({ tags, onFetch }: { tags: Tag[], onFetch: () => void }) {
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<{ id: string, name: string } | null>(null);

  const handleCreateOrUpdate = async () => {
    if (editingTag) {
      await api.patch(`/tags/${editingTag.id}`, { name: editingTag.name });
      setEditingTag(null);
    } else {
      if (!newTagName) return;
      await api.post('/tags/', { name: newTagName });
      setNewTagName('');
    }
    onFetch();
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold uppercase mr-2">
        <TagIcon size={14} /> Categorias:
      </div>
      {tags.map(tag => (
        <span key={tag.id} className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-xs border border-neutral-700 flex items-center gap-2">
          {editingTag?.id === tag.id ? (
            <input
              autoFocus className="bg-transparent outline-none w-20"
              value={editingTag.name}
              onChange={e => setEditingTag({ ...editingTag, name: e.target.value })}
            />
          ) : (
            <span onClick={() => setEditingTag(tag)} className="cursor-pointer hover:text-white transition">{tag.name}</span>
          )}
          <button onClick={async () => { await api.delete(`/tags/${tag.id}`); onFetch(); }} className="hover:text-red-500"><X size={12} /></button>
        </span>
      ))}
      <div className="flex gap-2 ml-auto">
        <input
          placeholder={editingTag ? "Novo nome..." : "Nova Tag..."}
          className="bg-black border border-neutral-700 rounded px-3 py-1 text-xs text-white outline-none focus:border-red-600"
          value={editingTag ? editingTag.name : newTagName}
          onChange={e => editingTag ? setEditingTag({ ...editingTag, name: e.target.value }) : setNewTagName(e.target.value)}
        />
        <button onClick={handleCreateOrUpdate} className="bg-neutral-800 hover:bg-neutral-700 p-1 rounded border border-neutral-700 text-white">
          {editingTag ? <Check size={14} className="text-green-500" /> : <Plus size={14} />}
        </button>
      </div>
    </div>
  );
}