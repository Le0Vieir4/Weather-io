# 🌦️ Weather.io - Frontend

<div align="center">

![Weather.io](https://img.shields.io/badge/Weather.io-Dashboard-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

Uma aplicação moderna de previsão do tempo com dashboards interativos, gráficos avançados e autenticação OAuth.

[Demo](#-demonstração) • [Recursos](#-recursos) • [Instalação](#-instalação) • [Uso](#-uso) • [Documentação](#-documentação)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Recursos](#-recursos)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Componentes Principais](#-componentes-principais)
- [API Hooks](#-api-hooks)
- [Padrões de Código](#-padrões-de-código)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🌟 Sobre o Projeto

**Weather.io** é uma aplicação web completa para visualização de dados meteorológicos em tempo real. Oferece uma interface moderna e intuitiva com dashboards interativos, gráficos detalhados e histórico de dados climáticos.

### 🎯 Objetivos

- ✅ Fornecer previsões meteorológicas precisas e atualizadas
- ✅ Visualizar dados históricos com gráficos interativos
- ✅ Gerenciar perfis de usuário com autenticação OAuth
- ✅ Interface responsiva e acessível
- ✅ Experiência de usuário fluida e intuitiva

---

## ✨ Recursos

### 🌡️ Dashboard Principal
- **Clima Atual**: Visualização em tempo real da temperatura, umidade e condições meteorológicas
- **Previsão Semanal**: Dados detalhados para os próximos 7 dias
- **Ícones Dinâmicos**: Representação visual baseada nos códigos WMO
- **Atualização Automática**: Refresh automático dos dados a cada 5 minutos

### 📊 Estatísticas Avançadas
- **Gráficos Interativos**: Área charts com múltiplas métricas (Recharts)
- **Tabs de Período**: Alterne entre previsão, última semana e último mês
- **Métricas Disponíveis**:
  - Temperatura Máxima/Mínima
  - Sensação Térmica
  - Índice UV
  - Probabilidade de Precipitação
- **Export de Dados**: Baixe dados históricos em formato estruturado

### 👤 Gerenciamento de Perfil
- **Autenticação OAuth**: Login via Google, GitHub, etc.
- **Avatar Upload**: Suporte para upload de imagem ou URL
- **Edição de Perfil**: Atualize username, email, nome e foto
- **Alteração de Senha**: Para usuários não-OAuth
- **Exclusão de Conta**: Opção de deletar conta permanentemente

### 🎨 UI/UX
- **Design Moderno**: Interface limpa usando shadcn/ui
- **Dark Mode**: Tema escuro automático
- **Responsivo**: Otimizado para desktop, tablet e mobile
- **Toasts Informativos**: Feedback visual para todas as ações
- **Skeleton Loading**: Estados de carregamento elegantes

---

## 🛠️ Tecnologias

### Core
- **React 19.2.0** - Biblioteca UI com React Compiler
- **TypeScript 5.x** - Tipagem estática
- **Vite 5.x** - Build tool ultra-rápida
- **React Router 7.9** - Roteamento e navegação

### Estilização
- **Tailwind CSS 4.1** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI reutilizáveis
- **Radix UI** - Primitivos acessíveis
- **Lucide React** - Biblioteca de ícones

### Gráficos e Visualização
- **Recharts 2.15** - Biblioteca de gráficos React
- **Motion (Framer Motion) 12.23** - Animações

### Gerenciamento de Estado
- **TanStack Query 5.90** - Gerenciamento de estado assíncrono
- **React Hook Form 7.66** - Formulários performáticos
- **Zod 3.25** - Validação de schemas

### Comunicação
- **Axios 1.13** - Cliente HTTP
- **JWT Decode 4.0** - Decodificação de tokens

### Utilidades
- **Sonner 2.0** - Toast notifications
- **next-themes 0.4** - Gerenciamento de temas
- **clsx / tailwind-merge** - Utilidades de classes CSS

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 ou **pnpm** >= 8.0.0 (recomendado)
- **Git**

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/weather-io.git
cd weather-io/apps/frontend
```

### 2. Instale as dependências

```bash
# Usando npm
npm install

# Ou usando pnpm (recomendado)
pnpm install
```

### 3. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
nano .env
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# URL da API do backend NestJS
# Desenvolvimento: http://localhost:3000/api
# Produção: https://api.weather-io.com/api
VITE_NEST_URL=http://localhost:3000/api

# Alias alternativo (usado em alguns componentes)
VITE_API_URL=http://localhost:3000
```

### Ambientes Específicos

- **`.env.development`** - Configurações de desenvolvimento
- **`.env.production`** - Configurações de produção
- **`.env.example`** - Template para novos ambientes

---

## 🎮 Uso

### Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
pnpm dev
```

O aplicativo estará disponível em: **http://localhost:5173**

### Build de Produção

Compile o projeto para produção:

```bash
npm run build
# ou
pnpm build
```

Os arquivos otimizados estarão em `dist/`.

### Preview da Build

Visualize a build de produção localmente:

```bash
npm run preview
# ou
pnpm preview
```

### Lint

Execute o linter para verificar problemas no código:

```bash
npm run lint
# ou
pnpm lint
```

---

## 📁 Estrutura do Projeto

```
frontend/
├── public/                      # Arquivos estáticos
│   └── ...
├── src/
│   ├── assets/                  # Imagens, ícones e recursos
│   │   ├── icons/
│   │   │   ├── cloud-icon.svg
│   │   │   ├── sun-icon.svg
│   │   │   └── ...
│   │   └── night-sky.png
│   │
│   ├── auth/                    # Autenticação
│   │   ├── authProvider.tsx    # Context Provider de autenticação
│   │   └── useAuthApi.ts       # Hook de API de autenticação
│   │
│   ├── components/              # Componentes reutilizáveis
│   │   └── ui/                  # Componentes shadcn/ui
│   │       ├── avatar.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── chart.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── tabs.tsx
│   │       └── ...
│   │
│   ├── hooks/                   # Custom Hooks
│   │   ├── useAuth.ts          # Hook de autenticação
│   │   ├── useWeatherApi.ts    # Hook de API meteorológica
│   │   └── useToast.ts         # Hook de notificações
│   │
│   ├── layouts/                 # Layouts da aplicação
│   │   └── DashboardLayout.tsx # Layout do dashboard
│   │
│   ├── pages/                   # Páginas da aplicação
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── Navigation.tsx
│   │   │   │   └── navMenu.tsx
│   │   │   ├── AdvancedStats.tsx
│   │   │   └── Header.tsx
│   │   ├── Dashboard.tsx       # Página principal
│   │   ├── Login.tsx           # Página de login
│   │   └── changePasswordPage.tsx
│   │
│   ├── routes/                  # Configuração de rotas
│   │   └── privateRoutes.tsx   # Rotas protegidas
│   │
│   ├── types/                   # Tipos e schemas TypeScript
│   │   └── schemas/
│   │       ├── user-schema.ts
│   │       ├── weather-schema.ts
│   │       └── update-user.schema.ts
│   │
│   ├── utils/                   # Funções utilitárias
│   │   ├── dateHelpers.ts      # Helpers de data
│   │   ├── weatherIcons.ts     # Mapeamento de ícones
│   │   ├── debugAuth.ts        # Debug de autenticação
│   │   └── utils.ts            # Utilitários gerais
│   │
│   ├── App.tsx                  # Componente raiz
│   ├── main.tsx                 # Entry point
│   └── index.css                # Estilos globais
│
├── .env.example                 # Template de variáveis de ambiente
├── .gitignore
├── components.json              # Configuração shadcn/ui
├── eslint.config.js            # Configuração ESLint
├── index.html                  # HTML template
├── package.json
├── tsconfig.json               # Configuração TypeScript
├── vite.config.ts              # Configuração Vite
└── README.md
```

---

## 🧩 Componentes Principais

### Dashboard (`src/pages/Dashboard.tsx`)
Página principal com cards de clima atual e previsão semanal.

**Recursos:**
- Exibição de dados meteorológicos em tempo real
- Cards de previsão para 7 dias
- Ícones dinâmicos baseados em códigos WMO
- Filtro de dados a partir de hoje
- Atualização automática a cada 5 minutos

### AdvancedStats (`src/pages/dashboard/AdvancedStats.tsx`)
Página de estatísticas avançadas com gráficos interativos.

**Recursos:**
- Gráfico de área interativo com múltiplas métricas
- Tabs para alternar entre previsão, última semana e último mês
- Seleção de métricas (temperatura, UV, chuva, etc.)
- Cálculo de médias e agregações
- Botão de export de dados

### Header (`src/pages/dashboard/Header.tsx`)
Cabeçalho global da aplicação.

**Recursos:**
- Logo e branding
- Menu de usuário (dropdown)
- Navegação responsiva

### Menu (`src/pages/dashboard/components/navMenu.tsx`)
Menu dropdown de perfil do usuário.

**Recursos:**
- Avatar com fallback
- Edição de perfil (username, email, nome, foto)
- Upload de avatar (arquivo ou URL)
- Alteração de senha
- Logout
- Exclusão de conta

---

## 🔌 API Hooks

### `useWeatherApi`

Hook customizado para interações com a API meteorológica.

```typescript
const {
  loading,
  error,
  getLatestWeather,
  getWeatherLogs
} = useWeatherApi();
```

**Métodos:**
- `getLatestWeather()`: Retorna os dados meteorológicos mais recentes
- `getWeatherLogs(days)`: Retorna logs históricos dos últimos N dias

### `useAuthApi`

Hook para autenticação e gerenciamento de usuários.

```typescript
const {
  login,
  logout,
  register,
  getUser,
  update,
  deleteUser,
  changePassword
} = useAuthApi();
```

**Métodos:**
- `login(credentials)`: Autenticação de usuário
- `logout()`: Encerra sessão
- `register(data)`: Registro de novo usuário
- `getUser()`: Obtém dados do usuário atual
- `update(data)`: Atualiza perfil do usuário
- `deleteUser()`: Deleta conta do usuário
- `changePassword(oldPassword, newPassword)`: Altera senha

### `useToast`

Hook modular para notificações toast.

```typescript
const { toasts } = useToast();

// Uso
toasts.success("Título", "Descrição");
toasts.error("Erro", "Mensagem de erro");
toasts.profileUpdateSuccess();
toasts.oauthEditWarning("Google");
```

**Tipos de toast:**
- `success`, `error`, `warning`, `info`
- Pré-configurados: `profileUpdateSuccess`, `accountDeleted`, `invalidFileType`, etc.

---

## 📐 Padrões de Código

### Nomenclatura

- **Componentes**: PascalCase (`Dashboard.tsx`, `WeatherCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useWeatherApi.ts`)
- **Utilitários**: camelCase (`dateHelpers.ts`, `weatherIcons.ts`)
- **Tipos**: PascalCase (`User`, `WeatherData`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`, `DAY_NAMES`)

### Estrutura de Componentes

```tsx
// Imports
import { useState } from 'react';
import { Component } from '@/components/ui/component';

// Types
interface ComponentProps {
  prop: string;
}

// Component
function Component({ prop }: ComponentProps) {
  // Hooks
  const [state, setState] = useState();

  // Handlers
  const handleAction = () => {};

  // Render
  return <div>{prop}</div>;
}

// Export
export default Component;
```

### TypeScript

- Use tipos explícitos sempre que possível
- Evite `any`, prefira `unknown` quando necessário
- Crie interfaces para props e objetos complexos
- Use Zod para validação de schemas

### Importações

Use path aliases configurados no `tsconfig.json`:

```typescript
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/dateHelpers';
```

---

## 🎨 Customização de Tema

O projeto usa Tailwind CSS 4.1 com variáveis CSS customizadas. Edite `src/index.css` para personalizar cores:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  /* ... mais variáveis */
}
```

---

## 🧪 Testes

```bash
# Executar testes (quando implementado)
npm run test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 📚 Documentação Adicional

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [React Router](https://reactrouter.com/)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Guidelines

- Siga os padrões de código estabelecidos
- Escreva commits descritivos
- Adicione testes quando aplicável
- Atualize a documentação se necessário

---

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/seu-usuario/weather-io/issues) com:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Informações do ambiente (navegador, OS, etc.)

---

## 📝 Changelog

Veja [CHANGELOG.md](./CHANGELOG.md) para histórico de versões e mudanças.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Seu Nome**
- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- Email: seu.email@example.com

---

## 🙏 Agradecimentos

- [Open-Meteo](https://open-meteo.com/) - API de dados meteorológicos
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Vercel](https://vercel.com/) - Hosting e deployment
- Comunidade open-source

---

<div align="center">

**Feito com ❤️ e ☕**

⭐ Star este repositório se você achou útil!

</div>
