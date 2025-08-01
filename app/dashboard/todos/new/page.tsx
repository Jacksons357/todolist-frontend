'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema, TodoFormData } from '@/lib/schemas';
import { useCreateTodo, useProjects } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';


export default function NewTodoPage() {
  const searchParams = useSearchParams();
  const defaultProjectId = searchParams.get('project') || '';
  const createTodoMutation = useCreateTodo();
  const { data: projects } = useProjects();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      projectId: defaultProjectId || undefined,
    },
  });

  const selectedProjectId = watch('projectId');

  const onSubmit = (data: TodoFormData) => {
    // Converter a data para formato ISO se fornecida
    const formattedData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate + 'T00:00:00').toISOString() : undefined,
    };
    
    createTodoMutation.mutate(formattedData, {
      onSuccess: () => {
        reset();
        setValue('projectId', defaultProjectId || undefined);
        toast.success('Tarefa criada com sucesso!', {
          description: 'A tarefa foi criada e você será redirecionada para a lista de tarefas.'
        });
        router.push('/dashboard/todos');
      },
      onError: (error) => {
        toast.error('Erro ao criar tarefa', {
          description: error.message || 'Ocorreu um erro ao criar a tarefa. Tente novamente.'
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/todos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Tarefa</h1>
          <p className="text-muted-foreground">
            Crie uma nova tarefa para se organizar
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Criar Tarefa</CardTitle>
          <CardDescription>
            Preencha as informações abaixo para criar sua tarefa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título da Tarefa *
              </label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Ex: Implementar autenticação"
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descreva detalhes da tarefa..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="project" className="text-sm font-medium">
                Projeto
              </label>
              <Select
                value={selectedProjectId || "none"}
                onValueChange={(value) => setValue('projectId', value === "none" ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem projeto</SelectItem>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color || '#3b82f6' }}
                        />
                        <span>{project.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Data de Vencimento
              </label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate')}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {createTodoMutation.error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {createTodoMutation.error.message || 'Erro ao criar tarefa'}
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={createTodoMutation.isPending}
                className="flex-1"
              >
                {createTodoMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Tarefa'
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/todos">
                  Cancelar
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 