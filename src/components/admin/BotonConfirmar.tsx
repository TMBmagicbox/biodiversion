"use client";

/** Botón de submit que pide confirmación antes de enviar el formulario
 * (para acciones destructivas como borrar). */
export default function BotonConfirmar({
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
        if (!confirm(mensaje)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
