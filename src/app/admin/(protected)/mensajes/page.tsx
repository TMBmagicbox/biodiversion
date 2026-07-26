import { createClient } from "@/lib/supabase/server";
import {
  alternarMensajeContacto,
  eliminarMensajeContacto,
} from "@/app/admin/actions";
import { CheckCircle2, Circle, Trash2, Phone } from "lucide-react";

export default async function MensajesAdminPage() {
  const supabase = await createClient();
  const { data: mensajes } = await supabase
    .from("mensajes_contacto")
    .select("*")
    .order("creado_en", { ascending: false });

  const pendientes = mensajes?.filter((m) => !m.atendido).length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-black text-brand-blue-dark">
        Mensajes de contacto
      </h1>
      <p className="mt-1 text-sm text-foreground/60">
        Mensajes enviados desde el formulario de contacto de la página
        principal ({pendientes} pendiente{pendientes === 1 ? "" : "s"}). Cada
        mensaje nuevo también se avisa por WhatsApp al negocio.
      </p>

      <div className="mt-6 space-y-3">
        {mensajes?.map((m) => (
          <div
            key={m.id}
            className={`glass rounded-2xl p-4 ${m.atendido ? "opacity-60" : ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-extrabold text-brand-blue-dark">
                  {m.nombre}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-foreground/70">
                  <Phone className="h-3.5 w-3.5" />
                  {m.contacto}
                </p>
              </div>
              <p className="text-xs text-foreground/50">
                {new Date(m.creado_en).toLocaleString("es-MX", {
                  timeZone: "America/Cancun",
                })}
              </p>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-foreground/80">
              {m.mensaje}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <form action={alternarMensajeContacto}>
                <input type="hidden" name="id" value={m.id} />
                <input
                  type="hidden"
                  name="atendido"
                  value={String(m.atendido)}
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-brand-blue-dark hover:bg-white"
                >
                  {m.atendido ? (
                    <>
                      <Circle className="h-3.5 w-3.5" /> Marcar pendiente
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Marcar atendido
                    </>
                  )}
                </button>
              </form>
              <form action={eliminarMensajeContacto}>
                <input type="hidden" name="id" value={m.id} />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}
        {!mensajes?.length && (
          <p className="text-sm text-foreground/50">
            Aún no hay mensajes de contacto.
          </p>
        )}
      </div>
    </div>
  );
}
