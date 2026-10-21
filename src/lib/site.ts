/** Datos públicos del sitio. Un solo lugar para dominio, teléfonos y horarios. */
export const SITE_URL = "https://www.biodiversion.baby";

export const TELEFONO_DISPLAY = "998 129 0100";
export const TELEFONO_TEL = "tel:+529981290100";
export const TELEFONO_SECUNDARIO_DISPLAY = "998 372 4752";
export const TELEFONO_SECUNDARIO_TEL = "tel:+529983724752";

export const TELEFONOS = [
  { display: TELEFONO_DISPLAY, tel: TELEFONO_TEL },
  { display: TELEFONO_SECUNDARIO_DISPLAY, tel: TELEFONO_SECUNDARIO_TEL },
] as const;

/**
 * WhatsApp del sitio (botón, formulario, flotante y /enlaces) sigue en el
 * 998 129 0100. El 998 372 4752 es solo para llamada.
 */
const MENSAJE_WHATSAPP =
  "Hola, me gustaría información sobre la guardería Biodiversión.";

export const WHATSAPP_URL = `https://wa.me/529981290100?text=${encodeURIComponent(MENSAJE_WHATSAPP)}`;

export const FACEBOOK_URL = "https://www.facebook.com/biodiversion";

export const DIRECCION_LINEA =
  "Av. Kohunlich 210, SM 50, C.P. 77533, Cancún, Quintana Roo";
export const DIRECCION_CORTA = "Av. Kohunlich 210, SM 50, 77533 Cancún, Q.R.";

export const MAPS_QUERY =
  "Av. Kohunlich 210, SM 50, 77533 Cancún, Quintana Roo";
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
export const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&z=16&output=embed`;

/** Punto publicado para esta dirección en listados abiertos. El mapa usa la dirección. */
export const GEO = {
  latitude: 21.14882,
  longitude: -86.850608,
};

/** Frase de edades aprobada por Diego. */
export const EDAD_ATENCION =
  "Atendemos bebés desde los 3 meses hasta los 4 años.";

export const HERO_DESCRIPCION =
  "Atendemos bebés desde los 3 meses hasta los 4 años, con horarios flexibles, alimentación cuidada y un enfoque educativo conectado con la naturaleza.";

/** Único texto de alimentación. Sin horas ni “horario de comida”. */
export const TEXTO_MENUS =
  "Ofrecemos menús balanceados personalizados según la edad de cada niño.";

const FRASE_EDAD_ANTERIOR =
  /desde 45 días de nacidos hasta niños de 4 años|desde 45 días hasta niños de 4 años|desde 45 días de nacidos|desde 45 días/gi;

/** El banner guardado aún trae la edad anterior. La página muestra la frase nueva. */
export function textoEdadActualizado(texto: string): string {
  return texto.replace(FRASE_EDAD_ANTERIOR, (coincidencia) =>
    coincidencia.toLowerCase().includes("hasta")
      ? "desde los 3 meses hasta los 4 años"
      : "desde los 3 meses",
  );
}

export const HORARIOS = [
  {
    dia: "Lunes a viernes",
    horas: "7:00 am – 7:00 pm",
    abre: "07:00",
    cierra: "19:00",
    dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  {
    dia: "Sábado",
    horas: "8:00 am – 4:00 pm",
    abre: "08:00",
    cierra: "16:00",
    dias: ["Saturday"],
  },
  {
    dia: "Domingo",
    horas: "Cerrado",
    abre: null,
    cierra: null,
    dias: [] as string[],
  },
] as const;
