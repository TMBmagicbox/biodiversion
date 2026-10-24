-- Reconocimiento facial de tutores para registrar entrada/salida en la tableta.
-- Ejecutar en el SQL Editor de Supabase.
--
-- Principios:
--  * Solo se guarda el rostro de un tutor si existe un consentimiento firmado
--    y vigente (consentimientos_biometricos).
--  * Se guarda únicamente la "huella numérica" del rostro (descriptor de 128
--    números), nunca fotos adicionales.
--  * La copia escaneada del consentimiento firmado va en un bucket PRIVADO.
--  * Al revocar el consentimiento se borra el rostro; la copia firmada se
--    conserva como evidencia.

-- ---------------------------------------------------------------
-- Consentimientos firmados por el tutor
-- ---------------------------------------------------------------
create table if not exists public.consentimientos_biometricos (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.tutores (id) on delete cascade,
  fecha_firma date not null default current_date,
  archivo_path text not null,          -- ruta en el bucket privado "consentimientos"
  version_texto text not null default 'v1',
  notas text,
  registrado_por uuid references public.perfiles_admin (id),
  revocado_at timestamptz,
  created_at timestamptz not null default now()
);

-- Un solo consentimiento vigente por tutor.
create unique index if not exists uq_consentimiento_vigente_por_tutor
  on public.consentimientos_biometricos (tutor_id)
  where revocado_at is null;

-- ---------------------------------------------------------------
-- Rostro del tutor (solo descriptores numéricos)
-- ---------------------------------------------------------------
create table if not exists public.rostros_tutores (
  tutor_id uuid primary key references public.tutores (id) on delete cascade,
  consentimiento_id uuid not null
    references public.consentimientos_biometricos (id) on delete cascade,
  descriptores jsonb not null,         -- [[128 números], [128 números], ...]
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Cómo se registró cada asistencia (para auditoría)
-- ---------------------------------------------------------------
alter table public.asistencia
  add column if not exists metodo_registro text not null default 'manual'
  check (metodo_registro in ('manual', 'kiosco'));

-- ---------------------------------------------------------------
-- Seguridad (RLS): solo personal con sesión
-- ---------------------------------------------------------------
alter table public.consentimientos_biometricos enable row level security;
alter table public.rostros_tutores enable row level security;

drop policy if exists "staff_all_consentimientos" on public.consentimientos_biometricos;
create policy "staff_all_consentimientos" on public.consentimientos_biometricos
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "staff_all_rostros" on public.rostros_tutores;
create policy "staff_all_rostros" on public.rostros_tutores
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- ---------------------------------------------------------------
-- Storage: bucket PRIVADO para la copia firmada del consentimiento
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('consentimientos', 'consentimientos', false)
on conflict (id) do update set public = false;

drop policy if exists "staff_select_consentimientos" on storage.objects;
create policy "staff_select_consentimientos"
  on storage.objects for select
  using (bucket_id = 'consentimientos' and auth.uid() is not null);

drop policy if exists "staff_insert_consentimientos" on storage.objects;
create policy "staff_insert_consentimientos"
  on storage.objects for insert
  with check (bucket_id = 'consentimientos' and auth.uid() is not null);

drop policy if exists "staff_delete_consentimientos" on storage.objects;
create policy "staff_delete_consentimientos"
  on storage.objects for delete
  using (bucket_id = 'consentimientos' and auth.uid() is not null);
