-- Run once in a NEW, dedicated Supabase project, using the SQL Editor.
-- Do not run against VybaCash. Existing authentication and data remain separate.
begin;
create table public.greylad_owners (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.greylad_owners enable row level security;
revoke all on public.greylad_owners from public, anon, authenticated;
grant select on public.greylad_owners to authenticated;
create policy "Owners can read own membership" on public.greylad_owners
 for select to authenticated using (user_id = (select auth.uid()));
-- No insert/update/delete grants or policies: users cannot make themselves owners.
create table public.greylad_entries (
 id uuid primary key default gen_random_uuid(),
 title text not null check (length(trim(title)) between 1 and 180),
 category text not null check(category in ('research','writing','updates','resources','projects')),
 summary text not null check(length(trim(summary)) between 1 and 500),
 body text not null check(length(trim(body)) between 1 and 30000),
 status text not null default '' check(length(status)<=80),
 resource_url text check(resource_url is null or resource_url ~ '^https?://'),
 published boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.greylad_entries enable row level security;
revoke all on public.greylad_entries from public, anon, authenticated;
grant select on public.greylad_entries to anon, authenticated;
grant insert, update, delete on public.greylad_entries to authenticated;
create policy "Public can read published entries" on public.greylad_entries
 for select to anon, authenticated using (published = true);
create policy "Owner can manage entries" on public.greylad_entries
 for all to authenticated
 using (exists(select 1 from public.greylad_owners where user_id=(select auth.uid())))
 with check (exists(select 1 from public.greylad_owners where user_id=(select auth.uid())));
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('greylad-public','greylad-public',true,10485760,
 array['application/pdf','text/csv','text/plain','image/png','image/jpeg','image/webp','application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
create policy "Owner manages Greylad public files" on storage.objects
 for all to authenticated
 using (bucket_id='greylad-public' and exists(select 1 from public.greylad_owners where user_id=(select auth.uid())))
 with check (bucket_id='greylad-public' and exists(select 1 from public.greylad_owners where user_id=(select auth.uid())));
commit;
-- Create your user in Authentication > Users. Then copy its UUID and execute:
-- insert into public.greylad_owners(user_id) values ('YOUR-REAL-USER-UUID');
-- Keep public signups disabled. Never grant owner-table writes to browser roles.
