alter table public.clients
add column if not exists website text,
add column if not exists contacts jsonb not null default '[]'::jsonb;

