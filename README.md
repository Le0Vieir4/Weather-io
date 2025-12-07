# ☁️ Weather.io

Sistema completo de monitoramento e análise de dados meteorológicos com arquitetura moderna baseada em microserviços.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-20.x-green.svg)
![Go](https://img.shields.io/badge/go-1.21+-00ADD8.svg)
![Python](https://img.shields.io/badge/python-3.13-blue.svg)

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API](#-api)
- [Desenvolvimento](#-desenvolvimento)
- [Deploy](#-deploy)
- [Troubleshooting](#-troubleshooting)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## 🌟 Visão Geral

Weather.io é uma aplicação completa para coleta, processamento e visualização de dados meteorológicos em tempo real. O sistema utiliza uma arquitetura de microserviços com mensageria assíncrona para garantir escalabilidade e resiliência.

### Funcionalidades Principais

- ✅ Coleta automática de dados meteorológicos via API externa
- ✅ Processamento assíncrono com RabbitMQ
- ✅ Armazenamento em MongoDB
- ✅ Dashboard interativo com gráficos em tempo real
- ✅ Exportação de dados em CSV e Excel
- ✅ Autenticação com JWT e OAuth2 (Google, GitHub)
- ✅ Sistema de logs e auditoria
- ✅ Admin criado automaticamente na primeira execução
- ✅ API RESTful documentada

## 🏗️ Arquitetura

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│     API      │────▶│   MongoDB   │
│   (React)   │     │  (NestJS)    │     │             │
└─────────────┘     └──────────────┘     └─────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │   RabbitMQ   │
                    └──────────────┘
                        │       │
                ┌───────┘       └───────┐
                ▼                       ▼
        ┌──────────────┐        ┌──────────────┐
        │   Producer   │        │   Consumer   │
        │   (Python)   │        │     (Go)     │
        └──────────────┘        └──────────────┘
```

### Componentes

- **Frontend**: Interface React com Vite, TailwindCSS e shadcn/ui
- **API**: Backend NestJS com TypeScript, JWT e OAuth2
- **Producer**: Serviço Python que coleta dados meteorológicos e publica no RabbitMQ
- **Consumer**: Serviço Go que consome mensagens e processa dados
- **RabbitMQ**: Broker de mensagens para comunicação assíncrona
- **MongoDB**: Banco de dados NoSQL para armazenamento

## 🛠️ Tecnologias

### Frontend
- React 19
- Vite 7
- TailwindCSS 4
- React Router 7
- TanStack Query
- Recharts (gráficos)
- shadcn/ui
- Framer Motion

### Backend (API)
- NestJS 11
- TypeScript 5
- TypeORM
- MongoDB
- Passport (JWT, OAuth2)
- bcryptjs
- class-validator

### Producer
- Python 3.13
- Flask
- Pika (RabbitMQ)
- Pandas
- Requests

### Consumer
- Go 1.21+
- RabbitMQ Client
- MongoDB Driver

### Infraestrutura
- Docker & Docker Compose
- Nginx
- pnpm (monorepo)
- RabbitMQ 4

## 📦 Pré-requisitos

- Docker 24+ e Docker Compose
- Node.js 20+ (para desenvolvimento local)
- pnpm 8+ (para desenvolvimento local)
- Git

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/le0Vieir4/weather-io.git
cd weather-io
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta `infra/`:

```bash
cd infra
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# MongoDB
MONGODB_URI=mongodb://mongodb:27017/weather-io

# JWT
JWT_SECRET=sua-chave-secreta-super-segura-aqui

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# GitHub OAuth (opcional)
GITHUB_CLIENT_ID=seu-github-client-id
GITHUB_CLIENT_SECRET=seu-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# Admin Padrão
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@weather-io.com
ADMIN_PASSWORD=Admin@123456

# RabbitMQ
RABBITMQ_URL=amqp://admin:admin@rabbitmq:5672

# Weather API
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
```

### 3. Inicie os serviços

```bash
docker-compose up -d --build
```

### 4. Verifique os logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker logs api -f
docker logs frontend -f
docker logs producer -f
docker logs consumer -f
```

## 💻 Uso

### Acessar a Aplicação

- **Frontend**: http://localhost:5673
- **API**: http://localhost:3000
- **RabbitMQ Management**: http://localhost:15672
  - Usuário: `admin`
  - Senha: `admin`

### Login Padrão

Na primeira execução, um usuário admin é criado automaticamente:

- **Email**: `admin@weather-io.com` (ou conforme configurado)
- **Senha**: `Admin@123456` (ou conforme configurado)

⚠️ **IMPORTANTE**: Altere a senha padrão após o primeiro login!

### Exportar Dados

1. Acesse o dashboard
2. Clique em "Exportar Dados"
3. Escolha o formato (CSV ou Excel)
4. Defina o período desejado
5. Clique em "Download"

## 📁 Estrutura do Projeto

```
weather-io/
├── apps/
│   ├── api/              # Backend NestJS
│   │   ├── src/
│   │   │   ├── auth/     # Autenticação e OAuth
│   │   │   ├── users/    # Gerenciamento de usuários
│   │   │   ├── weather/  # Dados meteorológicos
│   │   │   ├── logs/     # Sistema de logs
│   │   │   └── scripts/  # Scripts utilitários
│   │   └── ADMIN_INIT.md
│   │
│   ├── frontend/         # Frontend React
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── providers/
│   │   │   └── types/
│   │   └── public/
│   │
│   ├── producer/         # Serviço Python
│   │   ├── src/
│   │   │   ├── api/
│   │   │   ├── messaging/
│   │   │   └── services/
│   │   └── exports/
│   │
│   └── consumer/         # Serviço Go
│       ├── main.go
│       └── transformData.go
│
├── infra/                # Infraestrutura
│   ├── docker-compose.yml
│   ├── Dockerfile.api
│   ├── Dockerfile.frontend
│   ├── nginx.conf
│   └── .env.example
│
├── package.json          # Workspace root
├── pnpm-workspace.yaml
└── README.md
```

## 🔌 API

### Endpoints Principais

#### Autenticação

```http
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/google
GET  /api/auth/github
POST /api/auth/logout
```

#### Usuários

```http
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
PATCH  /api/users/:id/password
```

#### Dados Meteorológicos

```http
GET  /api/weather
GET  /api/weather/latest
GET  /api/weather/logs
GET  /api/weather/export/latest
GET  /api/weather/export/download
GET  /api/weather/export/:filename
```

### Exemplo de Requisição

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@weather-io.com",
    "password": "Admin@123456"
  }'

# Obter dados meteorológicos
curl -X GET http://localhost:3000/api/weather \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🔧 Desenvolvimento

### Desenvolvimento Local (sem Docker)

#### 1. Instale as dependências

```bash
pnpm install
```

#### 2. Inicie o MongoDB e RabbitMQ

```bash
docker-compose up -d mongodb rabbitmq
```

#### 3. Inicie os serviços em modo dev

```bash
# API
cd apps/api
pnpm run start:dev

# Frontend
cd apps/frontend
pnpm run dev

# Producer
cd apps/producer
python main.py

# Consumer
cd apps/consumer
go run main.go
```

### Scripts Úteis

```bash
# Build de todos os projetos
pnpm run build

# Lint
pnpm run lint

# Testes (quando implementados)
pnpm run test
```

### Convenções de Código

- **TypeScript/JavaScript**: ESLint + Prettier
- **Python**: Black + Flake8
- **Go**: gofmt + golint

## 🚢 Deploy

### Produção com Docker

```bash
# Build otimizado
docker-compose -f docker-compose.prod.yml up -d --build

# Verificar saúde dos containers
docker-compose ps
docker-compose logs -f
```

### Variáveis de Ambiente em Produção

⚠️ **NUNCA** comite arquivos `.env` com credenciais reais!

```env
# Use senhas fortes e únicas
JWT_SECRET=$(openssl rand -base64 32)
ADMIN_PASSWORD=$(openssl rand -base64 16)

# Configure OAuth com URLs corretas
GOOGLE_CALLBACK_URL=https://seu-dominio.com/api/auth/google/callback
GITHUB_CALLBACK_URL=https://seu-dominio.com/api/auth/github/callback
```

## 🐛 Troubleshooting

### Frontend não carrega SVGs

```bash
# Verifique se os arquivos estão em UTF-8
cd apps/frontend
file src/assets/icons/*.svg

# Reconstrua o frontend
docker-compose build frontend --no-cache
docker-compose up -d frontend
```

### Erro "ts-node: not found" na API

O script `init-admin` usa a versão compilada. Verifique se o build foi executado corretamente.

```bash
docker logs api | grep "init-admin"
```

### Timezone incorreto no Producer

O producer está configurado para `America/Sao_Paulo`. Para alterar:

```yaml
# docker-compose.yml
producer:
  environment:
    - TZ=America/New_York  # Ou seu timezone
```

### RabbitMQ não conecta

```bash
# Verificar se o RabbitMQ está rodando
docker logs rabbitmq

# Acessar management UI
# http://localhost:15672
# user: admin / pass: admin
```

### MongoDB sem conexão

```bash
# Verificar conexão
docker exec -it api mongosh $MONGODB_URI

# Listar databases
show dbs
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes

- Siga as convenções de código do projeto
- Adicione testes quando aplicável
- Atualize a documentação conforme necessário
- Mantenha commits pequenos e descritivos

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Leonardo Vieira Moreira** - [le0Vier4](https://github.com/le0Vier4)

## 🙏 Agradecimentos

- [Open-Meteo](https://open-meteo.com/) - API de dados meteorológicos
- [NestJS](https://nestjs.com/) - Framework backend
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- Comunidade open source

---

<div align="center">
  <p>Feito com ☕ e ❤️</p>
  <p>
    <a href="#-weatherio">Voltar ao topo ⬆️</a>
  </p>
</div>
