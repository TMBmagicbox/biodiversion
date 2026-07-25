-- Catálogo de planes de pago: 3 mensualidades + 1 tarjeta de horas.
create table if not exists public.planes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  tipo text not null check (tipo in ('mensualidad', 'tarjeta_horas')),
  monto numeric(10,2) not null,
  horas_incluidas int,          -- solo aplica a "tarjeta_horas"
  notas text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.planes enable row level security;
create policy "staff_all_planes" on public.planes
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

insert into public.planes (nombre, tipo, monto, horas_incluidas, notas) values
  ('Plan 1', 'mensualidad', 3100, null, null),
  ('Plan 2', 'mensualidad', 3300, null, null),
  ('Plan 3', 'mensualidad', 3700, null, null),
  ('Tarjeta de horas', 'tarjeta_horas', 1800, 40, 'No incluye alimentos ni acceso a cámaras');

-- Vincula cada niño/a a su plan (se usará también al importar el Excel de
-- niños con su plan asignado).
alter table public.ninos add column if not exists plan_id uuid references public.planes (id);

-- Permite registrar pagos del tipo "tarjeta_horas" además de los que ya
-- existían.
alter table public.pagos drop constraint if exists pagos_tipo_check;
alter table public.pagos add constraint pagos_tipo_check
  check (tipo in ('mensualidad', 'comida', 'inscripcion', 'extra', 'tarjeta_horas'));
