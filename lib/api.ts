import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  Project, 
  Todo, 
  Subtask,
  CreateProjectData,
  CreateTodoData,
  CreateSubtaskData,
  ApiError
} from './types';

const API_BASE_URL = 'http://localhost:3333';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Funções de autenticação
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  logout: () => {
    Cookies.remove('token');
    Cookies.remove('user');
  },
};

// Funções de projetos
export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  create: async (data: CreateProjectData): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateProjectData>): Promise<Project> => {
    const response = await api.patch<Project>(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// Funções de tarefas
export const todosApi = {
  getAll: async (): Promise<Todo[]> => {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  },

  getByProject: async (projectId: string): Promise<Todo[]> => {
    const response = await api.get<Todo[]>(`/projects/${projectId}/todos`);
    return response.data;
  },

  create: async (data: CreateTodoData): Promise<Todo> => {
    const response = await api.post<Todo>('/todos', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateTodoData>): Promise<Todo> => {
    const response = await api.patch<Todo>(`/todos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/todos/${id}`);
  },

  complete: async (id: string): Promise<Todo> => {
    const response = await api.patch<Todo>(`/todos/${id}/complete`);
    return response.data;
  },
};

// Funções de subtarefas
export const subtasksApi = {
  create: async (todoId: string, data: CreateSubtaskData): Promise<Subtask> => {
    const response = await api.post<Subtask>(`/todos/${todoId}/subtasks`, data);
    return response.data;
  },

  delete: async (subtaskId: string): Promise<void> => {
    await api.delete(`/subtasks/${subtaskId}`);
  },

  complete: async (subtaskId: string): Promise<Subtask> => {
    const response = await api.patch<Subtask>(`/subtasks/${subtaskId}/complete`);
    return response.data;
  },
};

export default api; 