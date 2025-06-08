# Migração para o Firebase

Este documento descreve o processo de migração do banco de dados PlanetScale para o Firebase no projeto Renova Mais Energia.

## Visão Geral

O projeto foi originalmente desenvolvido usando o Supabase como backend, depois migrado para o PlanetScale, e agora está sendo migrado para o Firebase. O Firebase oferece uma solução completa que inclui banco de dados (Firestore), autenticação, armazenamento, hospedagem e muito mais.

## Principais Alterações

1. **Banco de Dados**: Migração do MySQL (PlanetScale) para o Firestore (Firebase)
2. **Autenticação**: Uso do Firebase Authentication em vez do sistema JWT personalizado
3. **API**: Criação de funções de acesso ao banco de dados usando as bibliotecas do Firebase

## Arquivos Criados/Modificados

### Novos Arquivos
- `src/lib/firebase.ts`: Configuração e funções de acesso ao Firebase
- `src/utils/firebaseApi.ts`: API para operações de banco de dados
- `docs/FIREBASE_MIGRATION.md`: Documentação da migração

### Arquivos Modificados
- `src/context/AuthContext.tsx`: Atualizado para usar o Firebase Authentication
- `.env` e `.env.example`: Atualizadas variáveis de ambiente para o Firebase

## Configuração do Firebase

### Pré-requisitos

1. Criar uma conta no Firebase (https://firebase.google.com/)
2. Criar um novo projeto no console do Firebase
3. Adicionar um aplicativo web ao projeto
4. Habilitar o Firestore Database
5. Habilitar o Authentication com email/senha

### Variáveis de Ambiente

As seguintes variáveis de ambiente devem ser configuradas no arquivo `.env`:

```
# Firebase
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

## Estrutura do Banco de Dados

O Firestore é um banco de dados NoSQL orientado a documentos. A estrutura de coleções é a seguinte:

### Coleção `users`
Armazena informações dos usuários:
- `id`: ID do usuário (mesmo ID do Firebase Authentication)
- `email`: Email do usuário
- `name`: Nome do usuário
- `role`: Função do usuário ('admin', 'client', 'geradora')
- `isApproved`: Se o usuário está aprovado
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### Coleção `faturas`
Armazena as faturas dos clientes:
- `id`: ID da fatura
- `userId`: ID do usuário
- `amount`: Valor da fatura
- `dueDate`: Data de vencimento
- `status`: Status da fatura ('pending', 'paid', 'overdue')
- `description`: Descrição da fatura
- `reference`: Referência da fatura
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## Sistema de Autenticação

O sistema de autenticação agora usa o Firebase Authentication, que oferece:

- Registro e login com email/senha
- Integração com provedores sociais (Google, Facebook, etc.)
- Verificação de email
- Recuperação de senha
- Gerenciamento de sessões

## Uso da API

### Exemplo de uso da API de Faturas

```typescript
import { addFatura, getFaturas, getFaturaById, updateFatura, deleteFatura } from '@/utils/firebaseApi';

// Adicionar uma nova fatura
const novaFatura = await addFatura({
  userId: '1',
  amount: 150.00,
  dueDate: new Date('2025-06-10'),
  status: 'pending',
  reference: '06/2025'
});

// Buscar faturas com paginação
const { data: faturas, pagination } = await getFaturas({
  page: 1,
  pageSize: 10,
  orderByField: 'dueDate',
  orderDirection: 'asc'
});

// Buscar fatura por ID
const fatura = await getFaturaById('abc123');

// Atualizar fatura
const atualizado = await updateFatura('abc123', {
  status: 'paid'
});

// Excluir fatura
const excluido = await deleteFatura('abc123');
```

## Regras de Segurança do Firestore

É importante configurar regras de segurança no Firestore para proteger seus dados. Aqui está um exemplo básico:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para a coleção users
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Regras para a coleção faturas
    match /faturas/{faturaId} {
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && (request.resource.data.userId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

## Vantagens do Firebase

1. **Solução completa**: Banco de dados, autenticação, armazenamento, hospedagem, etc.
2. **Escalabilidade**: Escala automaticamente conforme a demanda
3. **Plano gratuito generoso**: Limites altos para projetos em fase inicial
4. **Tempo real**: Suporte nativo para atualizações em tempo real
5. **Integração com Google Cloud**: Acesso a outros serviços do Google Cloud
6. **Segurança**: Regras de segurança declarativas e flexíveis
7. **Offline**: Suporte a operações offline

## Considerações sobre a Migração de Dados

Para migrar dados existentes do PlanetScale para o Firebase, recomenda-se:

1. Exportar os dados do PlanetScale como JSON
2. Transformar os dados para o formato do Firestore
3. Importar os dados para o Firestore usando o Firebase Admin SDK ou ferramentas de importação

## Próximos Passos

- Implementar regras de segurança no Firestore
- Configurar índices para consultas complexas
- Implementar funções Cloud Functions para lógica de backend
- Configurar Firebase Hosting para hospedagem do frontend
- Implementar Firebase Storage para armazenamento de arquivos
