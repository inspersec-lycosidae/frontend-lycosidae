export interface Tag {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  is_admin: boolean;
}

export interface Competition {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  invite_code: string;
  status: string;
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  difficulty: string;
  points: number;
  flag: string;
  is_active: boolean;
  docker_image?: string;
  tags: Tag[];
}

export interface Container {
  id: string;
  exercises_id: string;
  docker_id: string;
  connection: string;
  port: number;
  is_active: boolean;
  image_tag?: string;
}

export interface SolvePayload {
  exercises_id: string;
  competitions_id: string;
  content: string;
}

export interface ScoreboardEntry {
  rank: number;
  username: string;
  score: number;
  users_id: string;
}