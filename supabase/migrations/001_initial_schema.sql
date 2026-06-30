create extension if not exists "pgcrypto";

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  email text,
  phone text,
  managed_brands text,
  notes text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'client' check (role in ('admin', 'client')),
  client_id uuid references public.clients(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  content_type text not null check (content_type in ('post', 'reel', 'stories', 'carousel')),
  platform text not null check (platform in ('instagram', 'facebook', 'instagram_facebook')),
  copy_text text,
  internal_notes text,
  scheduled_date date,
  status text not null default 'ideas' check (status in ('ideas', 'todo', 'in_progress', 'to_approve', 'published')),
  approval_status text not null default 'not_required' check (approval_status in ('not_required', 'pending', 'approved', 'changes_requested')),
  approved_at timestamptz,
  approved_by uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_files (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.contents(id) on delete cascade,
  file_name text,
  file_path text not null,
  file_type text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.contents(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  comment_text text not null,
  comment_type text not null check (comment_type in ('internal', 'client')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger clients_updated_at before update on public.clients for each row execute function public.set_updated_at();
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger contents_updated_at before update on public.contents for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_user_client_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select client_id from public.profiles where id = auth.uid();
$$;

alter table public.clients enable row level security;
alter table public.profiles enable row level security;
alter table public.contents enable row level security;
alter table public.content_files enable row level security;
alter table public.comments enable row level security;

create policy "admin full profiles" on public.profiles for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
create policy "users read own profile" on public.profiles for select using (id = auth.uid());
create policy "users update own profile name" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "admin full clients" on public.clients for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
create policy "client read own client" on public.clients for select using (id = public.current_user_client_id());

create policy "admin full contents" on public.contents for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
create policy "client read own contents" on public.contents for select using (client_id = public.current_user_client_id());
create policy "client update own approvals" on public.contents for update using (client_id = public.current_user_client_id()) with check (client_id = public.current_user_client_id());

create policy "admin full content files" on public.content_files for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
create policy "client read own content files" on public.content_files for select using (
  exists (
    select 1 from public.contents
    where contents.id = content_files.content_id
      and contents.client_id = public.current_user_client_id()
  )
);

create policy "admin full comments" on public.comments for all using (public.current_user_role() = 'admin') with check (public.current_user_role() = 'admin');
create policy "client read own comments" on public.comments for select using (
  exists (
    select 1 from public.contents
    where contents.id = comments.content_id
      and contents.client_id = public.current_user_client_id()
  )
);
create policy "client insert own comments" on public.comments for insert with check (
  user_id = auth.uid()
  and comment_type = 'client'
  and exists (
    select 1 from public.contents
    where contents.id = comments.content_id
      and contents.client_id = public.current_user_client_id()
  )
);

insert into storage.buckets (id, name, public)
values ('content-files', 'content-files', true)
on conflict (id) do nothing;

create policy "admin uploads content files" on storage.objects for insert with check (
  bucket_id = 'content-files' and public.current_user_role() = 'admin'
);
create policy "read content files" on storage.objects for select using (bucket_id = 'content-files');
create policy "admin updates content files" on storage.objects for update using (
  bucket_id = 'content-files' and public.current_user_role() = 'admin'
) with check (
  bucket_id = 'content-files' and public.current_user_role() = 'admin'
);
create policy "admin deletes content files" on storage.objects for delete using (
  bucket_id = 'content-files' and public.current_user_role() = 'admin'
);
