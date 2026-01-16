// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

export const deployExercise = async (exerciseId: string, competitionId: string) => {
  const response = await api.post(`/exercises/${exerciseId}/deploy/${competitionId}`);
  return response.data;
};