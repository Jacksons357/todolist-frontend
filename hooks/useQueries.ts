import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  projectsApi, 
  todosApi, 
  subtasksApi, 
  authApi 
} from '@/lib/api';
import { 
  CreateProjectData, 
  CreateTodoData, 
  CreateSubtaskData,
  LoginCredentials,
  RegisterCredentials
} from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Hooks para projetos
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProjectData> }) =>
      projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

// Hooks para tarefas
export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: todosApi.getAll,
  });
};

export const useTodosByProject = (projectId: string) => {
  return useQuery({
    queryKey: ['todos', 'project', projectId],
    queryFn: () => todosApi.getByProject(projectId),
    enabled: !!projectId,
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: todosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTodoData> }) =>
      todosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: todosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

export const useCompleteTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: todosApi.complete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

// Hooks para subtarefas
export const useCreateSubtask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ todoId, data }: { todoId: string; data: CreateSubtaskData }) =>
      subtasksApi.create(todoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

export const useDeleteSubtask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: subtasksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

export const useCompleteSubtask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: subtasksApi.complete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
};

// Hooks para autenticação
export const useLogin = () => {
  const { login } = useAuth();
  const router = useRouter();
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.token);
      router.push('/dashboard');
    },
  });
};

export const useRegister = () => {
  const { login } = useAuth();
  const router = useRouter();
  
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data.user, data.token);
      router.push('/dashboard');
    },
  });
}; 