-- Phase 1: Critical DB security fixes

-- 1) Enable RLS on all relevant public tables
alter table if exists public.activity_log enable row level security;
alter table if exists public.add_back_categories enable row level security;
alter table if exists public.assessment_access enable row level security;
alter table if exists public.assessment_sessions enable row level security;
alter table if exists public.buyer_analysis enable row level security;
alter table if exists public.client_progress enable row level security;
alter table if exists public.client_scenarios enable row level security;
alter table if exists public.company_comments enable row level security;
alter table if exists public.company_industry_profile enable row level security;
alter table if exists public.contact_inquiries enable row level security;
alter table if exists public.data_room_documents enable row level security;
alter table if exists public.data_room_progress enable row level security;
alter table if exists public.data_room_readiness enable row level security;
alter table if exists public.data_room_structure enable row level security;
alter table if exists public.exit_readiness_assessments enable row level security;
alter table if exists public.financial_assessments enable row level security;
alter table if exists public.industry_benchmarks enable row level security;
alter table if exists public.industry_multiples enable row level security;
alter table if exists public.kpi_metrics enable row level security;
alter table if exists public.nda_records enable row level security;
alter table if exists public.okr_key_results enable row level security;
alter table if exists public.profiles enable row level security;
alter table if exists public.quick_wins_progress enable row level security;
alter table if exists public.strategy_documents enable row level security;
alter table if exists public.user_financial_data enable row level security;
alter table if exists public.user_roles enable row level security;
alter table if exists public.valuation_exports enable row level security;

-- 2) Tighten policy roles (make policies explicit)
-- Note: Where anonymous access is intended (public forms), keep TO public.

-- activity_log
alter policy "Admins can insert activity log" on public.activity_log to authenticated;
alter policy "Admins can view activity log" on public.activity_log to authenticated;

-- add_back_categories
alter policy "Admins can manage add-back categories" on public.add_back_categories to authenticated;

-- assessment_access
alter policy "Admins can manage assessment access" on public.assessment_access to authenticated;
alter policy "Public can insert assessment access" on public.assessment_access to public;

-- assessment_sessions
alter policy "Admins can manage assessment sessions" on public.assessment_sessions to authenticated;

-- buyer_analysis
alter policy "Users can manage own buyer analysis" on public.buyer_analysis to authenticated;

-- client_progress
alter policy "Admins can view all client progress" on public.client_progress to authenticated;
alter policy "Clients can mark completion" on public.client_progress to authenticated;
alter policy "Clients can update own progress" on public.client_progress to authenticated;
alter policy "Clients can view own progress" on public.client_progress to authenticated;

-- client_scenarios
alter policy "Admins can view all scenarios" on public.client_scenarios to authenticated;
alter policy "Clients can manage own scenarios" on public.client_scenarios to authenticated;

-- company_comments
alter policy "Admins can insert comments" on public.company_comments to authenticated;
alter policy "Admins can update comments" on public.company_comments to authenticated;
alter policy "Admins can view comments" on public.company_comments to authenticated;

-- company_industry_profile
alter policy "Users manage own company profiles" on public.company_industry_profile to authenticated;

-- contact_inquiries
alter policy "Admins can update inquiries" on public.contact_inquiries to authenticated;
alter policy "Admins can view all inquiries" on public.contact_inquiries to authenticated;
alter policy contact_inquiries_anonymous_insert on public.contact_inquiries to public;

-- data_room_documents
alter policy "Users manage own documents" on public.data_room_documents to authenticated;

-- data_room_progress
alter policy "Users view own progress" on public.data_room_progress to authenticated;

-- data_room_readiness
alter policy "Users view own readiness" on public.data_room_readiness to authenticated;

-- data_room_structure
alter policy "Users create custom structure" on public.data_room_structure to authenticated;
alter policy "Users delete own structure" on public.data_room_structure to authenticated;
alter policy "Users update own structure" on public.data_room_structure to authenticated;
alter policy "Users view structure" on public.data_room_structure to authenticated;

-- exit_readiness_assessments
alter policy "Users can manage own assessments" on public.exit_readiness_assessments to authenticated;

-- financial_assessments
alter policy "Admins can manage financial assessments" on public.financial_assessments to authenticated;

-- industry_benchmarks
alter policy "Admins can manage industry benchmarks" on public.industry_benchmarks to authenticated;
alter policy "Admins can view industry benchmarks" on public.industry_benchmarks to authenticated;

-- industry_multiples (intentionally public SELECT)
-- keep policy as-is: "Industry multiples are public" (TO public) with USING (true)

-- kpi_metrics
alter policy "Users manage own KPIs" on public.kpi_metrics to authenticated;

-- nda_records
-- tighten read from "any authenticated" to admin-only
drop policy if exists "Enable read access for authenticated users" on public.nda_records;
create policy "Admins can view NDA records"
  on public.nda_records
  for select
  to authenticated
  using (is_admin(auth.uid()));
-- keep anonymous insert
alter policy "Enable insert access for anonymous users" on public.nda_records to public;

-- okr_key_results
alter policy "Users manage own key results" on public.okr_key_results to authenticated;

-- profiles
alter policy "Admins can insert profiles" on public.profiles to authenticated;
alter policy "Admins can update profiles" on public.profiles to authenticated;
alter policy "Admins can view all profiles" on public.profiles to authenticated;
alter policy "Users can view own profile" on public.profiles to authenticated;

-- quick_wins_progress
alter policy "Users can insert own quick wins progress" on public.quick_wins_progress to authenticated;
alter policy "Users can update own quick wins progress" on public.quick_wins_progress to authenticated;
alter policy "Users can view own quick wins progress" on public.quick_wins_progress to authenticated;

-- strategy_documents
alter policy "Users manage own strategy docs" on public.strategy_documents to authenticated;

-- user_financial_data
alter policy "Users manage own financial data" on public.user_financial_data to authenticated;

-- user_roles
alter policy "Admins can manage roles" on public.user_roles to authenticated;
alter policy "Admins can view all roles" on public.user_roles to authenticated;

-- valuation_exports
alter policy "Users manage own exports" on public.valuation_exports to authenticated;

-- 3) Allow users to read ONLY their own role row (so the profile -> role JOIN works)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'user_roles'
      and policyname = 'Users can view own role'
  ) then
    create policy "Users can view own role"
      on public.user_roles
      for select
      to authenticated
      using (
        id = (
          select role_id from public.profiles
          where id = auth.uid()
        )
      );
  end if;
end$$;

-- 4) Role helper functions for future-proof checks and RPC
create or replace function public.get_my_role()
returns table (role_id uuid, role_name text)
language sql
security definer
stable
set search_path = public
as $$
  select ur.id, ur.name
  from public.profiles p
  join public.user_roles ur on ur.id = p.role_id
  where p.id = auth.uid();
$$;

grant execute on function public.get_my_role() to authenticated;

create or replace function public.is_client(_uid uuid default auth.uid())
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join public.user_roles ur on ur.id = p.role_id
    where p.id = coalesce(_uid, auth.uid())
      and ur.name = 'client'
  );
$$;

grant execute on function public.is_client(uuid) to authenticated;

-- 5) Audit role changes on profiles
create or replace function public.log_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role_id is distinct from old.role_id then
    insert into public.activity_log (user_id, action_type, details, action_metadata)
    values (
      auth.uid(),
      'role_change',
      'Profile role_id changed',
      jsonb_build_object(
        'profile_id', new.id,
        'old_role_id', old.role_id,
        'new_role_id', new.role_id
      )
    );
  end if;
  return new;
end;
$$;

drop trigger if exists trg_log_profile_role_change on public.profiles;
create trigger trg_log_profile_role_change
after update of role_id on public.profiles
for each row
execute function public.log_profile_role_change();