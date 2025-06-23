# RENOVAMAIS-APP

Aplicativo para gerenciamento de geradoras, usinas e clientes do sistema RENOVAMAIS.

## Sistema de Armazenamento Local

O RENOVAMAIS-APP utiliza um sistema de armazenamento local baseado em arquivos JSON para persistência de dados. Este sistema permite o funcionamento offline e sincronização quando conectado.

### Estrutura de Armazenamento

```
storage/
├── clientes/                  # Estrutura antiga (legado)
│   └── clientes.json          # Lista de clientes no formato antigo
├── geradora/                  # Nova estrutura
│   ├── [NOME_GERADORA]/       # Pasta para cada geradora
│   │   ├── dados.json         # Dados da geradora
│   │   ├── clientes.json      # Lista resumida de clientes da geradora
│   │   ├── usinas.json        # Lista resumida de usinas da geradora
│   │   ├── clientes/          # Pasta com dados detalhados dos clientes
│   │   │   └── [ID_CLIENTE]/  # Pasta para cada cliente
│   │   │       └── dados.json # Dados detalhados do cliente
│   │   └── usinas/            # Pasta com dados detalhados das usinas
│   │       └── [ID_USINA]/    # Pasta para cada usina
│   │           └── dados.json # Dados detalhados da usina
│   └── [NOME_GERADORA2]/      # Outra geradora...
└── geradoras.json             # Lista de todas as geradoras
```

### Componentes do Sistema

1. **Módulos de Armazenamento**:
   - `src/lib/server-storage.js`: Funções para manipulação de arquivos no servidor
   - `src/lib/local-storage-fallback.js`: Implementação de localStorage para ambiente Node.js
   - `src/lib/init-local-clientes.ts`: Inicialização e sincronização de clientes
   - `src/lib/init-local-geradoras.ts`: Inicialização e sincronização de geradoras
   - `src/lib/init-local-usinas.ts`: Inicialização e sincronização de usinas

2. **Componentes React**:
   - `src/components/ClienteSyncInitializer.tsx`: Inicializa a sincronização de clientes
   - `src/components/UsinaSyncInitializer.tsx`: Inicializa a sincronização de usinas

3. **Serviços**:
   - `src/services/clienteService.ts`: Serviço para operações com clientes
   - `src/services/geradoraService.ts`: Serviço para operações com geradoras
   - `src/services/usinaService.ts`: Serviço para operações com usinas
   - `src/services/syncService.ts`: Serviço para sincronização de dados

## Scripts Utilitários

### Migração de Dados

O script `migrate-clientes.js` migra os dados da estrutura antiga para a nova estrutura:

```bash
node migrate-clientes.js
```

Este script:
1. Carrega os clientes da estrutura antiga (`storage/clientes/clientes.json`)
2. Carrega ou cria geradoras
3. Migra os clientes para a nova estrutura, organizando-os por geradora
4. Cria a estrutura de diretórios necessária

### Inicialização com Migração

O script `start-with-migration.js` executa a migração de dados (se necessário) e inicia o servidor:

```bash
node start-with-migration.js
```

Este script:
1. Verifica se a migração já foi executada
2. Executa a migração se necessário
3. Inicia o servidor da aplicação

### Upload para GitHub

O script `upload-to-github.js` facilita o envio das alterações para o repositório GitHub:

```bash
node upload-to-github.js
```

Este script:
1. Verifica se o Git está instalado
2. Inicializa um repositório Git se necessário
3. Configura o remote para o repositório RENOVAMAIS-APP
4. Adiciona arquivos, faz commit e envia para o GitHub
5. Gerencia autenticação com token se necessário

## Desenvolvimento

### Requisitos

- Node.js (versão recomendada: 18.x ou superior)
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o servidor com migração automática
node start-with-migration.js
```

### Fluxo de Trabalho

1. Os dados são carregados dos arquivos JSON para o localStorage durante a inicialização
2. As operações são realizadas no localStorage para melhor desempenho
3. As alterações são sincronizadas com os arquivos JSON para persistência
4. A sincronização ocorre automaticamente após cada operação

## Contribuição

Para contribuir com o projeto:

1. Faça as alterações necessárias
2. Execute o script de upload para GitHub:
   ```bash
   node upload-to-github.js
   ```
3. Siga as instruções para adicionar arquivos, fazer commit e enviar para o GitHub
