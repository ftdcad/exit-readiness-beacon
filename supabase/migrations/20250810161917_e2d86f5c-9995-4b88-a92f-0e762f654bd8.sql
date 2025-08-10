
-- Ensure helper fxn exists first (idempotent re-create is fine)
create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    join public.user_roles r on p.role_id = r.id
    where p.id = user_id and r.name = 'admin'
  );
$$;

-- 1) Knowledge base snippets (admin-managed; readable only by authenticated users)
create table if not exists public.kb_snippets (
  id uuid primary key default gen_random_uuid(),
  module text not null,                 -- e.g. '/portal/week-2/data-room'
  tags text[] default '{}',             -- e.g. '{ebitda,deal-room}'
  question text not null,
  answer text not null,                 -- keep ≤ 400 chars by convention
  link text,                            -- internal route like '/portal/week-2/data-room'
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.kb_snippets enable row level security;

-- Only signed-in users can read curated KB; only admins can modify
drop policy if exists "KB public readable" on public.kb_snippets;
create policy "KB readable (auth only)"
  on public.kb_snippets for select
  using (auth.uid() is not null and is_active);

create policy "KB admin manage"
  on public.kb_snippets for all
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- 2) AI settings (per-org; MVP maps org to profiles.id)
create table if not exists public.ai_settings (
  org_id uuid primary key references public.profiles(id) on delete cascade,
  enabled boolean not null default false,
  daily_user_limit int not null default 10,
  monthly_org_cap int not null default 1000,
  created_at timestamptz default now()
);

alter table public.ai_settings enable row level security;

create policy "AI settings read own"
  on public.ai_settings for select
  using (org_id = auth.uid());

create policy "AI settings admin manage"
  on public.ai_settings for all
  using (is_admin(auth.uid()))
  with check (is_admin(auth.uid()));

-- 3) AI query logs
create table if not exists public.ai_queries (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.profiles(id) on delete cascade,
  user_id uuid not null,
  module text,
  question text not null,
  used_snippet_ids uuid[],              -- optional (no FK so empty is fine)
  answer text not null,
  created_at timestamptz default now()
);

create index if not exists ai_queries_user_day_idx
  on public.ai_queries (user_id, created_at);

create index if not exists ai_queries_org_month_idx
  on public.ai_queries (org_id, created_at);

alter table public.ai_queries enable row level security;

create policy "AI queries insert own"
  on public.ai_queries for insert
  with check (user_id = auth.uid() and org_id = auth.uid());

create policy "AI queries select own"
  on public.ai_queries for select
  using (user_id = auth.uid());

create policy "AI queries admin select all"
  on public.ai_queries for select
  using (is_admin(auth.uid()));
