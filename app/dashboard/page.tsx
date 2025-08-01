'use client';

import { useProjects, useTodos } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  CheckCircle, 
  Plus,
  Loader2 
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: todos, isLoading: todosLoading } = useTodos();

  const completedTodos = todos?.filter(todo => todo.completed) || [];
  const pendingTodos = todos?.filter(todo => !todo.completed) || [];
  const todosWithDueDate = todos?.filter(todo => todo.dueDate && !todo.completed) || [];

  const stats = [
    {
      title: 'Projetos',
      value: projects?.length || 0,
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/dashboard/projects'
    },
    {
      title: 'Tarefas Pendentes',
      value: pendingTodos.length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/dashboard/todos'
    },
    {
      title: 'Tarefas Concluídas',
      value: completedTodos.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/dashboard/todos'
    },
    {
      title: 'Com Prazo',
      value: todosWithDueDate.length,
      icon: CheckSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/dashboard/todos'
    }
  ];

  if (projectsLoading || todosLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral dos seus projetos e tarefas
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button asChild>
            <Link href="/dashboard/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Projeto
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/todos/new">
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link href={stat.href}>
                  Ver detalhes →
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Projects */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Projetos Recentes</CardTitle>
            <CardDescription>
              Seus projetos mais recentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects && projects.length > 0 ? (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color || '#3b82f6' }}
                      />
                      <div>
                        <p className="font-medium">{project.name}</p>
                        {project.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/projects/${project.id}`}>
                        Ver
                      </Link>
                    </Button>
                  </div>
                ))}
                {projects.length > 5 && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/projects">
                      Ver todos os projetos
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-muted-foreground">
                  Nenhum projeto
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Comece criando seu primeiro projeto.
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/dashboard/projects/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Projeto
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Todos */}
        <Card>
          <CardHeader>
            <CardTitle>Tarefas Pendentes</CardTitle>
            <CardDescription>
              Suas tarefas que precisam de atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTodos.length > 0 ? (
              <div className="space-y-3">
                {pendingTodos.slice(0, 5).map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium">{todo.title}</p>
                        {todo.projectId && (
                          <p className="text-sm text-muted-foreground">
                            Projeto: {projects?.find(p => p.id === todo.projectId)?.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/todos/${todo.id}`}>
                        Ver
                      </Link>
                    </Button>
                  </div>
                ))}
                {pendingTodos.length > 5 && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/todos">
                      Ver todas as tarefas
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-muted-foreground">
                  Nenhuma tarefa pendente
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Parabéns! Você está em dia.
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/dashboard/todos/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Tarefa
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 