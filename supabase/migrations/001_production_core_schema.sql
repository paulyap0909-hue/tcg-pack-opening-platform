-- Jomluffyz Production Core Schema V1
-- Review with a qualified Supabase/PostgreSQL engineer before production use.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  role text not null default 'player' check (role in ('player', 'admin', 'owner')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  points_balance integer not null default 0 check (points_balance >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  transaction_type text not null,
  amount_points integer not null,
  balance_before integer not null,
  balance_after integer not null,
  related_object_type text,
  related_object_id uuid,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.packs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price_points integer not null check (price_points > 0),
  total_quantity integer not null check (total_quantity > 0),
  remaining_quantity integer not null check (remaining_quantity >= 0),
  cover_url text,
  status text not null default 'active' check (status in ('active', 'paused', 'hidden', 'sold_out')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pack_openings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pack_id uuid not null references public.packs(id),
  quantity integer not null default 1 check (quantity > 0),
  total_cost_points integer not null check (total_cost_points >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.vault_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pack_opening_id uuid references public.pack_openings(id),
  card_name text not null,
  rarity text,
  grade text,
  image_url text,
  source_pack text,
  status text not null default 'stored' check (status in ('stored', 'listed', 'shipping_requested', 'preparing', 'shipped', 'delivered', 'sold_back')),
  sell_back_points integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  vault_card_id uuid not null references public.vault_cards(id),
  price_points integer not null check (price_points > 0),
  status text not null default 'active' check (status in ('active', 'cancelled', 'sold')),
  buyer_id uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  gateway_reference text unique,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'MYR',
  points_to_credit integer not null check (points_to_credit > 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'expired', 'cancelled', 'refunded', 'chargeback')),
  metadata jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shipping_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vault_card_id uuid not null references public.vault_cards(id),
  full_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  postcode text not null,
  city text not null,
  state text not null,
  remark text,
  status text not null default 'shipping_requested' check (status in ('shipping_requested', 'preparing', 'shipped', 'delivered', 'cancelled')),
  tracking_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id),
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.packs enable row level security;
alter table public.pack_openings enable row level security;
alter table public.vault_cards enable row level security;
alter table public.marketplace_listings enable row level security;
alter table public.payment_orders enable row level security;
alter table public.shipping_requests enable row level security;
alter table public.admin_audit_logs enable row level security;

-- Basic player read policies. Write operations for wallet/card/payment should be handled through server-side functions.
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "wallets_select_own" on public.wallets for select using (auth.uid() = user_id);
create policy "wallet_transactions_select_own" on public.wallet_transactions for select using (auth.uid() = user_id);
create policy "pack_openings_select_own" on public.pack_openings for select using (auth.uid() = user_id);
create policy "vault_cards_select_own" on public.vault_cards for select using (auth.uid() = user_id);
create policy "payment_orders_select_own" on public.payment_orders for select using (auth.uid() = user_id);
create policy "shipping_requests_select_own" on public.shipping_requests for select using (auth.uid() = user_id);

-- Public active packs and marketplace listings can be viewed by logged-in users.
create policy "packs_select_active" on public.packs for select using (status = 'active');
create policy "marketplace_listings_select_active" on public.marketplace_listings for select using (status = 'active' or seller_id = auth.uid() or buyer_id = auth.uid());
