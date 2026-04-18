-- ============================================================
-- resumepro — initial schema
-- ============================================================

-- ------------------------------------------------------------
-- tables
-- ------------------------------------------------------------

create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  full_name       text,
  avatar_url      text,
  daily_analyses_used integer not null default 0,
  daily_reset_at  timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.resumes (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  title           text not null,
  raw_text        text not null,
  parsed_json     jsonb,
  source_file_url text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.job_targets (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  resume_id       uuid references public.resumes(id) on delete cascade,
  job_title       text not null,
  company         text,
  job_description text not null,
  job_url         text,
  created_at      timestamptz not null default now()
);

create table if not exists public.analyses (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  resume_id       uuid not null references public.resumes(id) on delete cascade,
  job_target_id   uuid references public.job_targets(id) on delete cascade,
  ats_score       integer not null check (ats_score >= 0 and ats_score <= 100),
  score_breakdown jsonb not null,
  keywords_matched jsonb not null default '[]'::jsonb,
  keywords_missing jsonb not null default '[]'::jsonb,
  suggestions     jsonb not null default '[]'::jsonb,
  red_flags       jsonb not null default '[]'::jsonb,
  content_hash    text not null,
  created_at      timestamptz not null default now()
);

create table if not exists public.cover_letters (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  resume_id       uuid not null references public.resumes(id) on delete cascade,
  job_target_id   uuid references public.job_targets(id) on delete cascade,
  content         text not null,
  tone            text not null default 'professional'
                    check (tone in ('formal', 'professional', 'conversational')),
  word_count      integer not null default 0,
  created_at      timestamptz not null default now()
);

-- ------------------------------------------------------------
-- indexes
-- ------------------------------------------------------------

create index if not exists resumes_user_id_idx        on public.resumes(user_id);
create index if not exists analyses_user_id_idx       on public.analyses(user_id);
create index if not exists analyses_content_hash_idx  on public.analyses(content_hash);
create index if not exists analyses_resume_id_idx     on public.analyses(resume_id);
create index if not exists cover_letters_user_id_idx  on public.cover_letters(user_id);
create index if not exists job_targets_user_id_idx    on public.job_targets(user_id);

-- ------------------------------------------------------------
-- row level security
-- ------------------------------------------------------------

alter table public.profiles      enable row level security;
alter table public.resumes       enable row level security;
alter table public.job_targets   enable row level security;
alter table public.analyses      enable row level security;
alter table public.cover_letters enable row level security;

-- profiles (id = auth.uid(), no user_id column)
create policy "profiles: select own"  on public.profiles for select using (auth.uid() = id);
create policy "profiles: insert own"  on public.profiles for insert with check (auth.uid() = id);
create policy "profiles: update own"  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles: delete own"  on public.profiles for delete using (auth.uid() = id);

-- resumes
create policy "resumes: select own"  on public.resumes for select using (auth.uid() = user_id);
create policy "resumes: insert own"  on public.resumes for insert with check (auth.uid() = user_id);
create policy "resumes: update own"  on public.resumes for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "resumes: delete own"  on public.resumes for delete using (auth.uid() = user_id);

-- job_targets
create policy "job_targets: select own"  on public.job_targets for select using (auth.uid() = user_id);
create policy "job_targets: insert own"  on public.job_targets for insert with check (auth.uid() = user_id);
create policy "job_targets: update own"  on public.job_targets for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "job_targets: delete own"  on public.job_targets for delete using (auth.uid() = user_id);

-- analyses
create policy "analyses: select own"  on public.analyses for select using (auth.uid() = user_id);
create policy "analyses: insert own"  on public.analyses for insert with check (auth.uid() = user_id);
create policy "analyses: update own"  on public.analyses for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "analyses: delete own"  on public.analyses for delete using (auth.uid() = user_id);

-- cover_letters
create policy "cover_letters: select own"  on public.cover_letters for select using (auth.uid() = user_id);
create policy "cover_letters: insert own"  on public.cover_letters for insert with check (auth.uid() = user_id);
create policy "cover_letters: update own"  on public.cover_letters for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cover_letters: delete own"  on public.cover_letters for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- storage RLS (bucket: resume-files)
-- ------------------------------------------------------------

create policy "storage: select own files"
  on storage.objects for select
  using (bucket_id = 'resume-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "storage: insert own files"
  on storage.objects for insert
  with check (bucket_id = 'resume-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "storage: update own files"
  on storage.objects for update
  using (bucket_id = 'resume-files' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "storage: delete own files"
  on storage.objects for delete
  using (bucket_id = 'resume-files' and auth.uid()::text = (storage.foldername(name))[1]);

-- ------------------------------------------------------------
-- auto-create profile on signup
-- ------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- updated_at auto-bump
-- ------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists touch_profiles on public.profiles;
create trigger touch_profiles
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_resumes on public.resumes;
create trigger touch_resumes
  before update on public.resumes
  for each row execute function public.touch_updated_at();
