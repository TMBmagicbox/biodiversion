-- Permite guardar un niño sin fecha de nacimiento todavía (hay 3 casos en el
-- Excel de origen que no traían el dato completo; se completa después desde
-- el panel).
alter table public.ninos alter column fecha_nacimiento drop not null;

-- Importación de niños desde 'Alumnos Bio 2026.xlsx' (hojas ALUMNOS 2026 y
-- NIÑOS DE TARJETONES). Se crean solo los niños, SIN tutor — el tutor de
-- cada uno se vincula después manualmente desde /admin/familias.
--
-- Notas de la carga:
--  * El plan se asignó por el texto de la hoja (FULLTIME -> Plan 3,
--    8 HRS -> Plan 2, 6 HRS -> Plan 1, y los 8 niños de la hoja
--    "NIÑOS DE TARJETONES" -> Tarjeta de horas). Unos pocos montos en el
--    Excel no coinciden exactamente con el plan (ej. $3,375 o $3,410); se
--    tomó el plan más cercano — revísalos si hace falta ajustar el pago real.
--  * "Elián González" aparecía en ambas hojas (una sin fecha de nacimiento,
--    otra con fecha completa); se importó una sola vez usando el dato completo.
--  * 3 niños quedan con fecha_nacimiento en NULL porque el Excel no la traía:
--    Mía Cataleya Reyes Torres, Demián Martínez y Cielo Borrego Tesorero.
insert into public.ninos (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, salon, plan_id, fecha_ingreso) values
  ('Emilio', 'Herrera', 'Ramírez', '2024-04-11', 'Maternal', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Renata Jordana', 'Brindis', 'Aguilar', '2022-08-24', 'Maternal', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Kianna', 'Cordova', 'Gomez', '2023-05-22', 'Maternal', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Liam Adrian', 'Pech', 'Vazquez', '2023-11-03', 'Maternal', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Yordan', 'Pérez', 'Jiménez', '2023-06-24', 'Maternal', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Jordani', 'Pérez', 'Jiménez', '2023-06-24', 'Maternal', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Mía Beatriz', 'Vargas', 'Couoh', '2024-05-29', 'Maternal', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Leandro Jared', 'Herrera', 'García', '2023-08-10', 'Maternal', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Leonel', 'López', 'Verduzco', '2025-02-09', 'Lactantes B', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Catalina', 'Rivera', 'Garcia', '2024-07-13', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Adrián', 'Medrano', 'Pérez', '2023-02-21', 'Maternal', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Luz Antonia', 'Hernandez', 'Silva', '2024-11-05', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Anthony Emir', 'Jiménez', 'Sánchez', '2024-04-20', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Itzae', 'Chanona', 'Casimiro', '2024-07-24', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Gaia Camila', 'García', 'Díaz', '2025-08-11', 'Lactantes A', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Ikai', 'Ruiz', 'Grandal', '2024-09-09', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Rafael', 'Gest', 'Pina', '2024-02-15', 'Maternal', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Sofía Victoria', 'Villicaña', 'Bautisa', '2024-10-15', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Emma Arimar', 'Ochoa', 'Lira', '2024-04-16', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 1'), NULL),
  ('Luna Ximena', 'Arenas', 'López', '2024-07-01', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Lucas Alejandro', 'Ramos', 'Galeana', '2023-01-22', 'Maternal', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Kamil', 'Fonseca', 'Hoyos', '2024-09-03', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Edgar Eduardo', 'Vázquez', 'Larios', '2024-03-07', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Christopher Liam', 'Chan', 'Cambranis', '2025-09-08', 'Lactantes B', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Caelli Mariel', 'Chulim', 'Cumplido', '2025-02-21', 'Lactantes B', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Helena Amélie', 'Martínez', 'Zurita', '2025-03-11', 'Lactantes B', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Eva', 'Domínguez', 'Melgarejo', '2024-12-20', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Mía Cataleya', 'Reyes', 'Torres', NULL, 'Maternal', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Iris Rebeca', 'Martínez', 'Cruz', '2024-09-24', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Isabella', 'Rodríguez', 'Urzua', '2024-07-25', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 1'), NULL),
  ('André', 'Reyes', 'Bustos', '2025-04-20', 'Lactantes B', (select id from public.planes where nombre = 'Plan 1'), NULL),
  ('Omar', 'Suljkanovic', 'Arista', '2024-06-03', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 1'), NULL),
  ('Noah', 'León', 'García', '2023-05-12', 'Maternal', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Elisa', 'Adame', 'Galvez', '2025-10-17', 'Lactantes A', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Demián', 'Martínez', NULL, NULL, 'Maternal', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Zoé', 'Cruz', 'Vázquez', '2025-05-20', 'Lactantes B', (select id from public.planes where nombre = 'Plan 3'), NULL),
  ('Christian Mauricio', 'Ruiz', 'Robles', '2024-07-02', 'Pre Maternal', (select id from public.planes where nombre = 'Plan 2'), NULL),
  ('Angely Leilani', 'García', 'Feregrino', '2022-05-30', 'Maternal', (select id from public.planes where nombre = 'Tarjeta de horas'), NULL),
  ('Bruno', 'Fuentes', 'García', '2022-01-18', 'Maternal', (select id from public.planes where nombre = 'Tarjeta de horas'), NULL),
  ('Andy Mihrimar', 'Morales', 'Zenteno', '2023-08-07', 'Maternal', (select id from public.planes where nombre = 'Tarjeta de horas'), '2026-04-11'),
  ('Elian', 'González', 'González', '2021-07-08', 'Maternal', (select id from public.planes where nombre = 'Tarjeta de horas'), '2025-11-01'),
  ('Noah', 'Thornley', NULL, '2024-02-29', 'Pre Maternal', (select id from public.planes where nombre = 'Tarjeta de horas'), '2025-12-15'),
  ('Santiago', 'Trejo', 'Huitron', '2025-01-03', 'Lactantes B', (select id from public.planes where nombre = 'Tarjeta de horas'), '2025-12-06'),
  ('Camila', 'Hernández', 'Wong', '2023-03-09', 'Maternal', (select id from public.planes where nombre = 'Tarjeta de horas'), '2025-07-24'),
  ('Cielo', 'Borrego', 'Tesorero', NULL, 'Maternal', (select id from public.planes where nombre = 'Tarjeta de horas'), NULL);
