-- Fix: "Database error deleting user" when removing a client.
-- Cause: messages.sender_id and project_updates.created_by referenced
-- profiles(id) WITHOUT on-delete-cascade, so deleting a client whose
-- project had chat messages/updates hit a foreign-key RESTRICT.
-- Run in Supabase: SQL Editor > New query > paste > Run.

alter table messages
  drop constraint if exists messages_sender_id_fkey,
  add constraint messages_sender_id_fkey
    foreign key (sender_id) references profiles(id) on delete cascade;

alter table project_updates
  drop constraint if exists project_updates_created_by_fkey,
  add constraint project_updates_created_by_fkey
    foreign key (created_by) references profiles(id) on delete cascade;
