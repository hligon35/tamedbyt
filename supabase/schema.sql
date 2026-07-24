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

create index if not exists appointments_start_idx on public.appointments (starts_at);
create index if not exists appointments_status_idx on public.appointments (status);

alter table public.appointments enable row level security;

-- The application uses the service-role key on server-only routes. No public table policy is required.