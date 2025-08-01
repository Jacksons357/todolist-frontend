'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todosApi, subtasksApi } from '@/lib/api';
import { useTodo } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  ArrowLeft, 
  CheckSquare, 
  Plus, 
  Trash2,
  Loader2,
  Calendar,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export default function TodoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const todoId = params.id as string;
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [deleteTodoDialogOpen, setDeleteTodoDialogOpen] = useState(false);
  const [subtaskToDelete, setSubtaskToDelete] = useState<string | null>(null);

  // Buscar dados do todo
  const { data: todo, isLoading, error } = useTodo(todoId);

  // Mutations
  const completeTodoMutation = useMutation({
    mutationFn: (id: string) => todosApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', todoId] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success("Status da tarefa atualizado com sucesso.");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar tarefa.", {
        description: error.response?.data?.error || "Erro ao atualizar tarefa."
      });
    }
  });

  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => todosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success("Tarefa excluída com sucesso.");
      router.push('/dashboard/todos');
    },
    onError: (error: any) => {
      toast.error("Erro ao excluir tarefa.", {
        description: error.response?.data?.error || "Erro ao excluir tarefa."
      });
    }
  });

  const createSubtaskMutation = useMutation({
    mutationFn: (data: { title: string }) => subtasksApi.create(todoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', todoId] });
      setNewSubtaskTitle('');
      toast.success("Subtarefa criada com sucesso.");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar subtarefa.", {
        description: error.response?.data?.error || "Erro ao criar subtarefa."
      });
    }
  });

  const completeSubtaskMutation = useMutation({
    mutationFn: (subtaskId: string) => subtasksApi.complete(subtaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', todoId] });
      toast.success("Subtarefa atualizada com sucesso.");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar subtarefa.", {
        description: error.response?.data?.error || "Erro ao atualizar subtarefa."
      });
    }
  });

  const deleteSubtaskMutation = useMutation({
    mutationFn: (subtaskId: string) => subtasksApi.delete(subtaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo', todoId] });
      toast.success("Subtarefa excluída com sucesso.");
    },
    onError: (error: any) => {
      toast.error("Erro ao excluir subtarefa.", {
        description: error.response?.data?.error || "Erro ao excluir subtarefa."
      });
    }
  });

  const handleCompleteTodo = () => {
    completeTodoMutation.mutate(todoId);
  };

  const handleDeleteTodo = () => {
    setDeleteTodoDialogOpen(true);
  };

  const confirmDeleteTodo = () => {
    deleteTodoMutation.mutate(todoId);
    setDeleteTodoDialogOpen(false);
  };

  const handleCreateSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      createSubtaskMutation.mutate({ title: newSubtaskTitle.trim() });
    }
  };

  const handleCompleteSubtask = (subtaskId: string) => {
    completeSubtaskMutation.mutate(subtaskId);
  };



  const confirmDeleteSubtask = () => {
    if (subtaskToDelete) {
      deleteSubtaskMutation.mutate(subtaskToDelete);
      setSubtaskToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <XCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold">Erro ao carregar tarefa</h2>
        <p className="text-muted-foreground">A tarefa não foi encontrada ou ocorreu um erro.</p>
        <Button onClick={() => router.push('/dashboard/todos')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Tarefas
        </Button>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <XCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold">Tarefa não encontrada</h2>
        <Button onClick={() => router.push('/dashboard/todos')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Tarefas
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/todos')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{todo.title}</h1>
            {todo.project && (
              <p className="text-muted-foreground">
                Projeto: {todo.project.name}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={todo.completed ? "default" : "outline"}
            onClick={handleCompleteTodo}
            disabled={completeTodoMutation.isPending}
          >
            {completeTodoMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckSquare className="mr-2 h-4 w-4" />
            )}
            {todo.completed ? 'Concluída' : 'Marcar como Concluída'}
          </Button>
          <AlertDialog open={deleteTodoDialogOpen} onOpenChange={setDeleteTodoDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteTodoMutation.isPending}
              >
                {deleteTodoMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Tarefa</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteTodo}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Todo Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Tarefa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todo.description && (
              <div>
                <h4 className="font-medium mb-2">Descrição</h4>
                <p className="text-muted-foreground">{todo.description}</p>
              </div>
            )}
            
            {todo.dueDate && todo.dueDate !== null && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Vencimento: {format(new Date(todo.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>
            )}

            {todo.note && (
              <div>
                <h4 className="font-medium mb-2">Nota</h4>
                <p className="text-muted-foreground">{todo.note}</p>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Criada em: {todo.createdAt ? format(new Date(todo.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'Data não disponível'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Subtasks */}
        <Card>
          <CardHeader>
            <CardTitle>Subtarefas</CardTitle>
            <CardDescription>
              {todo.subtasks?.length || 0} subtarefa(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add new subtask */}
            <form onSubmit={handleCreateSubtask} className="flex space-x-2">
              <Input
                placeholder="Nova subtarefa..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                disabled={createSubtaskMutation.isPending}
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={!newSubtaskTitle.trim() || createSubtaskMutation.isPending}
              >
                {createSubtaskMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </form>

            {/* Subtasks list */}
            <div className="space-y-2">
              {todo.subtasks?.map((subtask) => (
                <div
                  key={subtask.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    subtask.completed ? 'bg-muted/50' : 'bg-background'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCompleteSubtask(subtask.id)}
                      disabled={completeSubtaskMutation.isPending}
                    >
                      {completeSubtaskMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : subtask.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <CheckSquare className="h-4 w-4" />
                      )}
                    </Button>
                    <span className={subtask.completed ? 'line-through text-muted-foreground' : ''}>
                      {subtask.title}
                    </span>
                  </div>
                  <AlertDialog open={subtaskToDelete === subtask.id} onOpenChange={(open) => {
                    if (!open) {
                      setSubtaskToDelete(null);
                    }
                  }}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deleteSubtaskMutation.isPending}
                        onClick={() => setSubtaskToDelete(subtask.id)}
                      >
                        {deleteSubtaskMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Subtarefa</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir esta subtarefa? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteSubtask}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
              
              {(!todo.subtasks || todo.subtasks.length === 0) && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma subtarefa criada ainda.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 