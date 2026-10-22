-- Baja suave de niños/as (y por extensión de familias).
-- La columna ninos.activo ya existe; aquí se agrega la fecha y el motivo de la
-- baja para conservar el historial (pagos, asistencia, incidentes) y poder
-- reactivar a un niño/a si regresa.
-- Ejecutar en el SQL Editor de Supabase.

alter table public.ninos add column if not exists fecha_baja timestamptz;
alter table public.ninos add column if not exists motivo_baja text;
