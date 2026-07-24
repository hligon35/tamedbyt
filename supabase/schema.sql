create extension if not exists pgcrypto;

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  service_id text not null,
  service_name text not null,
  service_category text,
  service_price_amount integer not null default 0 check (service_price_amount >= 0),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  notes text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  deposit_amount integer not null check (deposit_amount >= 0),
  products jsonb not null default '[]'::jsonb,
  product_total_amount integer not null default 0 check (product_total_amount >= 0),
  checkout_subtotal_amount integer not null default 0 check (checkout_subtotal_amount >= 0),
  tax_amount integer not null default 0 check (tax_amount >= 0),
  checkout_total_amount integer not null default 0 check (checkout_total_amount >= 0),
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','expired')),
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint appointment_time_valid check (ends_at > starts_at)
);

alter table public.appointments add column if not exists service_category text;
alter table public.appointments add column if not exists service_price_amount integer not null default 0;
alter table public.appointments add column if not exists products jsonb not null default '[]'::jsonb;
alter table public.appointments add column if not exists product_total_amount integer not null default 0;
alter table public.appointments add column if not exists checkout_subtotal_amount integer not null default 0;
alter table public.appointments add column if not exists tax_amount integer not null default 0;
alter table public.appointments add column if not exists checkout_total_amount integer not null default 0;

create table if not exists public.product_inventory (
  product_id text primary key,
  product_name text not null,
  quantity integer not null default 0 check (quantity >= 0),
  low_stock_threshold integer not null default 3 check (low_stock_threshold >= 0),
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.coupon_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  percent_off numeric(5,2) not null check (percent_off > 0 and percent_off <= 100),
  active boolean not null default true,
  stripe_coupon_id text not null,
  stripe_promotion_code_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists appointments_start_idx on public.appointments (starts_at);
create index if not exists appointments_status_idx on public.appointments (status);
create index if not exists coupon_codes_active_idx on public.coupon_codes (active);

alter table public.appointments enable row level security;
alter table public.product_inventory enable row level security;
alter table public.coupon_codes enable row level security;

-- Server-only routes use the Supabase service-role key. No public policies are required.