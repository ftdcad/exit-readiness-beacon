
-- Ensure RLS is enabled (idempotent)
alter table public.profiles enable row level security;

-- Ensure the updated_at helper exists (matches common pattern and is safe)
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
security definer
set search_path to ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add/refresh a SELECT-own policy without touching admin policies
drop policy if exists "Users can read own profile" on public.profiles;

create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);
