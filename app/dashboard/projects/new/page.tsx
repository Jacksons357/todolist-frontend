'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, ProjectFormData } from '@/lib/schemas';
import { useCreateProject } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Palette } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const colorOptions = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

export default function NewProjectPage() {
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const createProjectMutation = useCreateProject();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = (data: ProjectFormData) => {
    const projectData = {
      ...data,
      color: selectedColor,
    };
    
    createProjectMutation.mutate(projectData, {
      onSuccess: () => {
        reset();
        setSelectedColor(colorOptions[0]);
        toast.success('Projeto criado com sucesso!', {
          description: 'O projeto foi criado e você será redirecionado para a lista de projetos.'
        });
        router.push('/dashboard/projects');
      },
      onError: (error) => {
        toast.error('Erro ao criar projeto', {
          description: error.message || 'Ocorreu um erro ao criar o projeto. Tente novamente.'
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Projeto</h1>
          <p className="text-muted-foreground">
            Crie um novo projeto para organizar suas tarefas
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Criar Projeto</CardTitle>
          <CardDescription>
            Preencha as informações abaixo para criar seu projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome do Projeto *
              </label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Desenvolvimento Web"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descreva brevemente o objetivo do projeto..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Palette className="mr-2 h-4 w-4" />
                Cor do Projeto
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color 
                        ? 'border-foreground scale-110' 
                        : 'border-border hover:border-foreground/50'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {createProjectMutation.error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                {createProjectMutation.error.message || 'Erro ao criar projeto'}
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={createProjectMutation.isPending}
                className="flex-1"
              >
                {createProjectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Projeto'
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/projects">
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