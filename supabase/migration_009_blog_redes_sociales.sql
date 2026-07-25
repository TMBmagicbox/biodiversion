-- Blog / publicaciones para redes sociales (Facebook, Instagram, Google
-- perfil de negocio y TikTok). El envío real a cada red se activa cuando
-- se configuren las credenciales de cada una (ver guía de configuración);
-- mientras tanto, las publicaciones se guardan igual y quedan marcadas
-- como "pendiente de conexión" en redes_resultado.
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  contenido text not null,
  imagen_url text,
  estado text not null default 'borrador' check (estado in ('borrador', 'publicado')),
  redes_seleccionadas text[] not null default '{}',
  redes_resultado jsonb not null default '{}',
  creado_por uuid references auth.users (id),
  created_at timestamptz not null default now(),
  publicado_en timestamptz
);

alter table public.blog_posts enable row level security;
create policy "staff_all_blog_posts" on public.blog_posts
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
