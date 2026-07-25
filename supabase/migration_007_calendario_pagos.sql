-- Calendario de pagos: día fijo del mes por niño/a + próxima fecha de pago
-- (se recalcula sola cada vez que se registra un pago "pagado" para ese
-- niño/a). Con esa fecha, el panel calcula 3 estatus: al día, por vencer
-- (3 días antes) y vencido.
alter table public.ninos add column if not exists dia_pago int
  check (dia_pago is null or (dia_pago between 1 and 31));
alter table public.ninos add column if not exists proxima_fecha_pago date;
