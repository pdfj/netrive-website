-- Branded preview links: netrive.com/preview/<slug> wraps a real demo URL.
-- Run in Supabase: SQL Editor > New query > paste > Run.

create table if not exists previews (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text,
  target_url text not null,
  client_label text,
  project_id uuid references projects(id) on delete set null,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists previews_slug_idx on previews(slug);

-- RLS on; only the service-role (admin API + server preview page) touches this table.
alter table previews enable row level security;
