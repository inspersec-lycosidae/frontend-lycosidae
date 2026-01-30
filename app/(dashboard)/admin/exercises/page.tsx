'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Exercise, Tag } from '@/lib/types';
import { Trash2, Plus, Terminal, X, Pencil, Link as LinkIcon, Rocket, Loader2, Database, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

import TagManager from '@/components/admin/TagManager';
import ExerciseForm from '@/components/admin/ExerciseForm';
import CompetitionLinkModal from '@/components/admin/CompetitionLinkModal';
import GradientDivider from '@/components/ui/GradientDivider';

export default function AdminExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [linkModalExerciseId, setLinkModalExerciseId] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'facil',
    points: 100,
    flag: '',
    docker_image: '',
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
      toast.error("Falha ao sincronizar biblioteca de alvos.");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setFormData({
      name: '', description: '', difficulty: 'facil',
      points: 100, flag: '', docker_image: '', is_active: true
    });
    setSelectedTagIds([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleToggleTag = async (tagId: string, isLinked: boolean) => {
    if (editingId) {
      try {
        if (isLinked) {
          await api.delete(`/exercises/${editingId}/tags/${tagId}`);
        } else {
          await api.post(`/exercises/${editingId}/tags/${tagId}`);
        }
        setSelectedTagIds(prev => isLinked ? prev.filter(id => id !== tagId) : [...prev, tagId]);
        fetchData();
      } catch (err) {
        toast.error("Falha ao processar vínculo de categoria.");
      }
    } else {
      setSelectedTagIds(prev => isLinked ? prev.filter(id => id !== tagId) : [...prev, tagId]);
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
        toast.success("Exercício atualizado.");
      } else {
        res = await api.post('/exercises/', payload);
        const newExId = res.data.id;
        for (const tagId of selectedTagIds) {
          await api.post(`/exercises/${newExId}/tags/${tagId}`);
        }
        toast.success("Novo exercício registrado na biblioteca.");
      }

      resetForm();
      fetchData();
    } catch (err) {
      toast.error("Erro ao salvar dados do exercício.");
    }
  };

  const handleDeploy = async (ex_id: string) => {
    const timeAlive = prompt("Tempo de atividade (minutos)? [0 para infinito]", "60");
    if (timeAlive === null) return;

    setIsDeploying(ex_id);
    try {
      const res = await api.post(`/exercises/${ex_id}/deploy`, {
        time_alive: parseInt(timeAlive) || 0
      });
      toast.success("Infraestrutura deployada com sucesso.");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Falha crítica no deploy.");
    } finally {
      setIsDeploying(null);
      fetchData();
    }
  };

  const handleDeleteExercise = async (id: string) => {
    if (!confirm("Confirmar eliminação permanente deste exercício?")) return;
    try {
      await api.delete(`/exercises/${id}`);
      toast.success("Exercício removido da biblioteca.");
      fetchData();
    } catch (err) {
      toast.error("Falha ao excluir exercício.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header Tático */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Database size={16} className="text-red-600" />
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Repositório de Inteligência</p>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none">
            BIBLIOTECA DE <span className="text-red-600">EXERCÍCIOS</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-2">Gestão centralizada de exercícios e imagens Docker.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className={`px-6 py-3 rounded-xl font-black text-[11px] tracking-widest flex items-center gap-2 transition-all shadow-lg ${showForm ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'bg-red-600 text-white hover:bg-red-500 shadow-red-900/20'
            }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'CANCELAR AÇÃO' : 'NOVO EXERCÍCIO'}
        </button>
      </div>

      <TagManager tags={tags} onFetch={fetchData} />

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

      <GradientDivider />

      {/* Tabela de Dossiês */}
      <div className="bg-neutral-900/30 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-950/50 border-b border-neutral-800 text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em]">
              <th className="px-6 py-5">Nome</th>
              <th className="px-6 py-5 text-center">Dificuldade</th>
              <th className="px-6 py-5">Imagem Docker</th>
              <th className="px-6 py-5 text-center">Recompensa</th>
              <th className="px-8 py-5 text-right">Controles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {exercises.map((ex) => (
              <tr key={ex.id} className="hover:bg-red-600/1 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">{ex.name}</div>
                  <div className="text-[10px] text-neutral-600 font-mono mt-1">UUID: {ex.id.substring(0, 8)}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${ex.difficulty === 'facil' ? 'border-green-500/20 text-green-500 bg-green-500/5' :
                    ex.difficulty === 'medio' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                      'border-rose-500/20 text-rose-500 bg-rose-500/5'
                    }`}>
                    {ex.difficulty === 'facil' ? 'Fácil' : ex.difficulty === 'medio' ? 'Médio' : 'Difícil'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[11px] font-mono text-neutral-500 max-w-50 truncate bg-neutral-950 px-2 py-1 rounded border border-neutral-800" title={ex.docker_image}>
                    {ex.docker_image || '---'}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-black text-red-600 font-mono">{ex.points} XP</span>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <ActionButton
                      onClick={() => handleDeploy(ex.id)}
                      disabled={!ex.docker_image || isDeploying === ex.id}
                      icon={isDeploying === ex.id ? Loader2 : Rocket}
                      variant="warning"
                      loading={isDeploying === ex.id}
                    />
                    <ActionButton onClick={() => setLinkModalExerciseId(ex.id)} icon={LinkIcon} variant="info" />
                    <ActionButton onClick={() => {
                      setEditingId(ex.id);
                      setFormData({
                        name: ex.name, description: ex.description || '', difficulty: ex.difficulty,
                        points: ex.points, flag: '', docker_image: ex.docker_image || '', is_active: ex.is_active
                      });
                      setSelectedTagIds(ex.tags?.map(t => t.id) || []);
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} icon={Pencil} />
                    <ActionButton onClick={() => handleDeleteExercise(ex.id)} icon={Trash2} variant="danger" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CompetitionLinkModal exerciseId={linkModalExerciseId} onClose={() => setLinkModalExerciseId(null)} />
    </div>
  );
}

function ActionButton({ onClick, icon: Icon, variant = 'default', disabled = false, loading = false }: any) {
  const styles = {
    danger: 'text-red-500 hover:bg-red-600 hover:text-white border-red-600/20',
    warning: 'text-amber-500 hover:bg-amber-600 hover:text-white border-amber-600/20',
    info: 'text-blue-500 hover:bg-blue-600 hover:text-white border-blue-600/20',
    default: 'text-neutral-500 hover:bg-neutral-800 hover:text-white border-neutral-800'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg border transition-all duration-300 ${styles[variant as keyof typeof styles]} ${disabled && 'opacity-30 cursor-not-allowed'}`}
    >
      <Icon size={16} className={loading ? "animate-spin" : ""} />
    </button>
  );
}