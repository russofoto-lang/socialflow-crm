alter table public.clients
add column if not exists business_description text,
add column if not exists social_links jsonb not null default '[]'::jsonb;

