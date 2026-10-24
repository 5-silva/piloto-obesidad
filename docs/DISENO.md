# Diseño de Lunes

Dirección visual, sistema de componentes y la auditoría que los justifica. Actualizado el 24 de octubre de 2026.

## La idea

«El lunes empiezo» es la promesa que casi todos en México nos hemos hecho y roto. Lunes la convierte en método: **doce lunes, un check-in cada lunes y alguien que lo revisa**. Todo el producto gira alrededor de esa unidad. La tira de 12 lunes de la landing es la misma que el paciente ve llenarse en su portal.

Principios, en orden de prioridad:

1. **Claridad antes que persuasión.** La persona está decidiendo sobre su salud y su dinero. Cada pantalla dice qué es, qué cuesta, qué sigue y qué no hacemos.
2. **Una decisión por pantalla.** El cuestionario y el check-in van por pasos, con botones grandes y progreso visible.
3. **Calma.** Mucho espacio en blanco, superficies planas, color con significado y sin decoración.
4. **Confianza demostrable.** Datos con fuente, límites explícitos («no vendemos medicamentos») y privacidad visible junto a cada formulario.

## Sistema

| Token | Valor | Uso |
|---|---|---|
| `tinta` | `#141C33` | Texto principal y botones primarios (el añil de la marca) |
| `tinta-2` | `#3D4763` | Texto secundario |
| `piedra` | `#5E687A` | Texto de apoyo (contraste 5.6:1 sobre blanco) |
| `niebla` | `#F3F5F2` | Secciones alternas y superficies en reposo |
| `linea` | `#E2E6E1` | Divisiones finas |
| `jade` | `#0F7A64` | Lunes registrado, progreso, éxito |
| `rosa` | `#C8245C` | «Este lunes» y foco del teclado. Nada más. |
| `alerta` / `aviso` | `#B42318` / `#8A5300` | Señales de alarma / revisar con médico |

- **Tipografía:** Hanken Grotesk, una sola familia. Titulares grandes a 500 con tracking −0.03em y subtítulos a 600; cifras grandes a 500; texto a 18 px con interlineado 1.55. Elegida sobre Atkinson Hyperlegible porque su cero tachado volvía técnicos los precios y pesos, sin perder legibilidad.
- **Radios según jerarquía:** 24 px en bloques, 14 px en campos, píldora en botones y etiquetas. No usamos sombras: la profundidad sale del color de la superficie.
- **Espacio:** contenedor de 1120 px, texto a máximo 65 caracteres y secciones de 96 px en escritorio y 64 px en celular.
- **Movimiento:** solo el llenado de la tira de 12 lunes al cargar la landing y transiciones de 150 ms entre pasos. Todo se desactiva con «reducir movimiento».

Componentes en `src/components/ui/`: `Button`/`ButtonLink`, `Field`, `Input`, `Select`, `Textarea`, `ChoiceCard`, `Segmented`, `NumberStepper`, `Tile`, `Badge`, `Stat`, `Notice`, `EmptyState`, `Skeleton`, `Icon`. Las páginas no definen estilos de controles por su cuenta.

## Auditoría del piloto (antes)

| Área | Hallazgo | Cambio |
|---|---|---|
| Landing, jerarquía | El titular era largo y genérico (5 líneas en celular). La portada duplicaba los hitos de «Cómo funciona». | Titular con la idea de marca. La portada queda solo con la tira de 12 lunes y los hitos pasan a «Cómo funciona». |
| Landing, confianza | No había datos con fuente ni sección de privacidad, y el bloque oscuro de «Para quién» pesaba más que el precio. | Cifras con fuente (ENSANUT, estudio de abandono), un bloque de privacidad y «Para quién» en una superficie clara. |
| Landing, conversión | La llamada a la acción solo estaba arriba y abajo, y el formulario no explicaba qué pasa después. | Encabezado fijo con «Apartar mi lugar» y tres pasos de «qué sigue» junto al formulario. |
| Tableta (768 px) | Dos columnas demasiado pronto: la portada, el formulario y los 4 pasos se veían apretados. | Las dos columnas empiezan en 1024 px. |
| Formularios | Alturas desalineadas, consentimiento con estilo de tarjeta y sin prefijo +52. | Componente `Field` único, prefijo +52 y casillas simples. |
| Cuestionario | Una página larga con 20 controles. | Cinco pasos con barra de progreso y validación por paso. |
| Check-in | Diez preguntas en una sola página, con cajas de distinta altura. | Cinco pasos con controles segmentados, contadores +/− y el peso de la semana anterior como referencia. |
| Portal | El check-in tapaba el progreso y el cambio de peso no tenía jerarquía. | Tarjeta «Este lunes» arriba, cifras clave (peso, cambio, racha) y después la tira y la gráfica. |
| Acceso | En la demo no se podía probar el flujo con código. | La demo acepta el código 123456 y conserva los accesos con un clic. |
| Panel | Las tablas con desplazamiento no eran accesibles con teclado (axe: *scrollable-region-focusable*) y no había estados de carga. | Tabla reutilizable con foco y etiqueta, y esqueletos de carga en el panel y el portal. |
| Accesibilidad | El aviso de la demo quedaba fuera de las regiones de la página (axe: *region*). | El aviso queda dentro de la región del encabezado. |

## Lo que tomamos de los referentes

Revisamos solo la estructura visible y los estilos públicos de las páginas, sin copiar código ni recursos.

**Apple Health** (apple.com/health)
- Titular de dos tiempos y corto («Meaningful insights. Backed by science.»). Lo adaptamos en «El lunes empiezas. Los once que siguen, te acompañamos.»
- Párrafos que abren con una frase en negritas seguida de texto gris. Lo usamos en «Qué incluye».
- Cifras grandes con nota y fuente, y una sección propia de privacidad. Las adoptamos con datos de México.
- Bloques de radio amplio (28–36 px), botones en píldora y mucho aire entre secciones (90 px).

**WHOOP** (whoop.com)
- Paleta casi monocroma con un solo acento. Nosotros: añil y blanco, con rosa solo para «este lunes».
- Titulares grandes en peso regular y botones oscuros sólidos. Descartamos sus botones en mayúsculas.
- Precio de membresía visible con lo incluido en lista, y una sección final de información médica con notas. La adoptamos en el pie de página.
- Racha y hábito como motor: la usamos en la cifra de «lunes seguidos» del portal.

**Programas de tratamiento para el peso y bienestar premium** (Calibrate, Found, Oura; Ro y Hims & Hers pidieron verificación anti-bots y no la evadimos)
- Calibrate: «es biología, no fuerza de voluntad». Quitar el estigma es clave para quien ya se dijo «el lunes empiezo» muchas veces; lo usamos al cerrar la sección de cifras. Tinta añil profunda con un solo acento y botones en píldora, la misma familia de decisiones que la nuestra.
- Found: «qué esperar en tu primer mes» semana por semana reduce la ansiedad de empezar. Es nuestra sección «Lo que pasa en tus 12 lunes».
- Oura: titulares grandes en peso ligero, una cifra de resultados con nota y una página que explica cómo valida sus mediciones. De ahí salen los titulares en peso medio y la transparencia de las fuentes.
- En general: cuestionario de elegibilidad por pasos con respuestas en tarjetas grandes, lista explícita de lo que incluye y no incluye, y el médico con licencia visible como garantía.

Lo que no tomamos: fotografía de producto, testimonios (no los tenemos y no los inventamos) ni urgencia artificial.
