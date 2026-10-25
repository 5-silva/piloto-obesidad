# Brief del agente CMO: Lunes

25 de octubre de 2026. Copia en el repositorio del [Doc del brief](https://claude.ai/artifact/KgsuZCYFVdFyDJb7Wj9JQ6); si difieren, manda el Doc y esta copia se actualiza.

## 1. Mandato y cómo arrancar

El agente CMO recibe Lunes con la landing y el piloto ya construidos. Su trabajo es que la marca, la presencia digital y la adquisición lleguen al ICP y lo conviertan, con evidencia y experimentos medibles. Complementa lo que existe; no lo reconstruye.

**Lo que le toca**

- Auditar la marca y la presencia digital actuales: landing, cuestionario, portal, mensajes y assets.
- Investigar benchmarks vigentes de diseño y marketing en salud digital, en México y fuera.
- Proponer una estrategia fundamentada: posicionamiento, casa de mensajes, canales y backlog de experimentos.
- Crear los recursos visuales que necesiten las páginas: imágenes de fondo, ilustraciones, composiciones y piezas para redes.
- Desarrollar el contenido y los experimentos para alcanzar, conectar y convertir al ICP.
- Ejecutar por etapas (sección 9), con un reporte semanal de resultados.

**Lo que no le toca**

- Cambiar el stack, la arquitectura, el modelo de datos o la autenticación.
- Reescribir contenido clínico o de seguridad sin el médico responsable.
- Activar cobro o abrir la lista de espera al público antes de pasar la puerta legal (sección 8).

**Orden de lectura en la primera hora**

1. Este brief completo.
2. En el repo: `README.md`, `STATUS.md`, `docs/cmo/BRIEF.md` (copia de este brief), `docs/DISENO.md`, `docs/METRICAS.md`, `docs/CONTENIDO-CLINICO.md` y `src/content/landing.ts`.
3. `docs/research/`: investigación de mercado e insights de entrevistas, ya anonimizados.
4. La demo en vivo, [lunes-piloto.vercel.app](https://lunes-piloto.vercel.app): cualquier correo y el código 123456; un correo que empiece con «equipo» entra al panel.
5. El deck y el plan del piloto (enlaces en Fuentes).

**Primer entregable:** la auditoría de la etapa 0, con hallazgos priorizados. Va antes de tocar código o crear assets.

**Aprobaciones del fundador antes de actuar**

- El posicionamiento y la casa de mensajes, antes de ejecutar las etapas 2 a 4.
- Cualquier gasto: pauta, herramientas o bancos de imágenes.
- Cualquier publicación o mensaje a terceros: redes, médicos, WhatsApp o correo.
- Cualquier cambio a textos clínicos, de seguridad o de privacidad.
- La subida de cambios de código a GitHub.

## 2. El negocio en una página

Lunes es un programa de acompañamiento de 12 semanas para adultos que usan o van a iniciar un medicamento para bajar de peso con receta. Ataca el abandono y el rebote, no el acceso a la receta.

| Tema | Estado al 25 de octubre de 2026 |
| --- | --- |
| Propuesta | Opción A de la investigación: adherencia y mantenimiento. Línea de marca: «El lunes empiezas. Los once que siguen, te acompañamos.» |
| Qué incluye | Valoración y revisiones médicas por videollamada, plan de nutrióloga, check-in cada lunes, WhatsApp en horario de oficina y guía de fuerza. |
| Qué no hace | No receta por sí mismo, no vende ni guarda medicamento y no lleva el expediente clínico. Acepta receta de cualquier médico. |
| Precio | Plan fundador de $2,500 MXN al mes, sin medicamento. Hoy no se cobra: la persona aparta uno de 30 lugares. |
| Modelo | B2C, 100% digital, con capital propio. Médicos con cédula externos. |
| Economía | Costo estimado de operación de $1,550 por paciente al mes; margen bruto de 36%. Meta de costo por paciente: menos de $1,800. |
| Producto | Landing con lista de espera, cuestionario de tamizaje, portal del paciente, panel del equipo y recordatorios por correo. |
| Estado | Demo pública con datos ficticios. Faltan la base de datos real, el dominio, la opinión legal y un médico aliado. |

**Por qué esta apuesta.** Al menos ocho competidores digitales ya ofrecen receta, envío y seguimiento. Ninguno demuestra con datos independientes retención ni mantenimiento del peso. Sin capital ni margen del fármaco, Lunes solo puede ganar en experiencia de acompañamiento, adherencia y resultados.

**De dónde viene.** Las notas de los fundadores buscan «hacer que bajar de peso no sea tan difícil» creando consciencia con acompañamiento. La investigación la califica de plausible, no validada. El piloto deja fuera la psicología por costo; volver a incluirla es una decisión abierta.

**Lo que decide el piloto.** En la semana 16, los resultados de HC1 a HC8 dicen si se construye el producto, se pivota o se detiene (sección 4).

## 3. ICP y entrevistas

El ICP es una hipótesis apoyada en dos entrevistas, no un perfil validado. Sumar 10 a 15 entrevistas con el ICP real, al menos 5 con personas que abandonaron, es trabajo del CMO (HC2).

**ICP primario (hipótesis)**

- Adulto de 30 a 55 años, preferentemente mujer, urbano, de nivel A/B o C+.
- IMC de 30 o más, o de 27 o más con una enfermedad metabólica.
- Ya usa o va a iniciar un medicamento con receta, y lo paga de su bolsillo.
- Lo mueve la salud, no solo la estética.
- Teme gastar mucho y recuperar el peso.
- Valora un plan claro y un profesional disponible por WhatsApp.
- Fuera: IMC menor de 27 sin enfermedad, menores, embarazo o lactancia, trastorno alimentario y obesidad con indicación quirúrgica.

| Segmento | Qué necesita | Lectura para marketing |
| --- | --- | --- |
| S1. Ya usa el medicamento sin acompañamiento | No abandonar, llevar los síntomas y no rebotar | Prioridad alta: ya paga y se llega por médicos y farmacias |
| S2. Inicia tratamiento con enfermedades metabólicas | Un plan claro y un equipo que coordine | Prioridad alta en valor; exige protocolo médico |
| S3. Mantenimiento o retiro del medicamento | Mantener el peso con menos gasto | Prioridad alta y poco atendida |
| S7. Médicos tratantes | Menos carga de seguimiento | Canal de referencia (HC8) |
| S4. Motivación solo estética | Acceso rápido al medicamento | Excluir: riesgo ético y regulatorio |
| S5. Nivel medio y bajo sin acceso al medicamento | Opciones baratas | Fuera del piloto |
| S6. Empresas y aseguradoras | Bajar costos de salud | Descartado por ahora |

**Problemas, de más a menos intenso:** P1 costo total del tratamiento; P2 abandono y rebote; P3 no hay un plan concreto; P4 efectos y alimentación con el medicamento; P5 desinformación y producto falsificado; P6 culpa, ansiedad o depresión; P7 carga de seguimiento del médico; P8 tiempo y traslados.

**Las dos entrevistas, anonimizadas**

| Entrevistada | Perfil | Lo que importa para marketing |
| --- | --- | --- |
| Paciente, 48 años, Estado de México | Médica; obesidad grado I con hipertensión, colesterol alto e hipotiroidismo; usa medicamento | Salud como motivo, falta de plan, precio como dolor, llegada por referencia médica, preferencia presencial |
| Endocrinóloga, unos 17 años de práctica | Ejerce en Venezuela | Mantener es el problema, acompañar retiene, el médico está saturado |

1. El motivo es la salud: «seguir viva, pero bien», dice la paciente.
2. Falta un plan: los médicos indican, pero «no te dan un plan como tal».
3. Duele el dinero, no el tiempo. La paciente compara farmacias y busca descuentos.
4. Llegó al tratamiento por referencia de su médico y lo validó con un médico en redes.
5. Prefiere la atención «persona a persona», aunque resuelve dudas por WhatsApp. Es el riesgo de HC3.
6. Para la endocrinóloga, el problema «es que lo pueda mantener en el tiempo».
7. «El paciente necesita sentirse acompañado y validado, porque si no, lo abandona.»
8. El médico carga el seguimiento: «trescientos mensajes diarios». Por eso el médico es canal.

**La tensión de la voluntad.** La endocrinóloga dice que culpar a la fuerza de voluntad «es una falta de empatía». La paciente dice que hace falta «disciplina y voluntad». La landing hoy dice «No es falta de fuerza de voluntad», y eso puede chocar con quien se ve disciplinado. Encuadre a probar: «La voluntad es tuya; el plan y el acompañamiento, nuestros».

**Cuánto pesan.** Son dos personas. El entrevistador planteó sus hipótesis antes de algunas respuestas y una entrevistada es familiar suya. La paciente es médica y ya está bien atendida, y nadie que abandonó fue escuchado. Las citas son internas: nunca se usan como testimonio público.

## 4. Hipótesis, metas y medición

El CMO responde sobre todo a HC1, HC2, HC5 y HC8: que paguen, que el dolor sea mantener, que haya un canal rentable y que los médicos refieran. Cada experimento suyo debe mover una de ellas.

| Id | Hipótesis | Dónde se mide | Cumple si |
| --- | --- | --- | --- |
| HC1 | Pagan el acompañamiento aparte del medicamento | Panel, con precio visible en la landing | 20 o más depósitos y 5% o más de visitantes a lista de espera |
| HC2 | El dolor es mantener y no abandonar | Entrevistas fuera de la app | 60% o más lo menciona sin inducción, en 15 entrevistas |
| HC3 | Aceptan un formato 100% digital | Panel | 70% o más completa 4 semanas en línea |
| HC4 | El acompañamiento retiene | Panel | Retención a 12 semanas de 70% o más, contra unos 42% de referencia |
| HC5 | Hay un canal con costo razonable sin anunciar el medicamento | Panel, con gasto por canal | Costo por paciente menor de $1,800 |
| HC6 | El modelo es legalmente viable | Opinión legal y médicos firmados | Opinión favorable antes del primer paciente |
| HC7 | El formato grupal cuesta menos sin perder eficacia | Costos de operación | Retención similar con 30% o más de ahorro |
| HC8 | Los médicos ven valor en delegar el seguimiento | Panel, con códigos `ref` | 3 o más códigos de médico con registros |

**Reglas de decisión en la semana 16**

- Construir el producto solo si se cumplen HC1, HC4, HC5 y HC6.
- Pivotar hacia la herramienta para médicos o hacia empresas si fallan HC1 o HC5, pero se cumplen HC2 y HC8.
- Detener si falla HC2: el problema no sería el que se cree.

**Cómo se mide hoy**

- Tres eventos sin cookies: `landing_view`, `cta_click` y `waitlist_submit`. Una restricción de la base fija esa lista.
- La sesión vive en la pestaña; la misma persona en dos días cuenta dos veces. Sirve para comparar canales.
- El registro guarda `utm_source`, `utm_medium`, `utm_campaign` y `ref`. Un `ref` cuenta como canal Médico; sin nada, Directo.
- El costo por paciente es el gasto del canal entre pacientes activados de ese canal. El gasto se captura a mano en Panel › Costos.
- Toda liga que el CMO publique lleva UTM o `ref`. Si no, el canal no se mide.

**Para experimentos**

- Sin tocar código: la variante va en `utm_campaign`, por ejemplo `fundadores-mantener-v1`, de 120 caracteres o menos.
- Una página nueva, como una landing para médicos, reutiliza los componentes y se distingue por UTM.
- Un A/B en la misma URL, o un evento nuevo, exige migración, pruebas de permisos y aprobación. Va al final de la lista.
- Con menos de 10 pacientes por cohorte, un paciente mueve la retención más de 10 puntos. Cada lectura reporta el n.
- Ninguna herramienta de terceros recibe datos de salud ni eventos del cuestionario o del portal (sección 8).

## 5. Competencia y referentes

El «programa en línea con medicamento» ya está saturado, y el acompañamiento emocional ya no es único. El hueco defendible es demostrar retención y mantenimiento con datos, no ofrecer más servicios.

| Competidor | Modelo y precio publicado | Lo que comunica | Hueco observable |
| --- | --- | --- | --- |
| [Clivi](https://www.clivi.com.mx/obesidad/) | Clínica digital con farmacia propia; desde $5,499 al mes | Más de 15,000 pacientes, 71% de retención anual, WhatsApp 24/7 con IA | Precio alto; centrado en diabetes; cifras autodeclaradas |
| [Helsi](https://helsi.mx/) | Telemedicina con medicamento incluido; desde $3,999 al mes | Acompañamiento emocional | Mensaje casi igual a la tesis original de Lunes |
| [OneMed](https://www.onemed.mx/) | Marketplace de médicos; programa desde $1,000 al mes más medicamento | Receta en 24 h; contenido SEO de precios | Poco acompañamiento integral |
| [Zelta](https://soyzelta.com/blog/wegovy-precio-mexico-2026) | Telemedicina con medicamento incluido; $3,699 a $5,699 al mes | Precio todo incluido | No determinado |
| [GLP1 Center](https://glp1.com.mx/) | Híbrido con sedes; $990 a $3,490 al mes más medicamento | Atención presencial y en línea | Cobertura física limitada |
| [Obesity Health](https://www.obesityhealth.com.mx/glp1ohonline) | Clínica bariátrica con programa en línea | Sesiones grupales gratuitas | Embudo hacia cirugía |
| [Ligerix](https://ligerix.com/) y [Revert](https://www.revert.com.mx/blog/foundayo-donde-comprar/) | Clínica digital y contenido educativo | Chat médico 24/7; contenido | Sin datos de precio |

Precios tomados de los sitios en octubre de 2026; pueden ser promocionales. Sustitutos: el especialista privado con WhatsApp, los programas de descuento de los laboratorios y el mercado informal.

**Implicaciones para el posicionamiento**

- No competir en precio del medicamento ni en volumen de pauta.
- Ser dueños de «lo que sigue después de empezar»: los 12 lunes, el plan semanal y la revisión con datos.
- Publicar resultados del piloto solo cuando existan, con su n y su método.

**Referentes de diseño ya usados** (detalle en `docs/DISENO.md`)

| Referente | Qué tomamos |
| --- | --- |
| Apple Health | Titular de dos tiempos, cifras con fuente y sección de privacidad |
| WHOOP | Paleta casi monocroma con un acento, precio con lo incluido, la racha como motor |
| Calibrate | Quitar el estigma de la fuerza de voluntad |
| Found | Qué esperar semana por semana |
| Oura | Titulares en peso medio y transparencia de fuentes |

Ro y Hims & Hers pidieron verificación anti-bots y no se evadió. Lo que no tomamos: fotografía de producto, testimonios y urgencia artificial. El CMO actualiza este benchmark en la etapa 0, con capturas y fecha.

## 6. La marca hoy

Lunes tiene idea, sistema visual y tono definidos, pero casi ningún asset: no hay fotografía, ilustración, imagen para compartir en redes ni piezas sociales. Ese es el hueco visual que el CMO debe llenar.

**La idea.** «El lunes empiezo» es la promesa que casi todos se han hecho y roto. Lunes la vuelve método: doce lunes, un check-in cada lunes y alguien que lo revisa. Son 3 meses de 4 lunes. «Lunes» es nombre de trabajo: falta el dominio y el registro ante el IMPI. El nombre cambia con `NEXT_PUBLIC_BRAND_NAME`.

**Principios de diseño, en orden:** claridad antes que persuasión; una decisión por pantalla; calma; confianza demostrable.

| Token | Valor | Uso |
| --- | --- | --- |
| tinta | #141C33 | Texto principal y botones; el añil de la marca |
| tinta-2 | #3D4763 | Texto secundario |
| piedra | #5E687A | Texto de apoyo |
| niebla | #F3F5F2 | Secciones alternas y superficies |
| linea | #E2E6E1 | Divisiones finas |
| jade | #0F7A64 | Lunes registrado, progreso y éxito |
| rosa | #C8245C | Solo «este lunes» y el foco del teclado |
| alerta y aviso | #B42318 y #8A5300 | Señal de alarma y revisar con médico |

- **Tipografía:** Hanken Grotesk, una sola familia. Titulares a 500 con tracking de −0.03em; texto a 18 px.
- **Forma:** radios de 24 px en bloques, 14 px en campos, botones en píldora. Sin sombras ni degradados.
- **Movimiento:** solo el llenado de la tira de 12 lunes y transiciones de 150 ms. Respeta «reducir movimiento».
- **Tono:** tú, frases cortas, mayúsculas solo al inicio. Sin etiquetas en mayúsculas, sin flechas en botones, sin urgencia artificial.

**Assets que existen**

| Asset | Dónde |
| --- | --- |
| Marca de 12 puntos en rejilla de 4 × 3, el primero en rosa | `Mark` en `src/components/site-chrome.tsx` y `src/app/icon.svg` |
| Logotipo: marca más nombre | `Wordmark`, mismo archivo |
| Tira de 12 lunes con hitos en las semanas 1, 2, 4, 8 y 12 | `src/components/twelve-mondays.tsx` |
| Iconos de línea propios, unos 20 | `src/components/ui/icon.tsx` |
| Gráfica de peso del portal | `src/components/weight-chart.tsx` |

**Lo que falta**

- Imagen para compartir (Open Graph) de la landing: hoy un enlace en WhatsApp se ve sin imagen.
- Ilustración o fotografía para la portada y las secciones.
- Piezas para redes, WhatsApp y el kit para médicos.
- Guía de uso de la marca para terceros.
- Limpieza: `public/` aún tiene los SVG de ejemplo de Next.js, sin uso.

**Mensajes en la landing hoy** (todos en `src/content/landing.ts`)

- Titular: «El lunes empiezas. Los once que siguen, te acompañamos.»
- Bajada: seguimiento médico y nutricional, un check-in de dos minutos cada lunes y un equipo que lo revisa.
- Cifras: 75% de los adultos con sobrepeso u obesidad; 1 de 2 deja el medicamento antes de un año.
- Cierre de cifras: «No es falta de fuerza de voluntad» (ver la tensión de la sección 3).
- Confianza: médicos con cédula, datos protegidos, hoy no cobramos. CTA único: «Apartar mi lugar».

## 7. Estado técnico y reglas para tocar código

El producto funciona de punta a punta en modo demo. El CMO trabaja sobre textos, secciones de presentación y assets. La lógica, los datos y el acceso se quedan como están.

| Pieza | Hoy |
| --- | --- |
| Framework | Next.js 16.4 con App Router y Turbopack, React 19, TypeScript |
| Estilos | Tailwind v4 con los tokens en `src/app/globals.css` |
| Datos | Supabase con permisos por fila; en la demo, datos ficticios en memoria |
| Acceso | Código de 6 dígitos por correo |
| Correo | Resend; recordatorios diarios con Vercel Cron a las 16:00 UTC |
| Analítica | Eventos propios sin cookies y Vercel Analytics solo en páginas públicas |
| Hosting | Vercel, proyecto `lunes-piloto`, plan Hobby |
| Repositorio | GitHub, rama `main`; Vercel publica cada cambio en `main` |

| Ruta | Qué es | ¿La toca el CMO? |
| --- | --- | --- |
| `/` | Landing con lista de espera | Sí: textos, secciones y assets |
| `/tamizaje/[token]` | Cuestionario de 5 pasos | Solo textos no clínicos, con aprobación |
| `/login`, `/portal` | Acceso y portal del paciente | Rara vez |
| `/panel/*` | Resumen, hoy, lista de espera, pacientes y costos | No; solo lee métricas |
| `/aviso-de-privacidad`, `/terminos` | Borradores legales | No, sin abogado |
| `/api/events`, `/api/cron/recordatorios` | Eventos y recordatorios | No |

**Dónde va cada cosa**

- Textos: `src/content/landing.ts`. Ningún texto de marketing va escrito dentro de un componente.
- Secciones: `src/components/landing/`. Piezas base: `src/components/ui/`; se reutilizan, no se duplican.
- Assets: `public/brand/`, en `og/`, `ilustraciones/`, `fondos/` y `social/`. SVG cuando se pueda; WebP o AVIF para lo demás, con `next/image`.
- Páginas nuevas, como una landing para médicos: `src/app/<ruta>/page.tsx`, con `SiteHeader`, `SiteFooter` y las secciones existentes.
- Esta versión de Next.js cambia APIs: antes de escribir código se lee `AGENTS.md` y la guía en `node_modules/next/dist/docs/`.

**Cuándo un cambio está terminado**

1. Es pequeño, complementa lo existente y no cambia comportamiento fuera de su alcance.
2. `npm run check` pasa: lint, tipos y 42 pruebas unitarias y de permisos.
3. `npm run test:e2e` pasa: 6 recorridos en celular y escritorio. Las pruebas buscan textos como «El lunes empiezas.» y «Apartar mi lugar»; si cambian, se actualizan en el mismo cambio.
4. `npm run test:a11y` da cero violaciones de axe en celular, tableta y escritorio.
5. Rendimiento en celular con 4G: LCP menor de 2.5 s y CLS menor de 0.1. Toda imagen lleva ancho y alto.
6. Capturas antes y después en celular y escritorio, revisadas a ojo.
7. Cambiar datos, acceso, eventos o permisos exige migración, pruebas de permisos y aprobación del fundador.

**Cómo llega el código a GitHub.** Desde la nube no se puede subir directo. El agente hace commit, genera un bundle de git y lo copia a `~/Documents` en la Mac del fundador. Ahí el fundador corre `bash ~/Documents/subir-piloto.sh`, que integra y sube. Si una sesión tiene acceso a GitHub, usa una rama y un pull request.

**Demo y secretos.** La demo vive en [lunes-piloto.vercel.app](https://lunes-piloto.vercel.app) con `DEMO_MODE=true`; sus datos se borran solos. Las llaves y variables las captura el fundador en Vercel o Supabase, nunca por el chat.

## 8. Límites legales y éticos

Nada que ofrezca el servicio sale al público antes de la puerta legal: opinión de un abogado sanitario y un médico con cédula firmado (HC6). Antes de eso se preparan borradores, se entrevista con consentimiento y se prueba sobre la demo.

| Regla | Por qué |
| --- | --- |
| No nombrar marcas ni sustancias de medicamentos en landing, redes, anuncios ni piezas. Se dice «medicamento para bajar de peso». | COFEPRIS vigila la publicidad de medicamentos de receta y retiró más de 31,000 anuncios en 2026. |
| No prometer kilos, plazos ni resultados. Nada de «fácil», «rápido» o «garantizado». | Meta bloquea afirmaciones de resultado; un anuncio de telesalud para bajar de peso cayó por decir «easy weight loss». |
| No antes y después, ni imágenes que hagan sentir mal con el cuerpo: grasa pellizcada, cintas apretando, báscula como castigo. | Política de Meta y principio de marca: el estigma es parte del problema. |
| No testimonios inventados, ni actores o imágenes generadas presentados como pacientes reales. | Sería engañoso. Ilustración y foto de banco sí, sin presentarlas como casos. |
| No afirmar un médico, una cédula, una alianza o un resultado que no exista y esté firmado. | Hoy no hay médico aliado ni resultados del piloto. |
| Ningún píxel, SDK o herramienta de terceros en `/tamizaje`, `/portal` o `/panel`. Ningún evento de salud a plataformas de anuncios; ninguna audiencia por condición de salud. | Los datos de salud son datos sensibles bajo la ley de protección de datos; el aviso promete no compartirlos con anunciantes. |
| No pagar ni premiar a médicos por referir pacientes sin opinión legal. | Los incentivos ligados a recetas son una brecha legal abierta de la investigación. |
| Todo contenido sobre síntomas remite al médico. Urgencias al 911; crisis emocional a la Línea de la Vida, 800 911 2000. | Seguridad del paciente; ya está así en el producto. |
| Nada de cultura de dieta: sin conteo de calorías, sin «comida prohibida», sin culpa. | El ICP excluye trastornos alimentarios, pero el contenido público lo ven todos. |
| Las entrevistadas siguen anónimas y sus citas son internas. | Acuerdo con las participantes y datos personales. |

**Para validar con el abogado antes de pautar**

- Si la publicidad de Lunes requiere el [aviso de publicidad COFEPRIS-02-002-A](https://papelea.com/mx/estado-de-zacatecas/cofepris-02-002-a-aviso-de-publicidad-modalidad-a-actividades-profesionales-tecnicas-auxiliares-y-especialidades) para servicios de salud. Es gratuito.
- Qué debe mostrar cada anuncio: responsable, cédula, leyendas obligatorias.
- Si Google clasifica a Lunes como servicio de medicamentos de receta. México está en su [lista de países con certificación](https://support.google.com/adspolicy/answer/15598647).
- La [política de salud de Meta](https://adligator.com/blog/meta-health-wellness-ad-policy-update-2026) cambió el 22 de julio de 2026: revisa afirmaciones, no categorías, y exige 18+ con afirmaciones de peso. Confirmar en el [Centro de Transparencia de Meta](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/health-wellness) antes de cada campaña.

## 9. Plan por etapas

El CMO avanza en cinco etapas, cada una con un entregable revisable. Tres puertas detienen el avance hasta cumplirse.

```
0. Inmersión (semana 1)
1. Estrategia (semana 2)
   ◆ Puerta: el fundador aprueba el posicionamiento
2. Identidad (semanas 3 y 4)
   ◆ Puerta legal antes de publicar o pautar
3. Contenido (semanas 4 a 6)
4. Experimentos (desde la semana 6)
   ◆ Decisión del piloto con HC1 a HC8
```

La etapa 2 puede producir assets antes de la puerta legal; la etapa 3 los publica solo después.

| Etapa | Entregables | Terminada cuando |
| --- | --- | --- |
| 0. Inmersión | Auditoría de landing, cuestionario, portal, correos, metadatos y vista de un enlace en WhatsApp. Benchmark de 6 a 10 referentes con capturas y fecha. Hallazgos priorizados por impacto y esfuerzo. | Cada hallazgo tiene evidencia: captura, fuente o métrica. No se tocó código. |
| 1. Estrategia | Posicionamiento: para quién, frente a qué alternativa y con qué prueba. Casa de mensajes con promesa, 3 pilares, pruebas y objeciones por segmento. Tono, con la tensión de la voluntad resuelta. Mapa de canales. Backlog de experimentos. Guion y reclutamiento de entrevistas para HC2. | Cada afirmación cita su fuente o dice «supuesto». El fundador lo aprueba. |
| 2. Identidad | Dirección de imagen: ilustración, fotografía o ambas, con su porqué. Sistema de composición derivado de la rejilla de 12 puntos y la tira de lunes: fondos, patrones y retículas. Imagen para compartir de la landing. Ilustraciones de secciones. Plantillas para redes y WhatsApp. Kit de una página para médicos. Guía de uso de marca. | Assets en `public/brand/` con fuente editable, contraste AA, texto alternativo y peso dentro del presupuesto. Integrados con todas las pruebas en verde. |
| 3. Contenido | Página para médicos con liga `ref`. Variantes de mensaje por `utm_campaign`. Calendario editorial de 4 semanas. Secuencia de WhatsApp y correo para la lista de espera. | Aprobado por el fundador; lo de salud, por el médico; lo publicitario, por el abogado. Toda liga lleva UTM o `ref`. |
| 4. Experimentos | 2 o 3 experimentos a la vez. Reporte semanal: tráfico por canal, visitante a lista, lista a cuestionario, costo por canal y hallazgos de entrevistas. | Cada experimento cierra con una decisión escrita: escalar, iterar o parar. Lo aprendido vuelve a la casa de mensajes. |

**Plantilla de experimento**

- **Hipótesis:** si [cambio] para [segmento], [métrica] pasa de [x] a [y], porque [evidencia].
- **Hipótesis crítica que mueve:** HC1, HC2, HC5 o HC8.
- **Métrica y umbral:** fijados antes de empezar.
- **Muestra y duración:** n mínimo y fecha de corte.
- **Costo:** dinero y horas, registrados en Panel › Costos.
- **Límites:** lo que no puede empeorar y las reglas de la sección 8.
- **Decisión:** escalar, iterar o parar, con fecha.

**Primeros candidatos del backlog** (se validan en la etapa 1; no están decididos)

1. «Mantener» contra «empezar acompañado» como promesa principal, con variantes por `utm_campaign`. Mueve HC2 y HC1.
2. Página y kit para médicos, con una liga `ref` por médico. Mueve HC8 y HC5.
3. Imagen y texto para compartir por WhatsApp entre pacientes. Mueve HC5.
4. «La voluntad es tuya; el plan y el acompañamiento, nuestros» frente al cierre actual. Primero en entrevistas y creativos; en la página, solo con A/B aprobado.
5. Contenido educativo sobre efectos y alimentación en comunidades. Mueve HC5 a bajo costo.

## 10. Huecos, riesgos y preguntas abiertas

El mayor riesgo para el CMO es invertir en marca y assets antes de confirmar el nombre, el médico y la puerta legal. Lo que sigue va en orden de impacto.

| Tema | Riesgo o hueco | Qué hacer |
| --- | --- | --- |
| Nombre | «Lunes» es nombre de trabajo, sin dominio ni registro ante el IMPI. | Assets con el nombre en una capa editable; confirmar antes de cerrar la etapa 2. |
| Puerta legal | Sin abogado sanitario ni responsable del aviso con domicilio. | Nada público hasta tenerlos; preparar todo como borrador. |
| Médico aliado | No hay médico con cédula firmado, y la landing promete «médicos con cédula». | No mostrar nombres ni cédulas hasta que exista; el kit para médicos también sirve para reclutarlo. |
| Datos reales | La demo guarda en memoria; no hay tráfico ni línea base. | Las líneas base empiezan con Supabase y el dominio; antes, solo entrevistas y pruebas cualitativas. |
| Cifra de la landing | La landing dice 75% (ENSANUT 2020–2023); la investigación usa 76.2% (ENSANUT Continua 2023). | Unificar con la fuente primaria más reciente. |
| ICP | Dos entrevistas y ninguna persona que abandonó. | Entrevistas de HC2 antes de fijar el posicionamiento. |
| Formato digital | La paciente entrevistada prefiere lo presencial (HC3). | Mostrar personas reales y disponibles; probar el mensaje en entrevistas. |
| Psicología | La tesis original la pone al centro, pero el piloto no la incluye. | No prometerla; tratar el ánimo como parte del check-in. |
| Hosting | El plan Hobby de Vercel es para uso no comercial. | Pasar a Pro antes de lanzar con precio; lo decide el fundador. |
| GitHub | Desde la nube no se puede subir código directo. | Usar el bundle y el script del fundador (sección 7). |

**Preguntas para el fundador en la etapa 0**

- [ ] ¿Cuál es el presupuesto mensual para pauta, herramientas e imágenes?
- [ ] ¿Existen cuentas de redes o WhatsApp Business con el nombre? ¿Quién las opera?
- [ ] ¿Quién responde mensajes de interesados y en qué horario?
- [ ] ¿Hay médicos que ya conozcan el proyecto y quieran referir?
- [ ] ¿Hay fecha objetivo para abrir la lista de espera?
- [ ] ¿Se confirma «Lunes» o se exploran alternativas de nombre?

## 11. Fuentes

**Del proyecto**

| Fuente | Dónde |
| --- | --- |
| Repositorio | [github.com/5-silva/piloto-obesidad](https://github.com/5-silva/piloto-obesidad), rama `main` |
| Copia de este brief | `docs/cmo/BRIEF.md` |
| Investigación de mercado, anonimizada | `docs/research/market-research.md` |
| Hallazgos y citas de entrevistas, anonimizados | `docs/research/entrevistas.md` |
| Notas iniciales del negocio | `docs/research/notas-iniciales.md` |
| Estado, diseño, métricas y contenido clínico | `STATUS.md`, `docs/DISENO.md`, `docs/METRICAS.md`, `docs/CONTENIDO-CLINICO.md` |
| Definición del agente CMO | `.claude/agents/cmo.md` |
| Demo en vivo | [lunes-piloto.vercel.app](https://lunes-piloto.vercel.app) |
| Plan del piloto | [Doc del plan](https://claude.ai/artifact/M6TCuzsPgF9ZdYqdcm31Wt) |
| Deck y guion de presentación | [Deck](https://claude.ai/artifact/VET19gqBWeYCxnSE4w9djN) y [guion](https://claude.ai/artifact/Vy6izMBnWKtkt1j6Pk3Ubu) |

Las transcripciones completas de las entrevistas no están en el repositorio. Las guarda el fundador.

**Externas citadas en este brief**

- [ENSANUT, Instituto Nacional de Salud Pública](https://ensanut.insp.mx/)
- [Thomsen y cols., EASD 2025: abandono del medicamento antes de un año](https://www.news-medical.net/news/20250915/StudyHalf-of-adults-without-diabetes-taking-weight-loss-drug-discontinue-treatment-within-a-year.aspx)
- [Meta, política de salud y bienestar](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/health-wellness) y [resumen del cambio de julio de 2026](https://adligator.com/blog/meta-health-wellness-ad-policy-update-2026)
- [Google Ads, servicios de medicamentos de receta](https://support.google.com/adspolicy/answer/15598647)
- [COFEPRIS-02-002-A, aviso de publicidad de servicios de salud](https://papelea.com/mx/estado-de-zacatecas/cofepris-02-002-a-aviso-de-publicidad-modalidad-a-actividades-profesionales-tecnicas-auxiliares-y-especialidades)
- Sitios de competidores enlazados en la sección 5, consultados en octubre de 2026.
- El resto de las cifras de mercado viene de la investigación, con sus fuentes y su nivel de confianza.
