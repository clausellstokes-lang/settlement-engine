-- Settlement Generator — Initial Schema
-- Run this in your Supabase SQL Editor or via supabase db push

-- ── User profiles (extends auth.users) ──────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tier text not null default 'free' check (tier in ('free', 'premium')),
  credits integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Saved settlements ───────────────────────────────────────────────────────
create table if not exists public.settlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  tier text not null,
  data jsonb not null,          -- full settlement JSON
  config jsonb,                 -- generation config for replay
  toggles jsonb,                -- institution/service/goods toggles
  seed text,                    -- PRNG seed for deterministic replay
  neighbour_links jsonb,        -- cross-settlement NPC pairings
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_settlements_user on public.settlements(user_id);

-- ── Credit transactions ─────────────────────────────────────────────────────
create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,      -- positive = purchase, negative = spend
  reason text not null,         -- 'purchase', 'narrative', 'daily_life', 'refund'
  settlement_id uuid references public.settlements(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_credits_user on public.credit_transactions(user_id);

-- ── Row Level Security ──────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.settlements enable row level security;
alter table public.credit_transactions enable row level security;

-- Profiles: users can read/update their own
create policy "Users read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Settlements: users CRUD their own, with count limit enforced by app
create policy "Users read own settlements" on public.settlements
  for select using (auth.uid() = user_id);
create policy "Users insert own settlements" on public.settlements
  for insert with check (auth.uid() = user_id);
create policy "Users update own settlements" on public.settlements
  for update using (auth.uid() = user_id);
create policy "Users delete own settlements" on public.settlements
  for delete using (auth.uid() = user_id);

-- Credits: users read their own, inserts via server functions only
create policy "Users read own credits" on public.credit_transactions
  for select using (auth.uid() = user_id);

-- ── Updated-at trigger ──────────────────────────────────────────────────────

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger set_updated_at_settlements
  before update on public.settlements
  for each row execute function public.update_updated_at();
