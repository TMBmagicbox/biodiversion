-- Agrega el cálculo de "horas cobradas" a la vista de asistencia:
-- cualquier fracción de hora a partir del minuto 21 se redondea hacia
-- arriba como hora completa (ej. 1h 20min -> 1h, 1h 21min -> 2h).
create or replace view public.asistencia_horas as
  select
    a.*,
    case
      when a.hora_salida is not null
        then round(extract(epoch from (a.hora_salida - a.hora_entrada)) / 3600.0, 2)
      else null
    end as horas_totales,
    case
      when a.hora_salida is not null then
        floor(extract(epoch from (a.hora_salida - a.hora_entrada)) / 3600.0)::int
        + case
            when mod(extract(epoch from (a.hora_salida - a.hora_entrada))::int / 60, 60) >= 21
            then 1
            else 0
          end
      else null
    end as horas_cobradas
  from public.asistencia a;
