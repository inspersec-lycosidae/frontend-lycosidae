'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Competition } from '@/lib/types';
import { Plus, X, Terminal, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

import CompetitionForm from '@/components/admin/CompetitionForm';
import CompetitionTable from '@/components/admin/CompetitionTable';
import ViewExercisesModal from '@/components/admin/ViewExercisesModal';
import GradientDivider from '@/components/ui/GradientDivider';

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
      
      // Ordenação Tática: Ativas > Em Breve > Finalizadas
      const sorted = [...res.data].sort((a, b) => {
        const priority: Record<string, number> = { ativa: 0, 'em breve': 1, finalizada: 2 };
        const pA = priority[a.status] ?? 3;
        const pB = priority[b.status] ?? 3;
        
        if (pA !== pB) return pA - pB;
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      });

      setCompetitions(sorted);
    } catch (err) {
      toast.error("Falha ao sincronizar banco de operações.");
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleEditClick = (comp: Competition) => {
    const formatForInput = (isoString: string) => {
      if (!isoString) return '';
      const date = new Date(isoString);
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
    if (!confirm('AVISO: Esta ação neutralizará a operação e todos os dados vinculados. Prosseguir?')) return;
    try {
      await api.delete(`/competitions/${id}`);
      toast.success("Operação neutralizada com sucesso.");
      fetchCompetitions();
    } catch (err) {
      toast.error('Erro ao encerrar operação no servidor.');
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
        toast.success('Dossiê da operação atualizado.');
      } else {
        payload.invite_code = formData.invite_code;
        await api.post('/competitions/', payload);
        toast.success('Nova missão inicializada com sucesso.');
      }

      resetForm();
      fetchCompetitions();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Verifique os parâmetros da missão.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Header Tático */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Terminal size={16} className="text-red-600" />
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">Gestão de Ativos</p>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none">
            GESTOR DE <span className="text-red-600">OPERAÇÕES</span>
          </h1>
          <p className="text-neutral-500 text-sm mt-2">Administre as operações ativas, finalizadas e futuras.</p>
        </div>
        
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className={`px-6 py-3 rounded-xl font-black text-[11px] tracking-widest flex items-center gap-2 transition-all shadow-lg ${
            showForm 
              ? 'bg-neutral-800 text-white hover:bg-neutral-700' 
              : 'bg-red-600 text-white hover:bg-red-500 shadow-red-900/20'
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'ABORTAR AÇÃO' : 'INICIAR NOVA OPERAÇÃO'}
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

      <GradientDivider />

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