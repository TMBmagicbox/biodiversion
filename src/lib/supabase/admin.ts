import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente con permisos de administrador (service role).
 *
 * ¡Solo se debe usar dentro de Server Actions / código de servidor!
 * Nunca lo importes desde un componente "use client": la service role key
 * puede crear, editar o borrar cualquier dato sin restricciones de RLS.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Falta configurar SUPABASE_SERVICE_ROLE_KEY (Settings > API Keys > secret key en Supabase) para poder crear usuarios del personal.",
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
