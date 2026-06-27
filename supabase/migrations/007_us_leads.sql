-- Run this entire file in your Supabase SQL editor
-- supabase.com > SQL Editor > New query
--
-- 007 — US lead capture (/us "free website preview" form).
-- Additive and non-destructive: creates a brand-new `leads` table.
-- Nothing here touches `profiles`, `projects`, or any existing data/flow.

-- ─────────────────────────────────────────────
-- TABLE
-- ─────────────────────────────────────────────

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  market text not null default 'US',              -- US | SA (tag for filtering)
  business_name text,
  service_type text,                              -- Plumbing / HVAC / ... from the dropdown
  contact_name text not null,
  email text not null,
  phone text,
  message text,
  status text not null default 'new'
    check (status in ('new','preview_built','sent','call_booked','paid','live')),
  admin_notes text,
  source text default '/us',                       -- where the lead came from
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_idx on leads(status);
create index if not exists leads_market_idx on leads(market);
create index if not exists leads_created_at_idx on leads(created_at desc);

-- Reuse the shared updated_at trigger function from 001_initial.sql
drop trigger if exists leads_updated_at on leads;
create trigger leads_updated_at before update on leads
  for each row execute function update_updated_at_column();

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- (Admin dashboard reads via the service-role key, which bypasses RLS.
--  These policies just make the table safe if ever queried with a user key.)
-- ─────────────────────────────────────────────

alter table leads enable row level security;

drop policy if exists "Admins can view leads" on leads;
create policy "Admins can view leads" on leads
  for select using (is_admin());

drop policy if exists "Admins can update leads" on leads;
create policy "Admins can update leads" on leads
  for update using (is_admin());

drop policy if exists "Service role can insert leads" on leads;
create policy "Service role can insert leads" on leads
  for insert with check (true);
