/** Proporciones de altura aprobadas: Verde 88% de Rosa, Púrpura 73%. */
export const PROPORCION_VERDE = 0.88;
export const PROPORCION_PURPURA = 0.73;

export const PERSONAJES = [
  {
    id: "rosa",
    nombre: "Rosa",
    edad: "Cerca de 4 años",
    src: "/personajes/rosa.jpg",
    alt: "Rosa, amiga imaginaria de Biodiversión: peluche rosa con tutú amarillo",
    width: 569,
    height: 828,
    clase: "alto-rosa",
    burbuja:
      "¡Hola! Te recibimos con gusto. Llámanos o escríbenos y te orientamos.",
    bio: "Amigable, energética y muy habladora. Da la bienvenida y acompaña el contacto.",
  },
  {
    id: "verde",
    nombre: "Verde",
    edad: "Cerca de 2 años y medio",
    src: "/personajes/verde.jpg",
    alt: "Verde, amigo imaginario de Biodiversión: peluche verde con gorra azul",
    width: 649,
    height: 828,
    clase: "alto-verde",
    burbuja: "En el jardín jugamos, exploramos y aprendemos juntos.",
    bio: "Alegre y travieso. Presenta el juego, el jardín y las actividades.",
  },
  {
    id: "purpura",
    nombre: "Púrpura",
    edad: "Bebé, cerca de 1 año",
    src: "/personajes/purpura.jpg",
    alt: "Púrpura, amiga imaginaria de Biodiversión: peluche morado con chupón rosa",
    width: 553,
    height: 828,
    clase: "alto-purpura",
    burbuja:
      "Los bebés, desde los 3 meses, tienen cuidado cercano y menús según su edad.",
    bio: "Tierna y dulce. Acompaña el cuidado de los bebés desde los 3 meses.",
  },
] as const;
