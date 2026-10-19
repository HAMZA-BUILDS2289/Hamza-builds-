-- Run third. Owner only: see phone numbers and delete reviews.
create or replace function public.owner_portfolio_reviews()
returns table(id uuid, created_at timestamptz, name text, phone text,
              work text, rating int, message text)
language plpgsql security definer set search_path = public as $$
begin
  if coalesce(auth.jwt() ->> 'email', '') <> 'awwalhamza2289@gmail.com' then
    raise exception 'not_allowed';
  end if;
  return query select r.id, r.created_at, r.name, r.phone, r.work,
    r.rating, r.message from portfolio_reviews r order by r.created_at desc;
end $$;

create or replace function public.owner_delete_portfolio_review(p_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if coalesce(auth.jwt() ->> 'email', '') <> 'awwalhamza2289@gmail.com' then
    raise exception 'not_allowed';
  end if;
  delete from portfolio_reviews where id = p_id;
end $$;

revoke execute on function public.owner_portfolio_reviews() from public, anon;
revoke execute on function public.owner_delete_portfolio_review(uuid) from public, anon;
grant execute on function public.owner_portfolio_reviews() to authenticated;
grant execute on function public.owner_delete_portfolio_review(uuid) to authenticated;
