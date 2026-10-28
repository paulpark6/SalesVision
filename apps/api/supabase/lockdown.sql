-- Supabase lockdown. Run as `postgres` after every `alembic upgrade head` (idempotent).
--   * Supabase's public API roles (anon, authenticated) get no access to app data.
--   * The FastAPI backend connects as `app_api`: read/write rows only, no schema changes.
--   * You (postgres) keep full control; migrations run as postgres.
--   * Every insert/update/delete is written to audit.log, which app_api cannot read or edit.
-- After the first run, set the API password once:  alter role app_api with password '...';

do $$ begin
  if not exists (select from pg_roles where rolname = 'app_api') then
    create role app_api login noinherit;
  end if;
end $$;

-- Supabase API roles (anon, authenticated, service_role): no create, no default grants on future objects.
-- service_role is included so a leaked service key can't edit data through Supabase's REST API either.
do $$ declare r text; begin
  for r in select rolname from pg_roles where rolname in ('anon', 'authenticated', 'service_role') loop
    execute format('revoke create on schema public from %I', r);
    execute format('alter default privileges for role postgres in schema public revoke all on tables from %I', r);
    execute format('alter default privileges for role postgres in schema public revoke all on sequences from %I', r);
    execute format('alter default privileges for role postgres in schema public revoke all on functions from %I', r);
  end loop;
end $$;
revoke create on schema public from public, app_api;
grant usage on schema public to app_api;

-- Audit trail
create schema if not exists audit;
revoke all on schema audit from public, app_api;

create table if not exists audit.log (
  id         bigserial primary key,
  at         timestamptz not null default now(),
  db_user    text not null,          -- who connected: app_api = the web app, postgres = you
  app_user   text,                   -- signed-in app user's email (set by the API per request)
  table_name text not null,
  op         text not null,
  old_row    jsonb,
  new_row    jsonb
);

create or replace function audit.log_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into audit.log (db_user, app_user, table_name, op, old_row, new_row)
  values (session_user, current_setting('app.user_email', true), tg_table_name, tg_op,
          case when tg_op <> 'INSERT' then to_jsonb(old) end,
          case when tg_op <> 'DELETE' then to_jsonb(new) end);
  return null;
end $$;
revoke all on function audit.log_change() from public, app_api;

-- Per-table: RLS on, public API roles out, app_api rows-only, audit trigger
do $$ declare t text; r text; begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from public, app_api', t);
    for r in select rolname from pg_roles where rolname in ('anon', 'authenticated', 'service_role') loop
      execute format('revoke all on public.%I from %I', t, r);
    end loop;
    continue when t = 'alembic_version';  -- only you/migrations touch this
    execute format('grant select, insert, update, delete on public.%I to app_api', t);
    execute format('drop policy if exists app_api_all on public.%I', t);
    execute format('create policy app_api_all on public.%I to app_api using (true) with check (true)', t);
    execute format('drop trigger if exists audit_row on public.%I', t);
    execute format('create trigger audit_row after insert or update or delete on public.%I '
                   'for each row execute function audit.log_change()', t);
  end loop;
end $$;

do $$ declare r text; begin
  for r in select rolname from pg_roles where rolname in ('anon', 'authenticated', 'service_role') loop
    execute format('revoke all on all sequences in schema public from %I', r);
  end loop;
end $$;
grant usage, select on all sequences in schema public to app_api;
