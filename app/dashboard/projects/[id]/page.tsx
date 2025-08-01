'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useProject } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Plus, 
  Edit, 
  Trash2, 
  Loader2,
  CheckSquare,
  Calendar,
  Clock,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { useDeleteProject } from '@/hooks/useQueries';
import { useRouter } from 'next/navigation';

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();
  const [deleteProjectDialogOpen, setDeleteProjectDialogOpen] = useState(false);
  
  const { data: project, isLoading, error } = useProject(projectId);
  const deleteProjectMutation = useDeleteProject();

  const handleDeleteProject = () => {
    setDeleteProjectDialogOpen(true);
  };

  const confirmDeleteProject = () => {
    deleteProjectMutation.mutate(projectId, {
      onSuccess: () => {
        router.push('/dashboard/projects');
      }
    });
    setDeleteProjectDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-muted-foreground">
          Projeto não encontrado
        </h2>
        <p className="text-muted-foreground text-center">
          O projeto que você está procurando não existe ou foi removido.
        </p>
        <Button asChild>
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos Projetos
          </Link>
        </Button>
      </div>
    );
  }

  const completedTodos = project.todos?.filter(todo => todo.completed) || [];
  const pendingTodos = project.todos?.filter(todo => !todo.completed) || [];
  const progressPercentage = project.todos?.length ? 
    Math.round((completedTodos.length / project.todos.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            {project.description && (
              <p className="text-muted-foreground mt-1">{project.description}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/projects/${project.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <AlertDialog open={deleteProjectDialogOpen} onOpenChange={setDeleteProjectDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive hover:text-destructive"
                disabled={deleteProjectMutation.isPending}
              >
                {deleteProjectMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Projeto</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteProject}>
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.todos?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTodos.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingTodos.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso do Projeto</CardTitle>
          <CardDescription>
            {progressPercentage}% concluído
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-secondary rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Todos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tarefas do Projeto</h2>
          <Button asChild>
            <Link href={`/dashboard/todos/new?project=${project.id}`}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Link>
          </Button>
        </div>

        {project.todos && project.todos.length > 0 ? (
          <div className="grid gap-4">
            {project.todos.map((todo) => (
              <Card key={todo.id} className={todo.completed ? 'opacity-75' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`w-4 h-4 rounded-full mt-1 ${
                        todo.completed ? 'bg-green-600' : 'bg-gray-300'
                      }`} />
                      <div className="flex-1">
                        <h3 className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className={`text-sm mt-1 ${todo.completed ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                            {todo.description}
                          </p>
                        )}
                        {todo.subtasks && todo.subtasks.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {todo.subtasks.map((subtask) => (
                              <div key={subtask.id} className="flex items-center space-x-2 text-sm">
                                <div className={`w-3 h-3 rounded-full ${
                                  subtask.completed ? 'bg-green-600' : 'bg-gray-300'
                                }`} />
                                <span className={subtask.completed ? 'line-through text-muted-foreground' : ''}>
                                  {subtask.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/todos/${todo.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Nenhuma tarefa ainda
              </h3>
              <p className="text-muted-foreground mb-6">
                Comece criando sua primeira tarefa para este projeto.
              </p>
              <Button asChild>
                <Link href={`/dashboard/todos/new?project=${project.id}`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Tarefa
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 