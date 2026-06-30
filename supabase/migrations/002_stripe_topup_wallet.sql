-- Jomluffyz Stripe + Supabase Top Up Core
-- Apply in Supabase SQL editor or through Supabase CLI.
-- Requires pgcrypto for gen_random_uuid().
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  username text unique,
  role text not null default 'player' check (role in ('player', 'admin', 'super_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  balance_points bigint not null default 0 check (balance_points >= 0),
  currency text not null default 'points',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  package_id text not null,
  gateway text not null default 'stripe',
  currency text not null default 'myr',
  amount_cents integer not null check (amount_cents > 0),
  points integer not null check (points > 0),
  status text not null default 'pending' check (
    status in ('pending', 'checkout_created', 'paid', 'failed', 'cancelled', 'refunded')
  ),
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  raw_gateway_event jsonb,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (
    type in ('topup', 'pack_open', 'sell_back', 'auction_bid', 'raffle_entry', 'quest_reward', 'adjustment')
  ),
  amount_points bigint not null,
  balance_after bigint not null check (balance_after >= 0),
  payment_order_id uuid references public.payment_orders(id) on delete set null,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists payment_orders_user_id_idx on public.payment_orders(user_id);
create index if not exists payment_orders_status_idx on public.payment_orders(status);
create index if not exists payment_orders_stripe_session_idx on public.payment_orders(stripe_session_id);
create index if not exists wallet_transactions_user_id_idx on public.wallet_transactions(user_id);
create index if not exists wallet_transactions_payment_order_idx on public.wallet_transactions(payment_order_id);

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.payment_orders enable row level security;
alter table public.wallet_transactions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "wallets_select_own" on public.wallets;
create policy "wallets_select_own"
on public.wallets for select
using (auth.uid() = user_id);

drop policy if exists "payment_orders_select_own" on public.payment_orders;
create policy "payment_orders_select_own"
on public.payment_orders for select
using (auth.uid() = user_id);

drop policy if exists "wallet_transactions_select_own" on public.wallet_transactions;
create policy "wallet_transactions_select_own"
on public.wallet_transactions for select
using (auth.uid() = user_id);

-- Writes are intentionally handled by service-role backend/webhook only.
-- Do not add browser insert/update policies for wallets or payment_orders.
