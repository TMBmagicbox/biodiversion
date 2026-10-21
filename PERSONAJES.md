# Personajes de Biodiversión

Tres amigos imaginarios acompañan el sitio. El logo, el teléfono, la dirección y los horarios del negocio no cambian por ellos. No llevan emojis.

La ficha vigente es `public/personajes/ficha-tecnica-corregida.jpg`. Cualquier nota anterior de “unidades relativas”, de “20 m / 25 m / 15 m” o de “Rosa y Verde a la misma altura” queda anulada.

## Medidas reales

Alto / ancho de frente / profundidad de lado.

| Personaje | Edad del personaje | Alto | Ancho de frente | Profundidad de lado |
| --- | --- | --- | --- | --- |
| Rosa | cerca de 4 años | 103 cm | 78 cm | 70 cm |
| Verde | cerca de 2 años y medio | 91 cm | 70 cm | 62 cm |
| Púrpura | bebé, cerca de 1 año | 75 cm | 58 cm | 55 cm |

## Proporción cuando aparecen juntos

La altura de referencia es la de Rosa.

- Verde = 88% de la altura de Rosa (91 / 103, aplicado como 88%, no como el cociente crudo).
- Púrpura = 73% de la altura de Rosa (75 / 103, aplicado como 73%).

En el sitio, la fila usa esas constantes (`0.88` y `0.73`) con las plantas de los pies alineadas. Las fotos compuestas (`trio-abrazo.jpg`, `rosa-purpura.jpg`) ya están armadas con esa relación. No se estiran para igualar alturas.

La edad de cada personaje no es el rango de la guardería. La guardería atiende bebés desde los 3 meses hasta los 4 años.

## Qué no se cambia

- Rosa: peluche rosa, pelo largo despeinado, ojos azules, pestañas largas, cejas finas, boca abierta con dos colmillitos, tutú amarillo de tul, piernas cortas rosas. Amigable, energética, muy habladora. Presenta la bienvenida y el contacto.
- Verde: peluche verde lima, gorra azul rey hacia atrás, orejas redondas naranjas, brazos con rayas naranja y verde, manos naranjas, sonrisa con colmillitos, ojos verdes. Alegre y travieso. Presenta el juego, el jardín y las actividades.
- Púrpura: peluche morado, dos antenas con un corazón morado, chupón rosa, colita, ojos azules. Tierna, juguetona y dulce. Presenta el cuidado de los bebés y la alimentación.

Siempre con esos accesorios. No se cambian colores ni proporciones entre una publicación y otra.

## Color de acento

Muestreado de los retratos. Sirve para bordes y fondos, no para texto pequeño.

| Uso | HEX |
| --- | --- |
| Peluche de Rosa | `#DB8B7B` |
| Tutú amarillo | `#F1BD4B` |
| Peluche de Verde | `#A0B030` |
| Gorra azul | `#1B4DA2` |
| Naranja (orejas, manos, rayas) | `#DC6C1D` |
| Peluche de Púrpura | `#816188` |
| Chupón | `#C495A9` |
| Crema de las tarjetas | `#F6E4CC` |

El texto sigue en `#1F2A24` o azul oscuro de la marca. El botón lima lleva tinta `#14240A`.

## Archivos

| Archivo | Uso |
| --- | --- |
| `public/personajes/rosa.jpg` | Retrato de Rosa |
| `public/personajes/verde.jpg` | Retrato de Verde |
| `public/personajes/purpura.jpg` | Retrato de Púrpura |
| `public/personajes/verde-pulgar.jpg` | Verde presenta juego y naturaleza |
| `public/personajes/rosa-purpura.jpg` | Rosa y Púrpura juntas, Púrpura al 73% |
| `public/personajes/trio-abrazo.jpg` | Los tres juntos: 100% / 88% / 73% |
| `public/personajes/ficha-tecnica-corregida.jpg` | Ficha de medidas aprobada |

Estos retratos se reconstruyeron a partir de la ficha porque el arte final con esos nombres no llegó como archivo. Diego puede sustituir los JPG conservando el nombre. No hay foto real de la fachada en el repositorio; no se inventó `fachada.jpg`.

## Prompts maestros

Estilo común: peluche 3D suave, fondo crema `#F6E4CC`, luz suave, sin texto, sin emojis, sin cambiar accesorios ni colores.

Rosa: peluche rosa de unos 4 años, pelo largo despeinado, ojos azules con pestañas largas, cejas finas, boca abierta con dos colmillitos, tutú amarillo de tul, piernas cortas rosas, expresión amigable y enérgica.

Verde: peluche verde lima de unos 2 años y medio, gorra azul rey hacia atrás, orejas redondas naranjas, brazos a rayas naranja y verde, manos naranjas, ojos verdes, sonrisa con colmillitos, expresión alegre y traviesa. En `verde-pulgar.jpg` levanta el pulgar.

Púrpura: peluche morado bebé, dos antenas con un corazón morado, chupón rosa, colita, ojos azules, expresión tierna.

Cuando salen juntos, Verde mide 88% de Rosa y Púrpura mide 73%, con los pies en la misma línea.
