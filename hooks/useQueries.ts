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
import { toast } from 'sonner';

// Hooks para projetos
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
    select: (data) => Array.isArray(data) ? data : [],
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projeto criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar projeto. Tente novamente.');
      console.error('Erro ao criar projeto:', error);
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
      toast.success('Projeto atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar projeto. Tente novamente.');
      console.error('Erro ao atualizar projeto:', error);
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
      toast.success('Projeto excluído com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir projeto. Tente novamente.');
      console.error('Erro ao excluir projeto:', error);
    },
  });
};

// Hooks para tarefas
export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: todosApi.getAll,
    select: (data) => Array.isArray(data) ? data : [],
  });
};

export const useTodo = (id: string) => {
  return useQuery({
    queryKey: ['todo', id],
    queryFn: () => todosApi.getById(id),
    enabled: !!id,
  });
};

export const useTodosByProject = (projectId: string) => {
  return useQuery({
    queryKey: ['todos', 'project', projectId],
    queryFn: () => todosApi.getByProject(projectId),
    enabled: !!projectId,
    select: (data) => Array.isArray(data) ? data : [],
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: todosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Tarefa criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar tarefa. Tente novamente.');
      console.error('Erro ao criar tarefa:', error);
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
      toast.success('Tarefa atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar tarefa. Tente novamente.');
      console.error('Erro ao atualizar tarefa:', error);
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: todosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Tarefa excluída com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir tarefa. Tente novamente.');
      console.error('Erro ao excluir tarefa:', error);
    },
  });
};

export const useCompleteTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: todosApi.complete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Tarefa marcada como concluída!');
    },
    onError: (error) => {
      toast.error('Erro ao marcar tarefa como concluída. Tente novamente.');
      console.error('Erro ao marcar tarefa como concluída:', error);
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
      toast.success('Subtarefa criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar subtarefa. Tente novamente.');
      console.error('Erro ao criar subtarefa:', error);
    },
  });
};

export const useDeleteSubtask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: subtasksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Subtarefa excluída com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir subtarefa. Tente novamente.');
      console.error('Erro ao excluir subtarefa:', error);
    },
  });
};

export const useCompleteSubtask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: subtasksApi.complete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Subtarefa marcada como concluída!');
    },
    onError: (error) => {
      toast.error('Erro ao marcar subtarefa como concluída. Tente novamente.');
      console.error('Erro ao marcar subtarefa como concluída:', error);
    },
  });
};

// Hooks para autenticação
export const useLogin = () => {
  const { login } = useAuth();
  const router = useRouter();
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      if (response.success) {
        login(response.data.user, response.data.token);
        router.push('/dashboard');
        toast.success('Login realizado com sucesso!');
      }
    },
    onError: (error) => {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
      console.error('Erro no login:', error);
    },
  });
};

export const useRegister = () => {
  const { login } = useAuth();
  const router = useRouter();
  
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      if (response.success) {
        login(response.data.user, response.data.token);
        router.push('/dashboard');
        toast.success('Conta criada com sucesso!');
      }
    },
    onError: (error) => {
      toast.error('Erro ao criar conta. Tente novamente.');
      console.error('Erro no registro:', error);
    },
  });
}; 