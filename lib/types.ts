export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  todos?: Todo[];
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  note?: string;
  projectId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    name: string;
  };
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  todo_id: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  dueDate?: string;
  note?: string;
  projectId?: string;
}

export interface CreateSubtaskData {
  title: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface ApiErrorResponse {
  message: string;
  status?: number;
  response?: {
    data?: {
      message?: string;
    };
  };
} 