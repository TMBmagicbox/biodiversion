-- ============================================================
-- Biodiversión · Esquema de base de datos (Supabase / Postgres)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- Personal / usuarios del panel de administración
-- (se vincula a auth.users; el registro se crea al invitar
--  a un usuario desde Supabase Auth)
-- ---------------------------------------------------------------
create table if not exists public.perfiles_admin (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  rol text not null default 'educadora'
    check (rol in ('admin', 'direccion', 'educadora', 'recepcion')),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Tutores / padres de familia
-- ---------------------------------------------------------------
create table if not exists public.tutores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido_paterno text not null,
  apellido_materno text,
  telefono text not null,
  telefono_alternativo text,
  email text,
  direccion text,
  identificacion_tipo text, -- INE, pasaporte, etc.
  identificacion_numero text,
  notas text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Niños
-- ---------------------------------------------------------------
create table if not exists public.ninos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido_paterno text not null,
  apellido_materno text,
  fecha_nacimiento date not null,
  sexo text check (sexo in ('F', 'M', 'otro')),
  curp text,
  salon text, -- ej. Lactantes, Maternal 1, Maternal 2, Preescolar
  fecha_ingreso date default current_date,
  activo boolean not null default true,

  -- Salud (importante para una guardería)
  tipo_sangre text,
  alergias text,
  condiciones_medicas text,
  medicamentos text,
  pediatra_nombre text,
  pediatra_telefono text,
  vacunas_al_dia boolean default false,
  cartilla_vacunacion_url text,

  foto_url text,
  notas text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Relación tutor <-> niño (un niño puede tener varios tutores)
-- ---------------------------------------------------------------
create table if not exists public.tutores_ninos (
  tutor_id uuid references public.tutores (id) on delete cascade,
  nino_id uuid references public.ninos (id) on delete cascade,
  parentesco text not null, -- mamá, papá, abuela, tutor legal...
  contacto_principal boolean not null default false,
  autorizado_recoger boolean not null default true,
  primary key (tutor_id, nino_id)
);

-- ---------------------------------------------------------------
-- Personas autorizadas para recoger al niño (no tutores)
-- ---------------------------------------------------------------
create table if not exists public.personas_autorizadas (
  id uuid primary key default gen_random_uuid(),
  nino_id uuid not null references public.ninos (id) on delete cascade,
  nombre text not null,
  parentesco text,
  telefono text,
  identificacion text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Asistencia / control de horas de estancia
-- ---------------------------------------------------------------
create table if not exists public.asistencia (
  id uuid primary key default gen_random_uuid(),
  nino_id uuid not null references public.ninos (id) on delete cascade,
  fecha date not null default current_date,
  hora_entrada timestamptz not null default now(),
  hora_salida timestamptz,
  entregado_por text, -- nombre de quien lo dejó
  recogido_por text,  -- nombre de quien lo recogió
  temperatura_entrada numeric(4,1),
  notas text,
  registrado_por uuid references public.perfiles_admin (id),
  created_at timestamptz not null default now()
);

-- Horas totales calculadas automáticamente
create or replace view public.asistencia_horas as
  select
    a.*,
    case
      when a.hora_salida is not null
        then round(extract(epoch from (a.hora_salida - a.hora_entrada)) / 3600.0, 2)
      else null
    end as horas_totales
  from public.asistencia a;

-- ---------------------------------------------------------------
-- Planes de mensualidad por niño
-- ---------------------------------------------------------------
create table if not exists public.planes_mensualidad (
  id uuid primary key default gen_random_uuid(),
  nino_id uuid not null references public.ninos (id) on delete cascade,
  monto_mensual numeric(10,2) not null,
  incluye_comida boolean not null default false,
  costo_comida_extra numeric(10,2) default 0,
  dia_de_pago int default 5, -- día del mes en que vence
  fecha_inicio date not null default current_date,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Pagos (mensualidad, comida, inscripción, extras)
-- ---------------------------------------------------------------
create table if not exists public.pagos (
  id uuid primary key default gen_random_uuid(),
  nino_id uuid not null references public.ninos (id) on delete cascade,
  tipo text not null check (tipo in ('mensualidad', 'comida', 'inscripcion', 'extra')),
  concepto text,
  monto numeric(10,2) not null,
  mes_correspondiente date, -- primer día del mes que cubre el pago
  fecha_pago date not null default current_date,
  metodo_pago text check (metodo_pago in ('efectivo', 'tarjeta', 'transferencia')),
  estatus text not null default 'pagado' check (estatus in ('pagado', 'pendiente', 'vencido')),
  comprobante_url text,
  registrado_por uuid references public.perfiles_admin (id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Incidentes / bitácora (recomendado: golpes, comportamiento, salud)
-- ---------------------------------------------------------------
create table if not exists public.incidentes (
  id uuid primary key default gen_random_uuid(),
  nino_id uuid not null references public.ninos (id) on delete cascade,
  fecha timestamptz not null default now(),
  tipo text check (tipo in ('accidente', 'salud', 'comportamiento', 'otro')),
  descripcion text not null,
  accion_tomada text,
  notificado_tutor boolean default false,
  registrado_por uuid references public.perfiles_admin (id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Cámaras de vigilancia (placeholder para integración futura)
-- ---------------------------------------------------------------
create table if not exists public.camaras (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,        -- ej. "Salón Maternal 1"
  ubicacion text,
  stream_url text,             -- URL del proveedor (RTSP/HLS vía un gateway)
  activa boolean not null default true,
  visible_para_tutores boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security: solo usuarios autenticados (personal)
-- pueden leer/escribir datos de niños, tutores, pagos, etc.
-- ============================================================
alter table public.perfiles_admin enable row level security;
alter table public.tutores enable row level security;
alter table public.ninos enable row level security;
alter table public.tutores_ninos enable row level security;
alter table public.personas_autorizadas enable row level security;
alter table public.asistencia enable row level security;
alter table public.planes_mensualidad enable row level security;
alter table public.pagos enable row level security;
alter table public.incidentes enable row level security;
alter table public.camaras enable row level security;

create policy "staff_read_perfiles" on public.perfiles_admin
  for select using (auth.uid() is not null);

create policy "staff_all_tutores" on public.tutores
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "staff_all_ninos" on public.ninos
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "staff_all_tutores_ninos" on public.tutores_ninos
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "staff_all_personas_autorizadas" on public.personas_autorizadas
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "staff_all_asistencia" on public.asistencia
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "staff_all_planes" on public.planes_mensualidad
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "staff_all_pagos" on public.pagos
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "staff_all_incidentes" on public.incidentes
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "staff_all_camaras" on public.camaras
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- Índices útiles
create index if not exists idx_asistencia_nino_fecha on public.asistencia (nino_id, fecha);
create index if not exists idx_pagos_nino on public.pagos (nino_id);
create index if not exists idx_pagos_mes on public.pagos (mes_correspondiente);
create index if not exists idx_ninos_activo on public.ninos (activo);
