-- ============================================================
-- Biodiversión · Migración 002: fotos (tutores/niños) + slides del banner
-- Ejecutar en: Supabase Dashboard > SQL Editor (después de schema.sql)
-- ============================================================

-- Foto de los tutores (los niños ya tenían foto_url desde el inicio)
alter table public.tutores add column if not exists foto_url text;

-- ---------------------------------------------------------------
-- Slides del banner de inicio (editable desde /admin/inicio)
-- ---------------------------------------------------------------
create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  orden int not null default 0,
  titulo text not null,
  descripcion text,
  imagen_fondo_url text,
  logo_url text,
  texto_boton text default 'Agenda una visita',
  url_boton text default '#contacto',
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.hero_slides enable row level security;

create policy "staff_all_hero_slides" on public.hero_slides
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- Cualquier visitante (sin sesión) debe poder LEER los slides activos
-- para que se muestren en la página pública.
create policy "public_read_hero_slides_activos" on public.hero_slides
  for select using (activo = true);

create index if not exists idx_hero_slides_orden on public.hero_slides (orden);

-- ---------------------------------------------------------------
-- Storage: bucket público "fotos" para fotos de tutores/niños y
-- las imágenes del banner (fondo y logos de cada slide)
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

create policy "fotos_lectura_publica"
  on storage.objects for select
  using (bucket_id = 'fotos');

create policy "fotos_subida_personal"
  on storage.objects for insert
  with check (bucket_id = 'fotos' and auth.uid() is not null);

create policy "fotos_actualizacion_personal"
  on storage.objects for update
  using (bucket_id = 'fotos' and auth.uid() is not null);

create policy "fotos_borrado_personal"
  on storage.objects for delete
  using (bucket_id = 'fotos' and auth.uid() is not null);
