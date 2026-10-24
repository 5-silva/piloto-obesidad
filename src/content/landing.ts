// Textos de la landing. Puedes editarlos aquí sin tocar el diseño.
// Reglas: no nombrar marcas ni sustancias de medicamentos (COFEPRIS), no prometer
// kilos ni resultados, y dejar claro que hoy no cobramos y que no vendemos medicamento.
// Pendiente: revisión del médico responsable y del abogado antes de publicar.

export const hero = {
  kicker: "Plan fundador para 30 personas",
  title: "El lunes empiezas. Los once que siguen, te acompañamos.",
  lead: "Seguimiento médico y nutricional para quienes usan o van a iniciar un medicamento para bajar de peso. Un check-in de dos minutos cada lunes y un equipo que lo revisa.",
  cta: "Apartar mi lugar",
  secondary: "Ver cómo funciona",
  trust: [
    { icon: "stethoscope", text: "Médicos con cédula profesional" },
    { icon: "lock", text: "Tus datos de salud, protegidos" },
    { icon: "calendar", text: "Hoy no cobramos nada" },
  ],
} as const;

/** Cifras con fuente (ver SOURCES en site-chrome). */
export const evidence = {
  stats: [
    { value: "75%", label: "de los adultos en México vive con sobrepeso u obesidad.", source: 1 },
    { value: "1 de 2", label: "personas que inician un medicamento para bajar de peso lo deja antes de un año.", source: 2 },
  ],
  close: "No es falta de fuerza de voluntad. Empezar es lo fácil; {marca} existe para acompañarte en todo lo que sigue.",
};

export const steps = [
  {
    title: "Contestas un cuestionario",
    body: "Cinco minutos para saber si el programa es para ti y qué debe revisar el médico.",
  },
  {
    title: "Te valora un médico",
    body: "Por videollamada. Decide contigo si el tratamiento te conviene; si te receta, compras el medicamento en tu farmacia.",
  },
  {
    title: "Cada lunes nos cuentas cómo vas",
    body: "Peso, síntomas y ánimo en dos minutos. El equipo lo revisa y te escribe si algo no está bien.",
  },
  {
    title: "En el lunes 12 revisan resultados",
    body: "Con datos de cada semana, no de memoria, decides con tu médico el siguiente paso.",
  },
];

/** Hitos dentro de los 12 lunes (los mismos de la tira). */
export const milestones = [
  { week: 1, title: "Valoración médica", body: "Por videollamada, con un médico con cédula." },
  { week: 2, title: "Plan de alimentación", body: "Proteína, hidratación y cómo manejar los síntomas." },
  { week: 4, title: "Primera revisión", body: "El médico revisa cómo vas y ajusta contigo." },
  { week: 8, title: "Ajuste del plan", body: "Lo que funciona se queda; lo que no, se cambia." },
  { week: 12, title: "Revisión final", body: "Repasan tus resultados y el siguiente paso." },
];

/** Lo incluido: frase en negritas y explicación. */
export const includes = [
  { lead: "Médico.", body: "Valoración inicial y revisiones por videollamada." },
  { lead: "Nutrióloga.", body: "Un plan de alimentación pensado para tu tratamiento." },
  { lead: "Check-in cada lunes.", body: "Dos minutos para registrar cómo vas; el equipo lo revisa." },
  { lead: "WhatsApp.", body: "Resolvemos tus dudas en horario de oficina." },
  { lead: "Fuerza.", body: "Una guía de ejercicios para cuidar tu músculo mientras bajas de peso." },
];

export const excludes = [
  "El medicamento: lo compras tú, con tu receta",
  "Estudios de laboratorio",
  "Atención de urgencias: en una urgencia llama al 911",
];

export const forWho = [
  "Tienes 18 años o más.",
  "Tu IMC es de 30 o más, o de 27 o más con presión alta, prediabetes, colesterol alto u otra enfermedad relacionada.",
  "Ya usas o quieres iniciar un medicamento para bajar de peso con supervisión médica.",
];

export const notForWho = [
  "Si estás embarazada, buscas un embarazo o das pecho.",
  "Si tienes o tuviste un trastorno de la conducta alimentaria.",
  "Si buscas que te vendan el medicamento sin valoración.",
];

export const privacy = {
  title: "Tu información de salud es tuya",
  lead: "Pedimos solo lo necesario para acompañarte, y lo cuidamos como lo haría tu médico.",
  points: [
    { icon: "lock", title: "Acceso restringido", body: "Solo tú y el equipo que te atiende ven tus datos de salud." },
    { icon: "shield", title: "Sin anunciantes", body: "No compartimos tus datos con anunciantes, farmacias ni laboratorios." },
    { icon: "check", title: "Tú decides", body: "Puedes pedir en cualquier momento que corrijamos o borremos tus datos." },
  ],
} as const;

export const nextSteps = [
  "Te escribimos por WhatsApp en los próximos días.",
  "Contestas el cuestionario de cinco minutos.",
  "Agendas tu valoración por videollamada.",
];

export const faq = [
  {
    q: "¿Venden el medicamento?",
    a: "No. El médico te valora y, si lo considera adecuado, te da una receta. Tú compras el medicamento en la farmacia que prefieras. Nosotros te acompañamos durante el tratamiento.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "El plan fundador cuesta {precio} al mes y no incluye el medicamento. Hoy no cobramos nada: solo apartas tu lugar.",
  },
  {
    q: "¿Por qué hay lista de espera?",
    a: "Abrimos un grupo pequeño de pacientes fundadores para dar un seguimiento cercano. Te escribimos por WhatsApp cuando haya lugar.",
  },
  {
    q: "¿Atienden en todo México?",
    a: "Sí. Todo es por videollamada y WhatsApp, así que puedes estar en cualquier estado.",
  },
  {
    q: "¿Y si ya uso un medicamento?",
    a: "También es para ti. El médico revisa tu tratamiento actual en la valoración y te acompañamos desde ahí.",
  },
  {
    q: "¿Puedo dejar el programa?",
    a: "Sí, cuando quieras y sin penalización. Solo avísanos por WhatsApp.",
  },
];

export const doctors = {
  title: "¿Eres médico?",
  body: "Si tus pacientes usan un medicamento para el peso y necesitan seguimiento entre consultas, podemos acompañarlos. Tú sigues a cargo del tratamiento y recibes un resumen de su avance.",
  cta: "Escribirnos",
};
