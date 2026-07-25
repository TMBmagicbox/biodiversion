-- Repara el plan de los niños importados desde el Excel cuyo plan_id haya
-- quedado en NULL (por ejemplo si esta migración se corrió antes de que la
-- tabla planes tuviera sus 4 planes, la subconsulta de la 005 no encontraba
-- el plan y guardaba NULL sin dar error).
--
-- Es seguro volver a correr esto las veces que haga falta: solo toca niños
-- que TODAVÍA no tienen plan_id (no pisa ningún plan que hayas asignado o
-- cambiado a mano desde el panel).
with datos (nombre, apellido_paterno, apellido_materno, plan_nombre) as (
  values
    ('Emilio', 'Herrera', 'Ramírez', 'Plan 3'),
    ('Renata Jordana', 'Brindis', 'Aguilar', 'Plan 3'),
    ('Kianna', 'Cordova', 'Gomez', 'Plan 2'),
    ('Liam Adrian', 'Pech', 'Vazquez', 'Plan 2'),
    ('Yordan', 'Pérez', 'Jiménez', 'Plan 3'),
    ('Jordani', 'Pérez', 'Jiménez', 'Plan 3'),
    ('Mía Beatriz', 'Vargas', 'Couoh', 'Plan 3'),
    ('Leandro Jared', 'Herrera', 'García', 'Plan 2'),
    ('Leonel', 'López', 'Verduzco', 'Plan 2'),
    ('Catalina', 'Rivera', 'Garcia', 'Plan 2'),
    ('Adrián', 'Medrano', 'Pérez', 'Plan 2'),
    ('Luz Antonia', 'Hernandez', 'Silva', 'Plan 3'),
    ('Anthony Emir', 'Jiménez', 'Sánchez', 'Plan 3'),
    ('Itzae', 'Chanona', 'Casimiro', 'Plan 2'),
    ('Gaia Camila', 'García', 'Díaz', 'Plan 2'),
    ('Ikai', 'Ruiz', 'Grandal', 'Plan 2'),
    ('Rafael', 'Gest', 'Pina', 'Plan 3'),
    ('Sofía Victoria', 'Villicaña', 'Bautisa', 'Plan 3'),
    ('Emma Arimar', 'Ochoa', 'Lira', 'Plan 1'),
    ('Luna Ximena', 'Arenas', 'López', 'Plan 2'),
    ('Lucas Alejandro', 'Ramos', 'Galeana', 'Plan 3'),
    ('Kamil', 'Fonseca', 'Hoyos', 'Plan 2'),
    ('Edgar Eduardo', 'Vázquez', 'Larios', 'Plan 3'),
    ('Christopher Liam', 'Chan', 'Cambranis', 'Plan 3'),
    ('Caelli Mariel', 'Chulim', 'Cumplido', 'Plan 2'),
    ('Helena Amélie', 'Martínez', 'Zurita', 'Plan 2'),
    ('Eva', 'Domínguez', 'Melgarejo', 'Plan 3'),
    ('Mía Cataleya', 'Reyes', 'Torres', 'Plan 2'),
    ('Iris Rebeca', 'Martínez', 'Cruz', 'Plan 3'),
    ('Isabella', 'Rodríguez', 'Urzua', 'Plan 1'),
    ('André', 'Reyes', 'Bustos', 'Plan 1'),
    ('Omar', 'Suljkanovic', 'Arista', 'Plan 1'),
    ('Noah', 'León', 'García', 'Plan 2'),
    ('Elisa', 'Adame', 'Galvez', 'Plan 2'),
    ('Demián', 'Martínez', NULL, 'Plan 2'),
    ('Zoé', 'Cruz', 'Vázquez', 'Plan 3'),
    ('Christian Mauricio', 'Ruiz', 'Robles', 'Plan 2'),
    ('Angely Leilani', 'García', 'Feregrino', 'Tarjeta de horas'),
    ('Bruno', 'Fuentes', 'García', 'Tarjeta de horas'),
    ('Andy Mihrimar', 'Morales', 'Zenteno', 'Tarjeta de horas'),
    ('Elian', 'González', 'González', 'Tarjeta de horas'),
    ('Noah', 'Thornley', NULL, 'Tarjeta de horas'),
    ('Santiago', 'Trejo', 'Huitron', 'Tarjeta de horas'),
    ('Camila', 'Hernández', 'Wong', 'Tarjeta de horas'),
    ('Cielo', 'Borrego', 'Tesorero', 'Tarjeta de horas')
)
update public.ninos n
set plan_id = p.id
from datos d
join public.planes p on p.nombre = d.plan_nombre
where n.plan_id is null
  and n.nombre = d.nombre
  and n.apellido_paterno = d.apellido_paterno
  and (
    n.apellido_materno = d.apellido_materno
    or (n.apellido_materno is null and d.apellido_materno is null)
  );

-- Verificación: si el resultado no es 0, dime cuáles quedaron (puede ser un
-- niño nuevo que agregaste sin plan a propósito, o un nombre que no calzó
-- exacto con el Excel original).
select nombre, apellido_paterno, apellido_materno, salon
from public.ninos
where plan_id is null
order by nombre;
