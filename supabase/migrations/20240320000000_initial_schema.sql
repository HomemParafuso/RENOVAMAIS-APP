-- Criação da tabela de usuários
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null unique,
  role text not null check (role in ('admin', 'client', 'generator')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criação da tabela de faturas
create table public.invoices (
  id uuid default gen_random_uuid() primary key,
  number text not null,
  amount numeric(10,2) not null,
  due_date date not null,
  status text not null check (status in ('pending', 'paid', 'overdue')),
  user_id uuid references public.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criação da tabela de notificações
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  message text not null,
  type text not null check (type in ('info', 'success', 'warning', 'error')),
  user_id uuid references public.users on delete cascade not null,
  read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Políticas de segurança (RLS)
alter table public.users enable row level security;
alter table public.invoices enable row level security;
alter table public.notifications enable row level security;

-- Políticas para usuários
create policy "Usuários podem ver seus próprios dados"
  on public.users for select
  using (auth.uid() = id);

create policy "Apenas admins podem ver todos os usuários"
  on public.users for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Políticas para faturas
create policy "Usuários podem ver suas próprias faturas"
  on public.invoices for select
  using (auth.uid() = user_id);

create policy "Usuários podem criar suas próprias faturas"
  on public.invoices for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar suas próprias faturas"
  on public.invoices for update
  using (auth.uid() = user_id);

create policy "Usuários podem deletar suas próprias faturas"
  on public.invoices for delete
  using (auth.uid() = user_id);

-- Políticas para notificações
create policy "Usuários podem ver suas próprias notificações"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Usuários podem criar suas próprias notificações"
  on public.notifications for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar suas próprias notificações"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Usuários podem deletar suas próprias notificações"
  on public.notifications for delete
  using (auth.uid() = user_id); 