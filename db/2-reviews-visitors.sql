-- Run second. What visitors can do: send a review, read the public ones.
create or replace function public.submit_portfolio_review(
  p_name text, p_phone text, p_work text, p_rating int, p_message text)
returns void language plpgsql security definer set search_path = public as $$
begin
  p_name := btrim(p_name); p_phone := btrim(p_phone);
  p_work := btrim(p_work); p_message := btrim(p_message);
  if (select count(*) from portfolio_reviews
      where phone = p_phone and created_at > now() - interval '1 day') >= 2
     or (select count(*) from portfolio_reviews
      where created_at > now() - interval '1 hour') >= 30 then
    raise exception 'too_many';
  end if;
  insert into portfolio_reviews(name, phone, work, rating, message)
  values (p_name, p_phone, p_work, p_rating, p_message);
end $$;

create or replace function public.public_portfolio_reviews()
returns table(id uuid, created_at timestamptz, name text,
              work text, rating int, message text)
language sql security definer set search_path = public as $$
  select id, created_at, name, work, rating, message
  from portfolio_reviews order by created_at desc limit 50;
$$;

revoke execute on function public.submit_portfolio_review(text,text,text,int,text) from public;
revoke execute on function public.public_portfolio_reviews() from public;
grant execute on function public.submit_portfolio_review(text,text,text,int,text) to anon, authenticated;
grant execute on function public.public_portfolio_reviews() to anon, authenticated;
