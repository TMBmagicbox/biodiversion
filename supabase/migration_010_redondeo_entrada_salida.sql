-- Corrige cómo se redondean las "horas cobradas": antes se redondeaba la
-- DURACIÓN total (entrada -> salida), lo cual no reflejaba bien cómo se
-- cobra en la práctica. Ahora cada hora se redondea por separado:
--   - Entrada: siempre hacia ABAJO, a la hora en que llegó, sin importar
--     los minutos (ej. 7:15 se cuenta desde las 7:00).
--   - Salida: hacia ARRIBA a la siguiente hora solo si pasó del minuto 21
--     de esa hora; si no, hacia abajo (ej. 8:21 se cuenta como que salió
--     a las 9:00; 8:15 se cuenta como que salió a las 8:00).
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
        extract(
          epoch from (
            (
              date_trunc('hour', a.hora_salida)
              + case
                  when extract(minute from a.hora_salida) >= 21 then interval '1 hour'
                  else interval '0 hour'
                end
            )
            - date_trunc('hour', a.hora_entrada)
          )
        )::int / 3600
      else null
    end as horas_cobradas
  from public.asistencia a;
