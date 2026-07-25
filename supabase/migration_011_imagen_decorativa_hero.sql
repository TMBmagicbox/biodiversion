-- Nueva imagen decorativa (PNG, aparte de la de fondo) para cada slide del
-- banner de inicio. Se muestra flotando con su propio efecto de parallax
-- (más rápido que el fondo) para dar sensación de profundidad/dinamismo.
alter table public.hero_slides
  add column if not exists imagen_decorativa_url text;
