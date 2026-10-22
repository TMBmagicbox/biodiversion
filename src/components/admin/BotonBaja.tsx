"use client";

/** Botón de submit para dar de baja: pide confirmación y un motivo opcional,
 * y lo guarda en el input oculto name="motivo" del mismo formulario. */
export default function BotonBaja({
  mensaje,
  className,
  children,
}: {
  mensaje: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        const motivo = window.prompt(
          `${mensaje}\n\nMotivo de la baja (opcional):`,
        );
        if (motivo === null) {
          e.preventDefault();
          return;
        }
        const campo = e.currentTarget.form?.elements.namedItem("motivo");
        if (campo instanceof HTMLInputElement) campo.value = motivo;
      }}
    >
      {children}
    </button>
  );
}
