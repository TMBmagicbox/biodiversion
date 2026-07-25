-- Configuración global de pagos: monto del cargo automático por retardo.
-- Es una tabla de una sola fila (id fijo = 1) para poder editarla desde el
-- panel sin tener que crear una sección de "ajustes" completa.
create table if not exists public.configuracion_pagos (
  id int primary key default 1,
  monto_recargo_tardio numeric(10,2) not null default 150,
  updated_at timestamptz not null default now(),
  constraint configuracion_pagos_singleton check (id = 1)
);

alter table public.configuracion_pagos enable row level security;
create policy "staff_all_configuracion_pagos" on public.configuracion_pagos
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

insert into public.configuracion_pagos (id, monto_recargo_tardio)
values (1, 150)
on conflict (id) do nothing;

-- Nuevo tipo de pago "recargo": se usa para el cargo automático que se
-- agrega solo cuando se registra un pago de mensualidad después de la
-- fecha de pago que tenía asignada el niño/a.
alter table public.pagos drop constraint if exists pagos_tipo_check;
alter table public.pagos add constraint pagos_tipo_check
  check (tipo in ('mensualidad', 'comida', 'inscripcion', 'extra', 'tarjeta_horas', 'recargo'));
