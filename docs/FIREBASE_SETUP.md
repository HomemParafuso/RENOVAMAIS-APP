# Configuração do Firebase para o Renova Mais Energia APP

Este guia fornece instruções passo a passo para configurar o Firebase no projeto Renova Mais Energia APP.

## Pré-requisitos

- Conta no Google
- Node.js e npm instalados

## 1. Criar um Projeto no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Dê um nome ao projeto (ex: "Renova Mais Energia")
4. Opcionalmente, configure o Google Analytics
5. Clique em "Criar projeto"

## 2. Adicionar um Aplicativo Web

1. No console do Firebase, na página inicial do projeto, você verá uma seção "Comece adicionando o Firebase ao seu aplicativo"
2. Clique no botão "Web" (pode aparecer como um ícone `</>` ou simplesmente como "Web")
3. Se não encontrar essa opção na página inicial, vá para "Configurações do projeto" (ícone de engrenagem no menu lateral) > "Geral" > role para baixo até "Seus aplicativos" > "Adicionar aplicativo" > selecione o ícone da Web
4. Dê um nome ao aplicativo (ex: "Renova Mais Web")
5. Opcionalmente, marque "Também configurar o Firebase Hosting para este app"
6. Clique em "Registrar app"
7. Copie as configurações do Firebase que serão exibidas (objeto `firebaseConfig` com apiKey, authDomain, etc.)

## 3. Configurar Variáveis de Ambiente

1. Crie ou edite o arquivo `.env` na raiz do projeto
2. Adicione as seguintes variáveis com os valores das configurações copiadas:

```
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

## 4. Habilitar o Firestore Database

1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Selecione "Iniciar no modo de produção" ou "Iniciar no modo de teste" (recomendado para desenvolvimento)
4. Selecione a região mais próxima de seus usuários (ex: `southamerica-east1` para São Paulo)
5. Clique em "Habilitar"

## 5. Configurar Regras de Segurança do Firestore

1. No console do Firebase, vá para "Firestore Database" > "Regras"
2. Copie o conteúdo do arquivo `firestore.rules` do projeto
3. Cole no editor de regras
4. Clique em "Publicar"

## 6. Habilitar o Firebase Authentication

1. No console do Firebase, vá para "Authentication"
2. Clique em "Começar"
3. Na aba "Sign-in method", habilite o provedor "Email/senha"
4. Opcionalmente, habilite outros provedores como Google, Facebook, etc.
5. Clique em "Salvar"

## 7. Configurar o Firebase Admin SDK (para scripts de inicialização)

1. No console do Firebase, vá para "Configurações do projeto" > "Contas de serviço"
2. Clique em "Gerar nova chave privada"
3. Salve o arquivo JSON na raiz do projeto como `serviceAccountKey.json`
4. **IMPORTANTE**: Adicione este arquivo ao `.gitignore` para não compartilhar suas credenciais

## 8. Inicializar o Banco de Dados com Dados de Exemplo

1. Instale as dependências necessárias:
   ```
   npm install firebase-admin
   ```

2. Execute o script de inicialização:
   ```
   node scripts/firebase-init-data.js
   ```

## 9. Executar o Projeto

1. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

2. Acesse o aplicativo no navegador (geralmente em `http://localhost:5173`)

## 10. Configurar o Firebase Hosting (opcional)

1. Instale a Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Faça login no Firebase:
   ```
   firebase login
   ```

3. Inicialize o Firebase no projeto:
   ```
   firebase init
   ```
   - Selecione "Hosting"
   - Selecione seu projeto Firebase
   - Defina "dist" como diretório público (para projetos Vite)
   - Configure como SPA (Single Page App)

4. Compile o projeto:
   ```
   npm run build
   ```

5. Implante no Firebase Hosting:
   ```
   firebase deploy
   ```

## Estrutura do Banco de Dados

O Firestore é um banco de dados NoSQL orientado a documentos. A estrutura de coleções é a seguinte:

### Coleção `users`
- Armazena informações dos usuários
- Cada documento tem o mesmo ID do usuário no Firebase Authentication

### Coleção `faturas`
- Armazena as faturas dos clientes
- Cada documento contém um campo `userId` que referencia o usuário

### Coleção `configuracoes`
- Armazena configurações do sistema
- Documento `sistema` contém configurações globais

### Coleção `geradora_cliente`
- Armazena relacionamentos entre geradoras e clientes

## Solução de Problemas

### Erro de Autenticação

Se encontrar erros de autenticação:
1. Verifique se as variáveis de ambiente estão configuradas corretamente
2. Verifique se o provedor de autenticação está habilitado no console do Firebase
3. Limpe os cookies e o armazenamento local do navegador

### Erro de Acesso ao Firestore

Se encontrar erros ao acessar o Firestore:
1. Verifique se o banco de dados foi criado corretamente
2. Verifique se as regras de segurança estão configuradas corretamente
3. Verifique se o usuário tem as permissões necessárias

### Erro no Script de Inicialização

Se encontrar erros ao executar o script de inicialização:
1. Verifique se o arquivo `serviceAccountKey.json` está na raiz do projeto
2. Verifique se as dependências foram instaladas corretamente
3. Verifique se o projeto e o banco de dados foram criados no console do Firebase
