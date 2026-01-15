'use client';
import { Construction } from 'lucide-react';

export default function GlobalExercisesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-neutral-500 animate-in fade-in">
      <Construction size={64} className="mb-4 text-red-500" />
      <h1 className="text-2xl font-bold text-white">Biblioteca Global</h1>
      <p className="max-w-md text-center mt-2">
        Esta área listará todos os exercícios do sistema para treino livre.
        <br />
        Por enquanto, acesse os desafios através das 
        <span className="text-red-500 font-bold"> Competições</span>.
      </p>
    </div>
  );
}