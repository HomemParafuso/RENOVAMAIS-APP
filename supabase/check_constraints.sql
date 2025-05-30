-- Script para verificar as restrições de verificação (Check Constraints) no Supabase
-- Este script é útil para diagnosticar problemas com restrições de verificação

-- Verificar todas as restrições de verificação no banco de dados
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    cc.check_clause
FROM
    information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.check_constraints AS cc
      ON tc.constraint_name = cc.constraint_name
WHERE
    tc.constraint_type = 'CHECK'
ORDER BY
    tc.table_name,
    kcu.column_name;

-- Verificar especificamente a restrição users_role_check
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    cc.check_clause
FROM
    information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.check_constraints AS cc
      ON tc.constraint_name = cc.constraint_name
WHERE
    tc.constraint_type = 'CHECK'
    AND tc.table_name = 'users'
    AND kcu.column_name = 'role';

-- Verificar se a restrição users_role_check inclui o valor 'user'
SELECT
    CASE
        WHEN check_clause LIKE '%''user''%' THEN 'Sim, a restrição inclui o valor ''user'''
        ELSE 'Não, a restrição não inclui o valor ''user'''
    END AS inclui_user
FROM
    information_schema.check_constraints
WHERE
    constraint_name = 'users_role_check';

-- Verificar os valores atuais do campo role na tabela users
SELECT
    role,
    COUNT(*) as quantidade
FROM
    public.users
GROUP BY
    role
ORDER BY
    role;
