-- TABLA DE BALANCES
create table balances (
  id uuid default gen_random_uuid() primary key,
  month date not null,
  category text not null,
  amount numeric not null default 0,
  created_at timestamp with time zone default now(),
  unique(month, category)
);

-- TABLA DE METAS
create table goals (
  id uuid default gen_random_uuid() primary key,
  target_amount numeric not null default 300000,
  target_date date not null default '2027-12-01',
  created_at timestamp with time zone default now()
);

-- HABILITAR RLS (Seguridad de Nivel de Fila)
alter table balances enable row level security;
alter table goals enable row level security;

-- POLÍTICAS PÚBLICAS (Para demo/uso personal simple)
create policy "Acceso total balances" on balances for all using (true) with check (true);
create policy "Acceso total goals" on goals for all using (true) with check (true);
