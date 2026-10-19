-- Hamza Builds portfolio: review table. Run this first.
create table if not exists public.portfolio_reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 60),
  phone text not null check (char_length(phone) between 7 and 20),
  work text not null check (char_length(work) between 2 and 80),
  rating int not null check (rating between 1 and 5),
  message text not null check (char_length(message) between 5 and 600)
);
alter table public.portfolio_reviews enable row level security;
revoke all on public.portfolio_reviews from anon, authenticated;
