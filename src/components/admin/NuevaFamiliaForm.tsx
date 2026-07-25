"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { crearFamilia } from "@/app/admin/actions";
import FotoInput from "@/components/admin/FotoInput";

export default function NuevaFamiliaForm() {
  const [hijos, setHijos] = useState([0]);

  return (
    <form action={crearFamilia} className="glass mt-6 space-y-6 rounded-2xl p-6">
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-2 font-extrabold text-brand-blue-dark">
          Datos del tutor
        </legend>
        <Campo label="Nombre" name="nombre" required />
        <Campo label="Apellido paterno" name="apellido_paterno" required />
        <Campo label="Apellido materno" name="apellido_materno" />
        <Campo label="Teléfono" name="telefono" required />
        <Campo label="Teléfono alternativo" name="telefono_alternativo" />
        <Campo label="Correo" name="email" type="email" />
        <Campo label="Dirección" name="direccion" />
        <div className="sm:col-span-2">
          <FotoInput name="tutor_foto" label="Foto del tutor" />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 font-extrabold text-brand-blue-dark">
          Hijos
        </legend>
        {hijos.map((id, i) => (
          <div
            key={id}
            className="grid gap-4 rounded-xl border border-white/50 bg-white/40 p-4 sm:grid-cols-2"
          >
            <Campo label="Nombre" name="nino_nombre" required={i === 0} />
            <Campo label="Apellido paterno" name="nino_apellido_paterno" required={i === 0} />
            <Campo label="Apellido materno" name="nino_apellido_materno" />
            <Campo
              label="Fecha de nacimiento"
              name="nino_fecha_nacimiento"
              type="date"
              required={i === 0}
            />
            <Campo
              label="Parentesco del tutor"
              name="nino_parentesco"
              placeholder="Mamá, papá, etc."
            />
            <div className="sm:col-span-2">
              <FotoInput name="nino_foto" label="Foto del niño/a" />
            </div>
            {hijos.length > 1 && (
              <button
                type="button"
                onClick={() => setHijos((h) => h.filter((x) => x !== id))}
                className="flex w-fit items-center gap-1 text-xs font-bold text-red-600 hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Quitar
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setHijos((h) => [...h, Date.now()])}
          className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-brand-blue-dark"
        >
          <Plus className="h-4 w-4" />
          Agregar otro hijo/a
        </button>
      </fieldset>

      <button
        type="submit"
        className="rounded-full bg-brand-blue px-6 py-2.5 font-extrabold text-white transition-transform hover:scale-105"
      >
        Guardar familia
      </button>
    </form>
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
