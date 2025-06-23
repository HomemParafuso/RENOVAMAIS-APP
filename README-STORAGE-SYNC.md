# Sistema de Armazenamento Local para o RENOVAMAIS-APP

Este documento descreve a estrutura de armazenamento local utilizada pelo RENOVAMAIS-APP para persistir dados de geradoras, clientes, usinas e outros recursos.

## Estrutura de Diretórios

O sistema utiliza uma estrutura de diretórios organizada para armazenar os dados:

```
storage/
├── geradora/
│   ├── [NOME_GERADORA]/
│   │   ├── dados.json                 # Dados da geradora
│   │   ├── clientes.json              # Lista resumida de clientes da geradora
│   │   ├── clientes/
│   │   │   ├── [ID_CLIENTE]/
│   │   │   │   ├── dados.json         # Dados completos do cliente
│   │   │   │   ├── faturas/           # Faturas do cliente
│   │   │   │   │   ├── [ID_FATURA].json
│   │   │   │   ├── configuracoes.json # Configurações específicas do cliente
```

## Funcionamento

### Armazenamento Híbrido

O sistema utiliza uma abordagem híbrida para armazenamento de dados:

1. **localStorage**: Utilizado para acesso rápido aos dados durante a execução da aplicação no navegador.
2. **Arquivos físicos**: Utilizados para persistência de longo prazo e compartilhamento entre diferentes sessões.

### Sincronização

A sincronização entre o localStorage e os arquivos físicos ocorre em momentos específicos:

1. **Inicialização da aplicação**: Os dados são carregados dos arquivos para o localStorage.
2. **Operações de escrita**: Quando um dado é adicionado, atualizado ou removido no localStorage, a alteração é automaticamente sincronizada com os arquivos físicos.

## Módulos Principais

### 1. `init-local-clientes.ts`

Este módulo gerencia o armazenamento e sincronização de clientes:

- `getLocalClientes(geradoraId?)`: Obtém clientes do localStorage para uma geradora específica ou todos os clientes.
- `addLocalCliente(cliente)`: Adiciona um novo cliente ao localStorage e ao arquivo físico.
- `updateLocalCliente(id, updates)`: Atualiza um cliente existente.
- `removeLocalCliente(id, geradoraId?)`: Remove um cliente.
- `syncClientesToFile()`: Sincroniza todos os clientes do localStorage para os arquivos.
- `loadClientesFromFile()`: Carrega clientes dos arquivos para o localStorage.

### 2. `server-storage.js`

Fornece funções para manipulação de arquivos no servidor:

- `ensureDirectoryExists(dirPath)`: Garante que um diretório exista.
- `readJsonFile(filePath)`: Lê um arquivo JSON.
- `writeJsonFile(filePath, data)`: Escreve dados em um arquivo JSON.
- `listFiles(dirPath)`: Lista arquivos em um diretório.
- `fileExists(filePath)`: Verifica se um arquivo existe.
- `removeFile(filePath)`: Remove um arquivo.

## Scripts de Utilidade

### `test-cliente-sync.js`

Script para sincronizar clientes do localStorage para a estrutura de arquivos. Útil para migrar dados existentes para a nova estrutura.

```bash
node test-cliente-sync.js
```

## Fluxo de Dados

1. **Criação de Cliente**:
   - O cliente é adicionado ao localStorage
   - O cliente é salvo em `storage/geradora/[NOME_GERADORA]/clientes/[ID_CLIENTE]/dados.json`
   - A lista resumida em `storage/geradora/[NOME_GERADORA]/clientes.json` é atualizada

2. **Atualização de Cliente**:
   - Os dados são atualizados no localStorage
   - O arquivo `dados.json` do cliente é atualizado
   - A lista resumida é atualizada se necessário

3. **Exclusão de Cliente**:
   - O cliente é removido do localStorage
   - O diretório do cliente é removido
   - A lista resumida é atualizada

## Benefícios da Nova Estrutura

1. **Organização**: Estrutura clara e hierárquica que reflete as relações entre entidades.
2. **Desempenho**: Acesso rápido via localStorage durante a execução.
3. **Persistência**: Dados salvos em arquivos para uso entre sessões.
4. **Isolamento**: Cada geradora tem seu próprio espaço de armazenamento.
5. **Escalabilidade**: Fácil adição de novos tipos de dados ou entidades.

## Considerações para Desenvolvimento

- Sempre use as funções fornecidas pelos módulos para manipular dados, não acesse diretamente o localStorage ou os arquivos.
- Ao adicionar novos tipos de dados, siga o padrão estabelecido para manter a consistência.
- Lembre-se de sincronizar os dados após operações críticas para garantir a persistência.
