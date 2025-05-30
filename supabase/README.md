# Configuração do Supabase

Este diretório contém arquivos e instruções para configurar corretamente o Supabase para o aplicativo Renova Mais Energia.

## Problemas de Permissões

Atualmente, estamos enfrentando dois tipos de problemas no Supabase:

### 1. Problemas de Políticas de Segurança (RLS)

Erros comuns relacionados às políticas de segurança (Row Level Security - RLS):
- Erro 406 (Not Acceptable) ao tentar acessar a tabela 'users'
- Erro 403 (Forbidden) ao tentar inserir na tabela 'users'
- Erro "new row violates row-level security policy for table 'users'"

### 2. Problemas de Restrições de Verificação (Check Constraints)

Erros relacionados às restrições de verificação:
- Erro "new row for relation 'users' violates check constraint 'users_role_check'"
- Este erro ocorre quando tentamos inserir um valor inválido para o campo 'role'

## Como Resolver

### Resolver Problemas de Políticas de Segurança (RLS)

Para resolver os problemas de RLS, siga os passos abaixo:

1. Acesse o painel de controle do Supabase em [https://app.supabase.io](https://app.supabase.io)
2. Selecione o projeto "Renova Mais Energia"
3. Vá para a seção "SQL Editor"
4. Abra o arquivo `setup.sql` deste diretório
5. Copie todo o conteúdo do arquivo
6. Cole no editor SQL do Supabase
7. Execute o script

Este script irá configurar as políticas de segurança (RLS) para permitir que qualquer usuário possa:

- Ler todos os registros
- Criar novos registros
- Atualizar registros
- Excluir registros

### Resolver Problemas de Restrições de Verificação (Check Constraints)

Verificamos que a restrição 'users_role_check' já inclui os valores necessários para nossa aplicação:

```sql
CHECK ((role = ANY (ARRAY['admin'::text, 'geradora'::text, 'cliente'::text, 'user'::text])))
```

Isso significa que o campo 'role' já aceita os valores 'admin', 'geradora', 'cliente' e 'user'. O problema não está na restrição em si, mas provavelmente na forma como estamos verificando as permissões.

Para resolver este problema:

1. Execute o script `check_constraints.sql` no SQL Editor do Supabase para verificar as restrições atuais
2. Atualizamos o método `checkSupabasePermissions()` no geradoraService.ts para usar 'admin' como valor para o campo 'role' ao verificar permissões
3. Execute o script `setup.sql` para configurar as políticas de segurança (RLS)

Após executar o script, a aplicação poderá criar registros com role='geradora' sem violar a restrição de verificação, desde que as políticas de segurança estejam configuradas corretamente.

## Verificação

Após executar o script, você pode verificar se as políticas foram aplicadas corretamente:

1. No painel do Supabase, vá para "Authentication" > "Policies"
2. Verifique se as políticas listadas no arquivo `setup.sql` estão presentes para as tabelas 'users' e 'notifications'

## Alternativa: Desativar RLS (Não recomendado para produção)

Se você estiver apenas testando o aplicativo localmente, pode desativar completamente o RLS:

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
```

**Atenção**: Desativar o RLS não é recomendado para ambientes de produção, pois remove todas as proteções de segurança em nível de linha.
