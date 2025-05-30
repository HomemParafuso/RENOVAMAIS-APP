-- Script de configuração do Supabase para o aplicativo Renova Mais Energia
-- Este script cria as tabelas necessárias e configura as políticas de segurança (RLS)

-- Habilitar a extensão uuid-ossp se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Habilitar a extensão pgcrypto se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Remover tabelas existentes se necessário (comentar estas linhas se não quiser remover as tabelas)
DROP TABLE IF EXISTS public.notifications;
DROP TABLE IF EXISTS public.invoices;
DROP TABLE IF EXISTS public.registration_requests;
DROP TABLE IF EXISTS public.users;

-- Create users table with role hierarchy
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'geradora', 'cliente', 'user')),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES public.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    parent_id UUID REFERENCES public.users(id) -- Para relacionar cliente -> geradora -> admin
);

-- Create registration requests table
CREATE TABLE public.registration_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('geradora', 'cliente', 'user')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_by UUID REFERENCES public.users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Create invoices table
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
INSERT INTO public.users (email, password_hash, role, name, is_approved)
VALUES ('pabllo.tca@gmail.com', crypt('admin123', gen_salt('bf')), 'admin', 'Administrador', TRUE);

-- Desativar temporariamente RLS para configuração
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_requests DISABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para a tabela users
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Geradoras can view their clients" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Admin can update all users" ON public.users;
DROP POLICY IF EXISTS "Geradoras can update their clients" ON public.users;
DROP POLICY IF EXISTS "Admin can insert users" ON public.users;
DROP POLICY IF EXISTS "Geradoras can insert clients" ON public.users;
DROP POLICY IF EXISTS "Admin can delete users" ON public.users;
DROP POLICY IF EXISTS "Geradoras can delete their clients" ON public.users;
DROP POLICY IF EXISTS "Anyone can insert users" ON public.users;
DROP POLICY IF EXISTS "Anyone can view users" ON public.users;
DROP POLICY IF EXISTS "Anyone can update users" ON public.users;
DROP POLICY IF EXISTS "Anyone can delete users" ON public.users;

-- Remover políticas existentes para a tabela notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin can view all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Authenticated users can insert their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Anyone can insert registration request notifications" ON public.notifications;
DROP POLICY IF EXISTS "Anyone can view notifications" ON public.notifications;
DROP POLICY IF EXISTS "Anyone can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Anyone can update notifications" ON public.notifications;
DROP POLICY IF EXISTS "Anyone can delete notifications" ON public.notifications;

-- Remover políticas existentes para a tabela invoices
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admin can view all invoices" ON public.invoices;
DROP POLICY IF EXISTS "Geradoras can view their clients' invoices" ON public.invoices;
DROP POLICY IF EXISTS "Anyone can view invoices" ON public.invoices;
DROP POLICY IF EXISTS "Anyone can insert invoices" ON public.invoices;
DROP POLICY IF EXISTS "Anyone can update invoices" ON public.invoices;
DROP POLICY IF EXISTS "Anyone can delete invoices" ON public.invoices;

-- Remover políticas existentes para a tabela registration_requests
DROP POLICY IF EXISTS "Anyone can create registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Admin can view all registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Anyone can view registration_requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Anyone can insert registration_requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Anyone can update registration_requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Anyone can delete registration_requests" ON public.registration_requests;

-- Reativar RLS para as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;

-- Criar políticas permissivas para a tabela users
CREATE POLICY "Anyone can view users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON public.users FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete users" ON public.users FOR DELETE USING (true);

-- Criar políticas permissivas para a tabela notifications
CREATE POLICY "Anyone can view notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Anyone can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update notifications" ON public.notifications FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete notifications" ON public.notifications FOR DELETE USING (true);

-- Criar políticas permissivas para a tabela invoices
CREATE POLICY "Anyone can view invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Anyone can insert invoices" ON public.invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update invoices" ON public.invoices FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete invoices" ON public.invoices FOR DELETE USING (true);

-- Criar políticas permissivas para a tabela registration_requests
CREATE POLICY "Anyone can view registration_requests" ON public.registration_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can insert registration_requests" ON public.registration_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update registration_requests" ON public.registration_requests FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete registration_requests" ON public.registration_requests FOR DELETE USING (true);

-- Verificar se a restrição users_role_check inclui todos os valores necessários
-- Se necessário, alterar a restrição para incluir 'user'
DO $$
DECLARE
    constraint_exists boolean;
    constraint_includes_user boolean;
BEGIN
    -- Verificar se a restrição existe e inclui 'user'
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.check_constraints
        WHERE constraint_name = 'users_role_check'
        AND check_clause LIKE '%''user''%'
    ) INTO constraint_includes_user;
    
    -- Se a restrição não incluir 'user', alterá-la
    IF NOT constraint_includes_user THEN
        -- Remover a restrição existente
        ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
        
        -- Adicionar a nova restrição com 'user'
        ALTER TABLE public.users ADD CONSTRAINT users_role_check 
            CHECK (role IN ('admin', 'geradora', 'cliente', 'user'));
            
        RAISE NOTICE 'Restrição users_role_check atualizada para incluir ''user''';
    ELSE
        RAISE NOTICE 'Restrição users_role_check já inclui ''user''';
    END IF;
END $$;

-- Confirmar que as políticas foram aplicadas
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM
    pg_policies
WHERE
    schemaname = 'public'
    AND (tablename = 'users' OR tablename = 'notifications' OR tablename = 'invoices' OR tablename = 'registration_requests')
ORDER BY
    tablename, policyname;
