-- Installment plan on invoices.
-- NULL = pay in full; 3 or 6 = number of monthly installments.
-- Run in Supabase: SQL Editor > New query > paste > Run
alter table projects add column if not exists invoice_installments int;
