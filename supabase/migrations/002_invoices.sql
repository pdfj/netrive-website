-- Invoice fields on projects (one invoice per project)
-- Run this in Supabase: SQL Editor > New query > paste > Run

alter table projects add column if not exists invoice_amount numeric;
alter table projects add column if not exists invoice_monthly numeric;
alter table projects add column if not exists invoice_status text not null default 'none';
alter table projects add column if not exists invoice_issued_at timestamptz;
alter table projects add column if not exists invoice_paid_claimed_at timestamptz;
alter table projects add column if not exists invoice_confirmed_at timestamptz;

-- invoice_status values: 'none' | 'issued' | 'client_paid' | 'confirmed'
