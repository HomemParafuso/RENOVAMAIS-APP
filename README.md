# Renova Mais Energia APP

Aplicativo para gerenciamento de energia solar, com portais para administradores, clientes e geradoras.

## Visão Geral

O Renova Mais Energia é uma plataforma completa para gerenciamento de energia solar, permitindo que geradoras gerenciem seus clientes, faturas e relatórios, enquanto os clientes podem acompanhar seu consumo e faturas.

## Tecnologias Utilizadas

Este projeto é construído com:

- **Frontend**:
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - shadcn/ui (componentes baseados em Radix UI)
  - React Router
  - React Query
  - React Hook Form
  - Zod (validação)
  - Recharts (gráficos)

- **Backend**:
  - Firebase Firestore (banco de dados NoSQL)
  - Firebase Authentication (autenticação)
  - Firebase Hosting (opcional para hospedagem)

## Configuração do Projeto

### Pré-requisitos

- Node.js (v18+)
- npm ou yarn

### Instalação

```sh
# Clonar o repositório
git clone https://github.com/seu-usuario/renovamais-app.git
cd renovamais-app

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Copie o arquivo .env.example para .env e preencha com suas credenciais
cp .env.example .env

# Iniciar o servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
# Firebase
VITE_FIREBASE_API_KEY=sua_api_key_do_firebase
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

## Estrutura do Projeto

```
src/
├── admin/            # Portal do administrador
├── components/       # Componentes compartilhados
├── context/          # Contextos React (auth, notificações, etc.)
├── hooks/            # Hooks personalizados
├── lib/              # Bibliotecas e utilitários
├── pages/            # Páginas principais
├── portal-cliente/   # Portal do cliente
├── portal-geradora/  # Portal da geradora
├── services/         # Serviços de API
└── utils/            # Funções utilitárias
```

## Migração para Firebase

Recentemente, migramos o backend do PlanetScale para o Firebase. Para mais informações sobre essa migração, consulte o documento [FIREBASE_MIGRATION.md](docs/FIREBASE_MIGRATION.md).

Anteriormente, o projeto utilizava o Supabase, depois o PlanetScale. Para informações sobre essas migrações anteriores, consulte:
- [PLANETSCALE_MIGRATION.md](docs/PLANETSCALE_MIGRATION.md)
- [DATABASE_OPTIONS.md](docs/DATABASE_OPTIONS.md)

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run build:dev` - Compila o projeto para ambiente de desenvolvimento
- `npm run preview` - Visualiza a versão compilada localmente
- `npm run lint` - Executa o linter para verificar problemas de código
- `npm run test` - Executa os testes
- `npm run test:watch` - Executa os testes em modo de observação
- `npm run test:coverage` - Executa os testes com relatório de cobertura

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.
