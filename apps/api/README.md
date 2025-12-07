# Weather.io API

API RESTful construída com NestJS para gerenciamento de usuários, autenticação e logs de clima.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Tipagem estática
- **MongoDB** - Banco de dados NoSQL
- **TypeORM** - ORM para TypeScript
- **Passport** - Autenticação (JWT, Google OAuth, GitHub OAuth)
- **JWT** - JSON Web Tokens
- **bcryptjs** - Hashing de senhas
- **class-validator** - Validação de dados

## 📋 Pré-requisitos

- Node.js >= 18
- pnpm >= 8
- MongoDB >= 6.0
- Contas OAuth configuradas (Google e/ou GitHub)

## 🔧 Instalação

```bash
# Instalar dependências
pnpm install

# Copiar arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# Configurar variáveis de ambiente no arquivo .env
```

## ⚙️ Configuração de Variáveis de Ambiente

Edite o arquivo `.env` com suas configurações:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/weather-io

# JWT
SECRET=sua-chave-secreta-super-segura-aqui
SESSION_SECRET=sua-session-secret-aqui

# Google OAuth
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=seu-github-client-id
GITHUB_CLIENT_SECRET=seu-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback
```

## 🎯 Como Obter Credenciais OAuth

### Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Navegue até "APIs & Services" > "Credentials"
4. Clique em "Create Credentials" > "OAuth client ID"
5. Configure:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
6. Copie o Client ID e Client Secret para o `.env`

### GitHub OAuth

1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Clique em "New OAuth App"
3. Configure:
   - Application name: Weather.io API
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/github/callback`
4. Copie o Client ID e gere um Client Secret
5. Cole no arquivo `.env`

## 🏃 Executando a Aplicação

```bash
# Desenvolvimento (com hot-reload)
pnpm start:dev

# Produção
pnpm build
pnpm start:prod

# Debug
pnpm start:debug
```

## 📚 Endpoints da API

### Autenticação

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "password": "senha123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123"
}
```

#### Perfil (Autenticado)
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

#### Google OAuth
```http
# Iniciar login
GET /api/auth/google

# Callback (redirecionamento automático)
GET /api/auth/google/callback
```

#### GitHub OAuth
```http
# Iniciar login
GET /api/auth/github

# Callback (redirecionamento automático)
GET /api/auth/github/callback
```

### Usuários

#### Listar Todos
```http
GET /api/users
Authorization: Bearer {token}
```

#### Buscar por ID
```http
GET /api/users/:id
Authorization: Bearer {token}
```

#### Atualizar
```http
PATCH /api/users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "João",
  "lastName": "Silva"
}
```

#### Desativar
```http
DELETE /api/users/:id
Authorization: Bearer {token}
```

### Weather Logs

#### Criar Log
```http
POST /api/weather
Authorization: Bearer {token}
Content-Type: application/json

{
  "city": "São Paulo",
  "temperature": 25.5,
  "condition": "Ensolarado"
}
```

#### Listar Logs
```http
GET /api/weather
Authorization: Bearer {token}
```

## 🔐 Autenticação

A API suporta dois tipos de autenticação:

### 1. Autenticação Tradicional (Email + Senha)
- Usuário se registra com email e senha
- Dados são salvos no banco de dados MongoDB
- Login retorna um JWT válido por 24 horas

### 2. Autenticação OAuth (Google/GitHub)
- Usuário faz login via Google ou GitHub
- **Dados NÃO são salvos no banco de dados**
- JWT contém todas as informações do perfil OAuth
- JWT expira em 24 horas
- Cada provider é independente (mesmo email = contas diferentes)

#### Diferenças do JWT:

**Usuário Tradicional:**
```json
{
  "sub": "507f1f77bcf86cd799439011",
  "email": "user@example.com"
}
```

**Usuário OAuth:**
```json
{
  "sub": "google-user@example.com",
  "email": "user@example.com",
  "username": "John Doe",
  "provider": "google",
  "picture": "https://...",
  "firstName": "John",
  "lastName": "Doe",
  "isOAuth": true
}
```

## 🗂️ Estrutura do Projeto

```
src/
├── auth/                   # Módulo de autenticação
│   ├── decorator/         # Decorators customizados
│   ├── dto/              # Data Transfer Objects
│   ├── guard/            # Guards de autenticação
│   ├── strategy/         # Estratégias Passport (JWT, Google, GitHub)
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/                 # Módulo de usuários
│   ├── user.entity.ts    # Entidade do usuário
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── weather/              # Módulo de logs de clima
│   ├── dto/
│   ├── weather.entity.ts
│   ├── weather.controller.ts
│   ├── weather.service.ts
│   └── weather.module.ts
├── logs/                 # Sistema de logs
├── middleware/           # Middlewares customizados
├── scripts/             # Scripts utilitários
├── app.module.ts        # Módulo raiz
└── main.ts             # Entry point
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm start:dev          # Inicia com hot-reload
pnpm start:debug        # Inicia em modo debug

# Build
pnpm build              # Compila o projeto

# Produção
pnpm start:prod         # Inicia versão compilada

# Linting e Formatação
pnpm lint               # Executa ESLint
pnpm format             # Formata código com Prettier

# Testes
pnpm test               # Executa testes unitários
pnpm test:watch         # Testes em modo watch
pnpm test:cov           # Testes com coverage
pnpm test:e2e           # Testes end-to-end
```

## 🎨 Características Especiais

### Limite de Logs de Weather
- Sistema automático de limpeza
- Mantém apenas os **10 logs mais recentes** por usuário
- Logs mais antigos são deletados automaticamente

### Sessões e Cookies
- Suporte a sessões com `express-session`
- Cookies seguros para OAuth
- CORS habilitado para o frontend

### Validação de Dados
- Validação automática com `class-validator`
- DTOs tipados com TypeScript
- Whitelist de propriedades permitidas

### Segurança
- Senhas hashadas com bcryptjs
- JWTs com expiração configurável
- Guards para rotas protegidas
- CORS configurado

## 🐛 Debugging

### Logs de Debug
O projeto inclui logs detalhados para facilitar o debug:

- 🟢 Google OAuth: logs com emoji verde
- 🔵 GitHub OAuth: logs com emoji azul
- 📍 Rotas: logs de requisições
- 🔐 JWT: logs de validação de tokens

### Exemplos de Logs:
```
🟢 GoogleStrategy inicializada com: { clientID: 'configurado', ... }
🔵 GithubStrategy.validate chamado com profile: { ... }
🔐 Gerando JWT para usuário OAuth: { provider: 'github', email: '...' }
📍 Rota /auth/github/callback chamada
```

## 📝 Testes com REST Client

Há um arquivo `request.http` na raiz do projeto com exemplos de todas as requisições.

Para usar:
1. Instale a extensão "REST Client" no VS Code
2. Abra o arquivo `request.http`
3. Clique em "Send Request" acima de cada requisição

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença UNLICENSED.

## 👥 Autores

- Desenvolvido para o projeto Weather.io

## 🆘 Suporte

Para problemas ou dúvidas:
1. Verifique a seção de [Debugging](#-debugging)
2. Confira os logs do servidor
3. Abra uma issue no repositório

---

**Nota:** Este projeto faz parte de um monorepo. A estrutura completa está em `/home/reo/projects/weather-io/`.
