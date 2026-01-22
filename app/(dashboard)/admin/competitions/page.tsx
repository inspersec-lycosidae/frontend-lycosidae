'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Competition } from '@/lib/types';
import { Plus, X } from 'lucide-react';

import CompetitionForm from '@/components/admin/CompetitionForm';
import CompetitionTable from '@/components/admin/CompetitionTable';
import ViewExercisesModal from '@/components/admin/ViewExercisesModal';

export default function AdminCompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewExModalData, setViewExModalData] = useState<{ id: string, name: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    invite_code: '',
    status: 'ativa',
    start_date: '',
    end_date: ''
  });

  const fetchCompetitions = async () => {
    try {
      const res = await api.get<Competition[]>('/competitions/');
      setCompetitions(res.data);
    } catch (err) {
      console.error("Erro ao buscar competições:", err);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleEditClick = (comp: Competition) => {
    const formatForInput = (isoString: string) => {
      if (!isoString) return '';
      const utcString = isoString.endsWith('Z') ? isoString : `${isoString}Z`;
      const date = new Date(utcString);
      
      const offset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offset);
      return localDate.toISOString().slice(0, 16);
    };

    setFormData({
      name: comp.name,
      invite_code: comp.invite_code,
      status: comp.status,
      start_date: formatForInput(comp.start_date),
      end_date: formatForInput(comp.end_date)
    });
    setEditingId(comp.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ name: '', invite_code: '', status: 'ativa', start_date: '', end_date: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza? Isso pode afetar os placares e desvincular exercícios.')) return;
    try {
      await api.delete(`/competitions/${id}`);
      fetchCompetitions();
    } catch (err) {
      alert('Erro ao deletar competição.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: formData.name,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        status: formData.status
      };

      if (editingId) {
        await api.patch(`/competitions/${editingId}`, payload);
        alert('Competição atualizada!');
      } else {
        payload.invite_code = formData.invite_code;
        await api.post('/competitions/', payload);
        alert('Competição criada com sucesso!');
      }

      resetForm();
      fetchCompetitions();
    } catch (err: any) {
      alert('Erro: ' + (err.response?.data?.detail || 'Verifique os dados enviados'));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gerenciar Eventos</h1>
          <p className="text-neutral-400 text-sm mt-1">Administre salas de aula e CTFs.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Fechar Painel' : 'Nova Competição'}
        </button>
      </div>

      {showForm && (
        <CompetitionForm
          editingId={editingId}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <CompetitionTable
        competitions={competitions}
        onEdit={handleEditClick}
        onDelete={handleDelete}
        onViewExercises={(comp) => setViewExModalData({ id: comp.id, name: comp.name })}
      />

      <ViewExercisesModal
        competitionId={viewExModalData?.id || null}
        competitionName={viewExModalData?.name || ""}
        onClose={() => setViewExModalData(null)}
      />
    </div>
  );
}