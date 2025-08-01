'use client';

import { useState } from 'react';
import { useProjects, useDeleteProject } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  FolderOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Loader2,
  Calendar,
  CheckSquare
} from 'lucide-react';
import Link from 'next/link';
import { useTodosByProject } from '@/hooks/useQueries';

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: projects, isLoading } = useProjects();
  const deleteProjectMutation = useDeleteProject();

  const filteredProjects = projects?.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDeleteProject = (projectId: string) => {
    // Esta função agora só é chamada para logging/debug se necessário
    console.log('Delete project requested:', projectId);
  };

  const confirmDeleteProject = (projectId: string) => {
    deleteProjectMutation.mutate(projectId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie seus projetos e organize suas tarefas
          </p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar projetos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onDelete={handleDeleteProject}
              onConfirmDelete={confirmDeleteProject}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {searchTerm ? 'Nenhum projeto encontrado' : 'Nenhum projeto ainda'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? 'Tente ajustar sua busca ou criar um novo projeto.'
                : 'Comece criando seu primeiro projeto para organizar suas tarefas.'
              }
            </p>
            <Button asChild>
              <Link href="/dashboard/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar Projeto
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ProjectCardProps {
  project: any;
  onDelete: (projectId: string) => void;
  onConfirmDelete: (projectId: string) => void;
}

function ProjectCard({ project, onDelete, onConfirmDelete }: ProjectCardProps) {
  const { data: projectTodos } = useTodosByProject(project.id);
  const completedTodos = projectTodos?.filter(todo => todo.completed) || [];
  const pendingTodos = projectTodos?.filter(todo => !todo.completed) || [];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color || '#3b82f6' }}
            />
            <div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              {project.description && (
                <CardDescription className="mt-1">
                  {project.description}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/projects/${project.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(project.id)}
                >
                  <Trash2 className="h-4 w-4" />
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
                  <AlertDialogAction onClick={() => onConfirmDelete(project.id)}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">
                {projectTodos?.length ? 
                  `${Math.round((completedTodos.length / projectTodos.length) * 100)}%` : 
                  '0%'
                }
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ 
                  width: projectTodos?.length ? 
                    `${(completedTodos.length / projectTodos.length) * 100}%` : 
                    '0%' 
                }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-4 w-4 text-green-600" />
              <span>{completedTodos.length} concluídas</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span>{pendingTodos.length} pendentes</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/dashboard/projects/${project.id}`}>
                Ver Detalhes
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/todos/new?project=${project.id}`}>
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 