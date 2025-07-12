export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
}

export interface RatingRequest {
  talkId: number;
  rating: number;
  comment?: string;
}

export interface Rating {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  talk: { id: number; title: string };
}
