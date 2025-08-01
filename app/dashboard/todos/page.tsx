'use client';

import { useState } from 'react';
import { useTodos, useProjects, useCompleteTodo, useDeleteTodo } from '@/hooks/useQueries';
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
  CheckSquare, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  Trash2,
  Loader2,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type FilterType = 'all' | 'pending' | 'completed' | 'overdue';

export default function TodosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  
  const { data: todos, isLoading } = useTodos();
  const { data: projects } = useProjects();
  const completeTodoMutation = useCompleteTodo();
  const deleteTodoMutation = useDeleteTodo();

  const filteredTodos = todos?.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' ? true :
                         filter === 'pending' ? !todo.completed :
                         filter === 'completed' ? todo.completed :
                         filter === 'overdue' ? !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date() : true;
    
    const matchesProject = selectedProject === 'all' ? true : todo.projectId === selectedProject;
    
    return matchesSearch && matchesFilter && matchesProject;
  }) || [];

  const handleCompleteTodo = (todoId: string) => {
    completeTodoMutation.mutate(todoId);
  };

  const confirmDeleteTodo = (todoId: string) => {
    deleteTodoMutation.mutate(todoId);
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
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-muted-foreground">
            Gerencie suas tarefas e mantenha-se organizado
          </p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
          <Link href="/dashboard/todos/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Tarefa
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">Todas</option>
            <option value="pending">Pendentes</option>
            <option value="completed">Concluídas</option>
            <option value="overdue">Atrasadas</option>
          </select>
          
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">Todos os projetos</option>
            {projects?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Todos List */}
      {filteredTodos.length > 0 ? (
        <div className="space-y-4">
          {filteredTodos.map((todo) => (
                         <TodoCard
               key={todo.id}
               todo={todo}
               project={projects?.find(p => p.id === todo.projectId)}
               onComplete={handleCompleteTodo}
               onConfirmDelete={confirmDeleteTodo}
             />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {searchTerm || filter !== 'all' || selectedProject !== 'all' 
                ? 'Nenhuma tarefa encontrada' 
                : 'Nenhuma tarefa ainda'
              }
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filter !== 'all' || selectedProject !== 'all'
                ? 'Tente ajustar seus filtros ou criar uma nova tarefa.'
                : 'Comece criando sua primeira tarefa para se organizar.'
              }
            </p>
            <Button asChild>
              <Link href="/dashboard/todos/new">
                <Plus className="mr-2 h-4 w-4" />
                Criar Tarefa
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface TodoCardProps {
  todo: any;
  project?: any;
  onComplete: (todoId: string) => void;
  onConfirmDelete: (todoId: string) => void;
}

function TodoCard({ todo, project, onComplete, onConfirmDelete }: TodoCardProps) {
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();

  return (
    <Card className={`transition-all hover:shadow-md ${todo.completed ? 'opacity-75' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={() => onComplete(todo.id)}
              className={`mt-1 w-5 h-5 rounded border-2 transition-colors ${
                todo.completed 
                  ? 'bg-primary border-primary' 
                  : 'border-muted-foreground hover:border-primary'
              }`}
            >
              {todo.completed && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {todo.title}
                </h3>
              </div>
              
              {todo.description && (
                <p className={`text-sm text-muted-foreground mb-2 ${todo.completed ? 'line-through' : ''}`}>
                  {todo.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                {project && (
                  <div className="flex items-center space-x-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color || '#3b82f6' }}
                    />
                    <span>{project.name}</span>
                  </div>
                )}
                
                {todo.dueDate && (
                  <div className={`flex items-center space-x-1 ${
                    isOverdue ? 'text-destructive' : ''
                  }`}>
                    <Calendar className="h-3 w-3" />
                    <span>
                      {format(new Date(todo.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                    {isOverdue && <span className="text-destructive">(Atrasada)</span>}
                  </div>
                )}
                
                {todo.subtasks && todo.subtasks.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <CheckSquare className="h-3 w-3" />
                    <span>
                      {todo.subtasks.filter((subtask: any) => subtask.completed).length}/{todo.subtasks.length} subtarefas
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/todos/${todo.id}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Tarefa</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir a tarefa "{todo.title}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onConfirmDelete(todo.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 