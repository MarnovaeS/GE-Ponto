# GE-Ponto — Gestão de Ponto Eletrônico

Sistema web de controle de ponto para funcionários, com suporte a geolocalização, histórico, dashboard gerencial e três níveis de acesso.

---

## Tecnologias

- **React 19** + TypeScript
- **Vite 6** (bundler)
- **Firebase 10** (Auth + Firestore)
- **TailwindCSS 3**
- **React Router 7**
- **Recharts** (gráficos)
- **Capacitor** (mobile Android/iOS)

---

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- Conta no [Firebase](https://console.firebase.google.com)

### 1. Clone o repositório

```bash
git clone https://github.com/MarnovaeS/GE-Ponto.git
cd GE-Ponto
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Firebase

#### 3.1 Crie o projeto no Firebase
1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um novo projeto
3. Vá em **Configurações do projeto** → **Seus aplicativos** → clique em **</>** (Web)
4. Copie as credenciais geradas

#### 3.2 Ative os serviços necessários
- **Authentication** → Provedores de login → Ativar **E-mail/senha**
- **Firestore Database** → Criar banco de dados (modo produção)

#### 3.3 Crie o arquivo `.env.local`

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:abcdef
```

> ⚠️ **Nunca commite o `.env.local` no Git!** Ele já está no `.gitignore`.

#### 3.4 Configure as regras de segurança do Firestore

Cole o conteúdo de `firestore.rules` em:  
**Firebase Console → Firestore → Regras**

Ou use o Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Modo Demo

Se o `.env.local` não estiver configurado, o app roda em **modo demo** automaticamente, com dados fictícios:

| Usuário | E-mail | Role |
|---|---|---|
| Ricardo Admin | admin@empresa.com | Administrador |
| Carla Gestora | carla@empresa.com | Gestor |
| João Silva | joao@empresa.com | Funcionário |

> Em modo demo, qualquer senha funciona. Nenhum dado é salvo.

---

## Deploy no Netlify

O projeto já possui `netlify.toml` configurado.

1. Faça push para o GitHub
2. Conecte o repositório em [netlify.com](https://netlify.com)
3. Configure as variáveis de ambiente no painel do Netlify  
   (as mesmas do `.env.local`)
4. Clique em **Deploy**

---

## Estrutura de pastas

```
GE-Ponto/
├── components/        # Componentes reutilizáveis (Layout, etc.)
├── views/             # Páginas (Login, Dashboard, PunchClock, History, UserManagement, SystemDocs)
├── public/            # Arquivos estáticos
├── App.tsx            # Raiz da aplicação, roteamento e estado global
├── types.ts           # Tipos TypeScript
├── constants.tsx      # Constantes e dados de demo
├── firebaseConfig.ts  # Configuração do Firebase (via variáveis de ambiente)
├── firestore.rules    # Regras de segurança do Firestore
├── .env.example       # Modelo de variáveis de ambiente
└── vite.config.ts     # Configuração do Vite
```

---

## Níveis de acesso

| Role | O que pode fazer |
|---|---|
| **ADMIN** | Tudo: gerenciar usuários, ver dashboard, registrar ponto |
| **MANAGER** | Ver dashboard de todos, aprovar/ver pontos da equipe |
| **EMPLOYEE** | Registrar próprio ponto, ver próprio histórico |

---

## Segurança

- Senhas gerenciadas exclusivamente pelo **Firebase Authentication** — nunca armazenadas no Firestore
- Regras do Firestore garantem que funcionários só acessam os próprios dados
- Variáveis de ambiente via `.env.local` para não expor credenciais no código
