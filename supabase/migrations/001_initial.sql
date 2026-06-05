-- Run this entire file in your Supabase SQL editor
-- supabase.com > SQL Editor > New query

-- ─────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  business_name text,
  phone text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  package text,
  status text not null default 'submitted'
    check (status in ('submitted', 'in_review', 'in_progress', 'review', 'completed', 'cancelled')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  message text not null,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  content text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────

create index if not exists projects_client_id_idx on projects(client_id);
create index if not exists projects_status_idx on projects(status);
create index if not exists project_updates_project_id_idx on project_updates(project_id);
create index if not exists messages_project_id_idx on messages(project_id);
create index if not exists messages_sender_id_idx on messages(sender_id);

-- ─────────────────────────────────────────────
-- AUTO updated_at TRIGGER
-- ─────────────────────────────────────────────

create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at_column();

drop trigger if exists projects_updated_at on projects;
create trigger projects_updated_at before update on projects
  for each row execute function update_updated_at_column();

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

alter table profiles enable row level security;
alter table projects enable row level security;
alter table project_updates enable row level security;
alter table messages enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean language sql security definer as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id or is_admin());

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

drop policy if exists "Service role can insert profiles" on profiles;
create policy "Service role can insert profiles" on profiles
  for insert with check (true);

-- projects
drop policy if exists "Clients can view own projects" on projects;
create policy "Clients can view own projects" on projects
  for select using (auth.uid() = client_id or is_admin());

drop policy if exists "Admins can update projects" on projects;
create policy "Admins can update projects" on projects
  for update using (is_admin());

drop policy if exists "Service role can insert projects" on projects;
create policy "Service role can insert projects" on projects
  for insert with check (true);

-- project_updates
drop policy if exists "View updates for own projects" on project_updates;
create policy "View updates for own projects" on project_updates
  for select using (
    exists (select 1 from projects where id = project_id and client_id = auth.uid())
    or is_admin()
  );

drop policy if exists "Admins can insert updates" on project_updates;
create policy "Admins can insert updates" on project_updates
  for insert with check (is_admin());

-- messages
drop policy if exists "View messages for own projects" on messages;
create policy "View messages for own projects" on messages
  for select using (
    exists (select 1 from projects where id = project_id and client_id = auth.uid())
    or is_admin()
  );

drop policy if exists "Send messages" on messages;
create policy "Send messages" on messages
  for insert with check (
    auth.uid() = sender_id
    and (
      exists (select 1 from projects where id = project_id and client_id = auth.uid())
      or is_admin()
    )
  );

drop policy if exists "Mark messages as read" on messages;
create policy "Mark messages as read" on messages
  for update using (
    exists (select 1 from projects where id = project_id and client_id = auth.uid())
    or is_admin()
  );
