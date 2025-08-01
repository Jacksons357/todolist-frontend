// Exemplo de configurações de ambiente
// Copie este arquivo para .env.local e ajuste os valores

export const envConfig = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
  
  // Authentication
  JWT_COOKIE_NAME: process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || 'token',
  USER_COOKIE_NAME: process.env.NEXT_PUBLIC_USER_COOKIE_NAME || 'user',
  
  // App Configuration
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Todo List',
  APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Aplicação completa para gerenciamento de tarefas e projetos',
};

// Variáveis de ambiente necessárias:
// NEXT_PUBLIC_API_URL=http://localhost:3333
// NEXT_PUBLIC_JWT_COOKIE_NAME=token
// NEXT_PUBLIC_USER_COOKIE_NAME=user
// NEXT_PUBLIC_APP_NAME=Todo List
// NEXT_PUBLIC_APP_DESCRIPTION=Aplicação completa para gerenciamento de tarefas e projetos 