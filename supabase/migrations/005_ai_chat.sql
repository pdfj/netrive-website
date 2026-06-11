-- AI chatbot conversation logs (per project when the visitor is a logged-in client).
-- Run in Supabase: SQL Editor > New query > paste > Run.

create table if not exists ai_chat_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'note')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_chat_logs_project_idx on ai_chat_logs(project_id, created_at);

-- RLS on; only the service role (chat API + admin page) reads/writes.
alter table ai_chat_logs enable row level security;
