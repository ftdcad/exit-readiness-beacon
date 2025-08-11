
-- 1) Ensure 'client' role exists
insert into public.user_roles (name)
select 'client'
where not exists (select 1 from public.user_roles where name = 'client');

-- 2) Add optional phone/website to profiles (keeps existing schema with role_id)
alter table public.profiles
  add column if not exists phone text,
  add column if not exists website text;

-- Partial unique on phone (only when present)
drop index if exists profiles_phone_key;
create unique index if not exists profiles_phone_unique
  on public.profiles (phone)
  where phone is not null;

-- 3) Safety-net RPC to ensure a profile row exists for the current user
create or replace function public.ensure_profile()
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_email text;
  v_client_role uuid;
begin
  -- Fetch email and client role id
  select u.email into v_email
  from auth.users u
  where u.id = auth.uid();

  select ur.id into v_client_role
  from public.user_roles ur
  where ur.name = 'client'
  limit 1;

  -- Create profile if missing (id, email, role_id)
  insert into public.profiles (id, email, role_id)
  values (auth.uid(), v_email, v_client_role)
  on conflict (id) do nothing;
end;
$$;

grant execute on function public.ensure_profile() to authenticated;

-- 4) Trigger to auto-create profile at signup (uses existing role_id/roles)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_client_role uuid;
begin
  select ur.id into v_client_role
  from public.user_roles ur
  where ur.name = 'client'
  limit 1;

  insert into public.profiles (id, email, role_id)
  values (new.id, new.email, v_client_role)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5) Backfill profiles for existing users (id, email, role_id)
with client_role as (
  select id from public.user_roles where name = 'client' limit 1
)
insert into public.profiles (id, email, role_id)
select u.id, u.email, (select id from client_role)
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- 6) Keep updated_at fresh on updates to profiles
drop trigger if exists set_updated_at_on_profiles on public.profiles;
create trigger set_updated_at_on_profiles
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();
