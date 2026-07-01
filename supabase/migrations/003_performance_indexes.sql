create index if not exists idx_contents_client_id on public.contents(client_id);
create index if not exists idx_contents_status on public.contents(status);
create index if not exists idx_contents_scheduled_date on public.contents(scheduled_date);
create index if not exists idx_contents_created_at on public.contents(created_at desc);
create index if not exists idx_clients_status on public.clients(status);
