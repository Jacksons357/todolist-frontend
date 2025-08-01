'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useProject, useUpdateProject } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Save, 
  Loader2,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function EditProjectPage() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();
  
  const { data: project, isLoading, error } = useProject(projectId);
  const updateProjectMutation = useUpdateProject();

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Preencher o formulário quando os dados do projeto carregarem
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || ''
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Nome do projeto é obrigatório');
      return;
    }

    try {
      await updateProjectMutation.mutateAsync({
        id: projectId,
        data: {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined
        }
      });

      toast.success('Projeto atualizado com sucesso!');
      router.push(`/dashboard/projects/${projectId}`);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar projeto');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
          O projeto que você está tentando editar não existe ou foi removido.
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/projects/${projectId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Projeto</h1>
          <p className="text-muted-foreground">
            Atualize as informações do seu projeto
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Projeto</CardTitle>
          <CardDescription>
            Modifique o nome e descrição do projeto conforme necessário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome do Projeto *
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Digite o nome do projeto..."
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                disabled={updateProjectMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <Textarea
                id="description"
                placeholder="Digite uma descrição para o projeto (opcional)..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                disabled={updateProjectMutation.isPending}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                type="submit"
                disabled={updateProjectMutation.isPending}
                className="flex-1"
              >
                {updateProjectMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/dashboard/projects/${projectId}`)}
                disabled={updateProjectMutation.isPending}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 