-- Run once in Supabase Dashboard > SQL Editor.
create table if not exists public.portfolio_content (
  id text primary key check (id = 'main'),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.portfolio_content enable row level security;
create policy "Anyone can read the public portfolio" on public.portfolio_content for select using (true);
create policy "Only Mamun can change portfolio content" on public.portfolio_content for all to authenticated using ((auth.jwt() ->> 'email') = 'mamun180@outlook.com') with check ((auth.jwt() ->> 'email') = 'mamun180@outlook.com');

insert into storage.buckets (id, name, public) values ('portfolio-assets', 'portfolio-assets', true) on conflict (id) do update set public = true;
create policy "Anyone can view public portfolio assets" on storage.objects for select using (bucket_id = 'portfolio-assets');
create policy "Only Mamun can upload portfolio assets" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-assets' and (auth.jwt() ->> 'email') = 'mamun180@outlook.com');
create policy "Only Mamun can update portfolio assets" on storage.objects for update to authenticated using (bucket_id = 'portfolio-assets' and (auth.jwt() ->> 'email') = 'mamun180@outlook.com');
create policy "Only Mamun can remove portfolio assets" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-assets' and (auth.jwt() ->> 'email') = 'mamun180@outlook.com');
