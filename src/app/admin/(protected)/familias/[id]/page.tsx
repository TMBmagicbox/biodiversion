import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Baby, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  agregarNinoAFamilia,
  eliminarFamilia,
  eliminarNino,
} from "@/app/admin/actions";
import FotoLightbox from "@/components/admin/FotoLightbox";
import BotonConfirmar from "@/components/admin/BotonConfirmar";

function edad(fechaNacimiento: string | null) {
  if (!fechaNacimiento) return "Fecha de nacimiento pendiente";
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let meses =
    (hoy.getFullYear() - nacimiento.getFullYear()) * 12 +
    (hoy.getMonth() - nacimiento.getMonth());
  if (hoy.getDate() < nacimiento.getDate()) meses -= 1;
  if (meses < 24) return `${meses} meses`;
  return `${Math.floor(meses / 12)} años`;
}

export default async function FamiliaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: tutor } = await supabase
    .from("tutores")
    .select(
      "*, tutores_ninos(parentesco, nino:ninos(id, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, foto_url, salon, alergias))",
    )
    .eq("id", id)
    .maybeSingle();

  if (!tutor) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/familias"
        className="flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a familias
      </Link>

      <div className="glass mt-4 flex items-center gap-4 rounded-2xl p-6">
        {tutor.foto_url ? (
          <FotoLightbox
            src={tutor.foto_url}
            alt={tutor.nombre}
            className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-brand-blue/10 text-brand-blue-dark"
          >
            <Image
              src={tutor.foto_url}
              alt={tutor.nombre}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          </FotoLightbox>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-blue/10 text-brand-blue-dark">
            <User className="h-8 w-8" strokeWidth={2} />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-xl font-black text-brand-blue-dark">
            {tutor.nombre} {tutor.apellido_paterno} {tutor.apellido_materno}
          </h1>
          <p className="text-sm text-foreground/60">
            {tutor.telefono} {tutor.email ? `· ${tutor.email}` : ""}
          </p>
          {tutor.direccion && (
            <p className="text-sm text-foreground/60">{tutor.direccion}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Link
            href={`/admin/familias/${tutor.id}/editar`}
            className="flex items-center justify-center gap-1.5 rounded-full border-2 border-black/10 px-4 py-2 text-sm font-extrabold text-brand-blue-dark transition-colors hover:bg-white/60"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Link>
          <form action={eliminarFamilia}>
            <input type="hidden" name="tutor_id" value={tutor.id} />
            <BotonConfirmar
              mensaje={`¿Borrar por completo a ${tutor.nombre} ${tutor.apellido_paterno} y a sus hijos? Esta acción no se puede deshacer.`}
              className="flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-red-200 px-4 py-2 text-sm font-extrabold text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Borrar familia
            </BotonConfirmar>
          </form>
        </div>
      </div>

      <h2 className="mt-8 flex items-center gap-2 text-lg font-extrabold text-brand-blue-dark">
        <Baby className="h-5 w-5" />
        Hijos
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {tutor.tutores_ninos?.map(
          (tn: {
            parentesco: string;
            nino: {
              id: string;
              nombre: string;
              apellido_paterno: string;
              apellido_materno: string | null;
              fecha_nacimiento: string | null;
              foto_url: string | null;
              salon: string | null;
              alergias: string | null;
            } | null;
          }) =>
            tn.nino && (
              <div key={tn.nino.id} className="glass flex gap-3 rounded-2xl p-4">
                {tn.nino.foto_url ? (
                  <FotoLightbox
                    src={tn.nino.foto_url}
                    alt={tn.nino.nombre}
                    className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-brand-green/10 text-brand-green-dark"
                  >
                    <Image
                      src={tn.nino.foto_url}
                      alt={tn.nino.nombre}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </FotoLightbox>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-green/10 text-brand-green-dark">
                    <Baby className="h-7 w-7" strokeWidth={2} />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-extrabold text-brand-blue-dark">
                      {tn.nino.nombre} {tn.nino.apellido_paterno}
                    </p>
                    <div className="flex shrink-0 items-center gap-2.5">
                      <Link
                        href={`/admin/familias/${tutor.id}/ninos/${tn.nino.id}/editar`}
                        aria-label={`Editar a ${tn.nino.nombre}`}
                        className="text-brand-blue-dark hover:text-brand-blue"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <form action={eliminarNino}>
                        <input type="hidden" name="nino_id" value={tn.nino.id} />
                        <input type="hidden" name="tutor_id" value={tutor.id} />
                        <BotonConfirmar
                          mensaje={`¿Borrar a ${tn.nino.nombre}?`}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </BotonConfirmar>
                      </form>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/60">
                    {edad(tn.nino.fecha_nacimiento)} · {tn.parentesco}
                  </p>
                  {tn.nino.salon && (
                    <p className="text-xs text-foreground/60">
                      Salón: {tn.nino.salon}
                    </p>
                  )}
                  {tn.nino.alergias && (
                    <p className="text-xs text-amber-700">
                      Alergias: {tn.nino.alergias}
                    </p>
                  )}
                </div>
              </div>
            ),
        )}
        {!tutor.tutores_ninos?.length && (
          <p className="text-sm text-foreground/50">
            Sin hijos registrados todavía.
          </p>
        )}
      </div>

      <h2 className="mt-8 text-lg font-extrabold text-brand-blue-dark">
        Agregar otro hijo/a
      </h2>
      <form
        action={agregarNinoAFamilia}
        className="glass mt-3 grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
      >
        <input type="hidden" name="tutor_id" value={tutor.id} />
        <Campo label="Nombre" name="nombre" required />
        <Campo label="Apellido paterno" name="apellido_paterno" required />
        <Campo label="Apellido materno" name="apellido_materno" />
        <Campo
          label="Fecha de nacimiento"
          name="fecha_nacimiento"
          type="date"
          required
        />
        <Campo
          label="Parentesco del tutor"
          name="parentesco"
          placeholder="Mamá, papá, etc."
        />
        <div>
          <label className="text-sm font-bold text-brand-blue-dark">
            Foto del niño/a
          </label>
          <input
            type="file"
            name="foto"
            accept="image/*"
            className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-brand-green px-6 py-2.5 font-extrabold text-white"
          >
            Agregar hijo/a
          </button>
        </div>
      </form>
    </div>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-brand-blue-dark">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-black/10 bg-white/70 px-3 py-2"
      />
    </div>
  );
}
