'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Exercise, Tag } from '@/lib/types';
import { Trash2, Plus, Terminal, X, Pencil, Link as LinkIcon } from 'lucide-react';

// Imports dos componentes modularizados
import TagManager from '@/components/admin/TagManager';
import ExerciseForm from '@/components/admin/ExerciseForm';
import CompetitionLinkModal from '@/components/admin/CompetitionLinkModal';

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [linkModalExerciseId, setLinkModalExerciseId] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'facil',
    points: 100,
    flag: '',
    is_active: true
  });

  const fetchData = async () => {
    try {
      const [exRes, tagRes] = await Promise.all([
        api.get<Exercise[]>('/exercises/'),
        api.get<Tag[]>('/tags/')
      ]);
      setExercises(exRes.data);
      setTags(tagRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setFormData({ name: '', description: '', difficulty: 'facil', points: 100, flag: '', is_active: true });
    setSelectedTagIds([]);
    setEditingId(null);
    setShowForm(false);
  };

  /**
   * Lógica de Vincular/Desvincular Tag
   * Se estiver editando, faz a chamada de API imediata.
   * Se estiver criando, apenas gerencia o estado local para enviar no submit.
   */
  const handleToggleTag = async (tagId: string, isLinked: boolean) => {
    if (editingId) {
      try {
        if (isLinked) {
          await api.delete(`/exercises/${editingId}/tags/${tagId}`);
        } else {
          await api.post(`/exercises/${editingId}/tags/${tagId}`);
        }
        // Atualiza a lista local para refletir no formulário
        setSelectedTagIds(prev =>
          isLinked ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
        fetchData(); // Recarrega para atualizar a lista de exercícios (coluna de tags)
      } catch (err) {
        alert("Erro ao processar vínculo da tag.");
      }
    } else {
      setSelectedTagIds(prev =>
        isLinked ? prev.filter(id => id !== tagId) : [...prev, tagId]
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (editingId && !payload.flag) {
        // @ts-ignore
        delete payload.flag;
      }

      let res;
      if (editingId) {
        res = await api.patch(`/exercises/${editingId}`, payload);
      } else {
        res = await api.post('/exercises/', payload);
        const newExId = res.data.id;

        // Vincula as tags selecionadas ao novo exercício criado
        for (const tagId of selectedTagIds) {
          await api.post(`/exercises/${newExId}/tags/${tagId}`);
        }
      }

      resetForm();
      fetchData();
    } catch (err) {
      alert("Erro ao salvar os dados.");
    }
  };

  const handleDeleteExercise = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este desafio?")) return;
    try {
      await api.delete(`/exercises/${id}`);
      fetchData();
    } catch (err) {
      alert("Erro ao excluir o exercício.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Terminal className="text-red-600" size={32} /> Biblioteca de Desafios
          </h1>
          <p className="text-neutral-400 mt-1">Gestão centralizada de exercícios, flags e categorias.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition shadow-lg shadow-red-900/20"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancelar' : 'Novo Exercício'}
        </button>
      </div>

      {/* Gerenciador Global de Tags (CRUD de Tags) */}
      <TagManager tags={tags} onFetch={fetchData} />

      {/* Formulário com Seleção de Tags incluída */}
      {showForm && (
        <ExerciseForm
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          allTags={tags}
          selectedTags={selectedTagIds}
          onToggleTag={handleToggleTag}
        />
      )}

      {/* Tabela Principal */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-950 border-b border-neutral-800 text-xs text-neutral-500 uppercase tracking-widest">
              <th className="p-5">Exercício</th>
              <th className="p-5">Dificuldade</th>
              <th className="p-5">Tags</th>
              <th className="p-5">Pontos</th>
              <th className="p-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {exercises.map((ex) => (
              <tr key={ex.id} className="hover:bg-neutral-800/30 transition group">
                <td className="p-5">
                  <div className="font-bold text-white">{ex.name}</div>
                  <div className="text-[10px] text-neutral-600 font-mono mt-1">{ex.id}</div>
                </td>
                <td className="p-5">
                  <span className={`text-[10px] px-2 py-1 rounded uppercase font-bold border ${ex.difficulty === 'fácil' ? 'border-green-500/30 text-green-500 bg-green-500/5' :
                      ex.difficulty === 'médio' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5' :
                        'border-red-500/30 text-red-500 bg-red-500/5'
                    }`}>
                    {ex.difficulty}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {ex.tags?.map((t) => (
                      <span key={t.id} className="text-[9px] bg-neutral-950 text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-800">
                        {t.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-5 font-mono text-red-400 font-bold">{ex.points}</td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setLinkModalExerciseId(ex.id)}
                      className="p-2 bg-purple-600/10 text-purple-500 border border-purple-600/20 rounded hover:bg-purple-600 hover:text-white transition"
                      title="Vincular a Evento"
                    >
                      <LinkIcon size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(ex.id);
                        setFormData({
                          name: ex.name,
                          description: ex.description || '',
                          difficulty: ex.difficulty,
                          points: ex.points,
                          flag: '',
                          is_active: ex.is_active
                        });
                        // Carrega os IDs das tags vinculadas para o formulário
                        setSelectedTagIds(ex.tags?.map(t => t.id) || []);
                        setShowForm(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-2 bg-neutral-800 text-neutral-400 rounded hover:text-white transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteExercise(ex.id)}
                      className="p-2 bg-red-600/10 text-red-500 border border-red-600/20 rounded hover:bg-red-600 hover:text-white transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Vínculo de Competição */}
      <CompetitionLinkModal
        exerciseId={linkModalExerciseId}
        onClose={() => setLinkModalExerciseId(null)}
      />
    </div>
  );
}