/** Alturas reales en cm. Juntos se escalan con esta relación, sin redibujar. */
export const ALTO_ROSA_CM = 103;
export const ALTO_VERDE_CM = 91;
export const ALTO_PURPURA_CM = 75;

export const PERSONAJES = [
  {
    id: "rosa",
    nombre: "Rosa",
    edad: "Cerca de 4 años",
    src: "/personajes/rosa.png",
    alt: "Rosa, bola de pelo rosa con pestañas, ojos azules, dos colmillitos y tutú amarillo",
    width: 232,
    height: 270,
    clase: "alto-rosa",
    burbuja:
      "¡Hola! Te recibimos con gusto. Llámanos o escríbenos y te orientamos.",
    bio: "Amigable, energética y muy habladora. Da la bienvenida y acompaña el contacto.",
  },
  {
    id: "verde",
    nombre: "Verde",
    edad: "Cerca de 2 años y medio",
    src: "/personajes/verde.png",
    alt: "Verde, peluche verde lima con gorra azul al revés, orejas naranjas y brazos a rayas",
    width: 210,
    height: 220,
    clase: "alto-verde",
    burbuja: "En el jardín jugamos, exploramos y aprendemos juntos.",
    bio: "Alegre, travieso y siempre listo para jugar. Presenta el juego y las actividades.",
  },
  {
    id: "purpura",
    nombre: "Púrpura",
    edad: "Bebé, cerca de 1 año",
    src: "/personajes/purpura.png",
    alt: "Púrpura, peluche morado con antenas de corazón, chupón rosa y colita",
    width: 150,
    height: 184,
    clase: "alto-purpura",
    burbuja:
      "Los bebés, desde los 3 meses, tienen cuidado cercano y menús según su edad.",
    bio: "Tierno, juguetón y muy dulce. Acompaña a los bebés y la alimentación.",
  },
] as const;
