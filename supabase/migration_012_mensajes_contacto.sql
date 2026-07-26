-- Guarda los mensajes que los visitantes envían desde el formulario de
-- contacto de la página pública (sección "Contacto"). Antes ese formulario
-- no estaba conectado a nada y los mensajes no llegaban a ningún lado.
--
-- Los inserts se hacen desde el servidor con la service role (no se abre
-- INSERT a "anon" por RLS), así que solo se necesita permitir lectura al
-- personal autenticado.
create table if not exists public.mensajes_contacto (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  contacto text not null,
  mensaje text not null,
  atendido boolean not null default false,
  creado_en timestamptz not null default now()
);

alter table public.mensajes_contacto enable row level security;

drop policy if exists "Personal ve mensajes de contacto" on public.mensajes_contacto;
create policy "Personal ve mensajes de contacto"
  on public.mensajes_contacto
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
