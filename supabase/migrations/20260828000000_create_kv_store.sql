create table if not exists public.kv_store_98242bf9 (
  key text primary key,
  value jsonb not null
);

alter table public.kv_store_98242bf9 enable row level security;
