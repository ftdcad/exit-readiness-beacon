
-- 1) Assessment submissions: store entire free assessment
create table if not exists public.assessment_submissions (
  id uuid primary key default gen_random_uuid(),
  email text,
  step_1_8 jsonb not null default '{}'::jsonb,
  step_9 jsonb not null default '{}'::jsonb,
  step_10 jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helpful index for admin/reporting queries
create index if not exists idx_assessment_submissions_email
  on public.assessment_submissions (email);

-- Keep updated_at fresh
drop trigger if exists trg_assessment_submissions_set_timestamp on public.assessment_submissions;
create trigger trg_assessment_submissions_set_timestamp
before update on public.assessment_submissions
for each row execute function public.update_updated_at_column();

-- Enable RLS and add policies
alter table public.assessment_submissions enable row level security;

-- Admins manage everything
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'assessment_submissions' and policyname = 'assessment_submissions admin manage'
  ) then
    create policy "assessment_submissions admin manage"
      on public.assessment_submissions
      as permissive
      for all
      using (is_admin(auth.uid()))
      with check (is_admin(auth.uid()));
  end if;
end $$;

-- Anonymous can insert (public flow)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'assessment_submissions' and policyname = 'assessment_submissions anon insert'
  ) then
    create policy "assessment_submissions anon insert"
      on public.assessment_submissions
      as permissive
      for insert
      with check (true);
  end if;
end $$;

-- Admins can read (avoid public data exposure)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'assessment_submissions' and policyname = 'assessment_submissions admin select'
  ) then
    create policy "assessment_submissions admin select"
      on public.assessment_submissions
      as permissive
      for select
      using (is_admin(auth.uid()));
  end if;
end $$;

-- 2) Consultation requests: separate table referencing submissions
create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references public.assessment_submissions(id) on delete cascade,
  name text,
  email text,
  phone text,
  notes text,
  status text default 'new' check (status in ('new','contacted','scheduled','complete')),
  created_at timestamptz not null default now()
);

-- Enable RLS and add policies
alter table public.consultation_requests enable row level security;

-- Admins manage everything
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'consultation_requests' and policyname = 'consultation_requests admin manage'
  ) then
    create policy "consultation_requests admin manage"
      on public.consultation_requests
      as permissive
      for all
      using (is_admin(auth.uid()))
      with check (is_admin(auth.uid()));
  end if;
end $$;

-- Anonymous can insert (public flow)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'consultation_requests' and policyname = 'consultation_requests anon insert'
  ) then
    create policy "consultation_requests anon insert"
      on public.consultation_requests
      as permissive
      for insert
      with check (true);
  end if;
end $$;
