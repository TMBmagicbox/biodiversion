/**
 * Texto del consentimiento para el uso de reconocimiento facial.
 *
 * IMPORTANTE: es un borrador. Antes de usarlo con familias debe revisarlo un
 * abogado (razón social del responsable, aviso de privacidad integral, datos
 * de contacto para derechos ARCO, etc.). Si se cambia el texto, hay que subir
 * la versión para saber qué texto firmó cada tutor.
 */
export const VERSION_CONSENTIMIENTO = "v1-2026-10";

/** Tamaño máximo de la copia firmada (Vercel limita el cuerpo a ~4.5 MB). */
export const MAX_BYTES_CONSENTIMIENTO = 4 * 1024 * 1024;

export const TITULO_CONSENTIMIENTO =
  "Consentimiento para el uso de reconocimiento facial";

export const PARRAFOS_CONSENTIMIENTO: { titulo: string; texto: string }[] = [
  {
    titulo: "Responsable",
    texto:
      "Biodiversión (la \"Guardería\") es responsable del tratamiento de los datos personales descritos en este documento.",
  },
  {
    titulo: "Finalidad",
    texto:
      "Identificar a la persona adulta que deja o recoge a la niña o niño mediante una tableta con cámara ubicada en la entrada, con el único fin de registrar su hora de entrada y de salida y reforzar la seguridad de la recogida.",
  },
  {
    titulo: "Datos que se tratan",
    texto:
      "Una representación numérica de su rostro (no una fotografía) obtenida de imágenes capturadas con su participación. Estos son datos personales sensibles (biométricos). No se usan para ninguna otra finalidad, no se venden y no se transfieren a terceros.",
  },
  {
    titulo: "Su participación es voluntaria",
    texto:
      "Puede negarse a otorgar este consentimiento sin ninguna consecuencia: la entrada y la salida se registrarán de forma manual por el personal, igual que hoy.",
  },
  {
    titulo: "Conservación",
    texto:
      "Los datos se conservan únicamente mientras el servicio esté vigente y se eliminan cuando usted revoque su consentimiento o concluya la relación con la Guardería. Se conserva este documento firmado como constancia de su decisión.",
  },
  {
    titulo: "Derechos y revocación",
    texto:
      "Usted puede acceder, rectificar, cancelar u oponerse al tratamiento de sus datos, y revocar este consentimiento en cualquier momento, solicitándolo por escrito o en la recepción de la Guardería. Al revocar, su rostro se elimina del sistema.",
  },
  {
    titulo: "Seguridad",
    texto:
      "Los datos se almacenan en un sistema con acceso restringido al personal autorizado. La identificación por rostro puede equivocarse; por eso el personal puede verificar su identidad manualmente.",
  },
];

export const DECLARACION_CONSENTIMIENTO =
  "Declaro que leí este documento, que me explicaron cómo se usarán mis datos, y que otorgo mi consentimiento libre e informado para el uso de mi rostro con la finalidad descrita.";
