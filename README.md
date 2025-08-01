# Todo List - Frontend

Uma aplicação completa de gerenciamento de tarefas e projetos construída com Next.js, React Query, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

### 🔐 Autenticação
- Login e registro de usuários
- Autenticação JWT com cookies
- Proteção de rotas
- Logout automático

### 📊 Dashboard
- Visão geral de projetos e tarefas
- Estatísticas em tempo real
- Projetos e tarefas recentes
- Navegação rápida

### 📁 Projetos
- Criação, edição e exclusão de projetos
- Cores personalizadas para projetos
- Progresso visual com barras
- Estatísticas de tarefas por projeto

### ✅ Tarefas
- Criação de tarefas com ou sem projeto
- Prioridades (Baixa, Média, Alta)
- Datas de vencimento
- Marcação de conclusão
- Filtros e busca avançada

### 📝 Subtarefas
- Criação de subtarefas para tarefas
- Marcação de conclusão individual
- Contagem de progresso

## 🛠️ Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **React Query (TanStack Query)** - Gerenciamento de estado assíncrono
- **Axios** - Cliente HTTP
- **Zod** - Validação de esquemas
- **React Hook Form** - Gerenciamento de formulários
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes UI
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas
- **js-cookie** - Gerenciamento de cookies

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Jacksons357/todolist-frontend
cd todolist-frontend
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure a API:
Certifique-se de que a API REST está rodando em `http://localhost:3333`

4. Execute o projeto:
```bash
pnpm dev
```

5. Acesse a aplicação:
```
http://localhost:3000
```

## 🏗️ Estrutura do Projeto

```
frontend/
├── app/                    # App Router do Next.js
│   ├── dashboard/         # Páginas do dashboard
│   ├── login/            # Página de login
│   ├── register/         # Página de registro
│   ├── globals.css       # Estilos globais
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página inicial
├── components/           # Componentes React
│   ├── layout/          # Componentes de layout
│   └── ui/              # Componentes UI (Shadcn)
├── contexts/            # Contextos React
│   └── AuthContext.tsx  # Contexto de autenticação
├── hooks/               # Hooks personalizados
│   ├── useQueries.ts    # Hooks do React Query
│   └── useToast.ts      # Hook de notificações
├── lib/                 # Utilitários e configurações
│   ├── api.ts          # Configuração do Axios
│   ├── schemas.ts      # Schemas de validação Zod
│   ├── types.ts        # Tipos TypeScript
│   └── utils.ts        # Utilitários
└── providers/          # Providers React
    └── QueryProvider.tsx # Provider do React Query
```

## 🔧 Configuração da API

A aplicação espera uma API REST com os seguintes endpoints:

### Autenticação
- `POST /auth/register` - Registro de usuário
- `POST /auth/login` - Login de usuário

### Projetos
- `GET /projects` - Listar projetos
- `POST /projects` - Criar projeto
- `PATCH /projects/:id` - Atualizar projeto
- `DELETE /projects/:id` - Excluir projeto

### Tarefas
- `GET /todos` - Listar tarefas
- `POST /todos` - Criar tarefa
- `PATCH /todos/:id` - Atualizar tarefa
- `DELETE /todos/:id` - Excluir tarefa
- `PATCH /todos/:id/complete` - Marcar como concluída

### Subtarefas
- `POST /todos/:todoId/subtasks` - Criar subtarefa
- `DELETE /subtasks/:subtaskId` - Excluir subtarefa
- `PATCH /subtasks/:subtaskId/complete` - Marcar subtarefa como concluída

## 🎨 Design System

A aplicação utiliza o design system do Shadcn/ui com:

- **Cores**: Sistema de cores baseado em variáveis CSS
- **Tipografia**: Inter como fonte principal
- **Componentes**: Botões, cards, inputs, selects, etc.
- **Responsividade**: Design mobile-first
- **Acessibilidade**: Componentes acessíveis por padrão

## 🔒 Autenticação

- Tokens JWT armazenados em cookies seguros
- Interceptadores Axios para adicionar tokens automaticamente
- Redirecionamento automático para login quando não autenticado
- Context API para gerenciar estado de autenticação

## 📱 Responsividade

A aplicação é totalmente responsiva com:

- **Mobile**: Sidebar colapsável, layout adaptativo
- **Tablet**: Layout intermediário otimizado
- **Desktop**: Sidebar fixa, layout completo

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras plataformas
A aplicação pode ser deployada em qualquer plataforma que suporte Next.js.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

Para suporte, abra uma issue no repositório ou entre em contato.
