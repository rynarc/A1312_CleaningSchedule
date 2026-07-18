-- Run this once in your Supabase project's SQL Editor (Project → SQL Editor → New query).
-- Creates the `teams` table that stores the duty rotation and seeds it with
-- the same data that used to live in server/db.json.

create table if not exists teams (
  id bigint generated always as identity primary key,
  name1 text not null,
  name2 text not null,
  position integer not null,
  created_at timestamptz not null default now()
);

-- Row Level Security must be enabled, then explicitly allowed — Supabase
-- blocks all access by default otherwise.
alter table teams enable row level security;

-- NOTE: these policies allow anyone with the public anon key (i.e. anyone
-- who loads the site) to read AND write this table. There is no real
-- server-side auth here — same trust model as the old app, where the
-- Express endpoints had no auth check either and only the frontend
-- prompted for a password. Fine for a small team's duty schedule; do not
-- reuse this pattern for anything sensitive.
create policy "Public read access" on teams
  for select using (true);

create policy "Public insert access" on teams
  for insert with check (true);

create policy "Public update access" on teams
  for update using (true);

create policy "Public delete access" on teams
  for delete using (true);

insert into teams (name1, name2, position) values
  ('Ryan', 'Agung', 1),
  ('Haqi', 'Ferdi', 2),
  ('Fonda', 'Ryan', 3),
  ('Agung', 'Haqi', 4),
  ('Ferdi', 'Fonda', 5);
