import Kiosco from "@/components/admin/Kiosco";

export const metadata = { title: "Kiosco de entrada y salida" };

/** Pantalla para la tableta de la entrada. Queda fuera del layout del panel
 * (sin menú lateral); sigue protegida por el inicio de sesión del personal. */
export default function KioscoPage() {
  return <Kiosco />;
}
