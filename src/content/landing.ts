// Textos de la landing. Puedes editarlos aquí sin tocar el diseño.
// Reglas: no nombrar marcas de medicamentos (COFEPRIS), no prometer kilos ni
// resultados, y dejar claro que hoy no cobramos y que no vendemos medicamento.
// Pendiente: revisión del médico responsable y del abogado antes de publicar.

export const hero = {
  title: "Tu tratamiento para el peso, con alguien al pendiente cada semana",
  lead:
    "Médico con cédula, nutrióloga y un check-in de 2 minutos a la semana, por videollamada y WhatsApp. Para quienes ya usan o van a iniciar un medicamento para bajar de peso.",
  cta: "Unirme a la lista de espera",
};

/** Lo que pasa en las 12 semanas. Las semanas sin hito solo llevan check-in. */
export const milestones: Record<number, { title: string; detail: string }> = {
  1: { title: "Valoración médica", detail: "Por videollamada, con un médico con cédula profesional." },
  2: { title: "Plan de alimentación", detail: "Proteína, hidratación y cómo manejar los síntomas." },
  4: { title: "Primera revisión", detail: "El médico revisa cómo vas y ajusta contigo." },
  8: { title: "Ajuste del plan", detail: "Lo que funciona se queda; lo que no, se cambia." },
  12: { title: "Revisión final", detail: "Repasan juntos tus resultados y el siguiente paso." },
};

export const steps = [
  {
    title: "Contestas un cuestionario de 5 minutos",
    body: "Nos dice si el programa es para ti y qué debe revisar el médico.",
  },
  {
    title: "Un médico te valora por videollamada",
    body: "Decide contigo si el tratamiento te conviene. Si te receta, compras el medicamento en tu farmacia.",
  },
  {
    title: "Cada lunes registras cómo vas",
    body: "Peso, síntomas y ánimo en 2 minutos. El equipo lo revisa y te escribe si algo no está bien.",
  },
  {
    title: "En la semana 12 revisan tus resultados",
    body: "Con datos de cada semana, no de memoria, deciden el siguiente paso.",
  },
];

export const includes = [
  "Valoración inicial y revisiones con médico, por videollamada",
  "Plan de alimentación con nutrióloga, pensado para tu tratamiento",
  "Check-in semanal y seguimiento del equipo",
  "WhatsApp con el equipo en horario de oficina",
  "Guía de ejercicios de fuerza para cuidar tu músculo",
];

export const excludes = [
  "El medicamento: lo compras tú con tu receta",
  "Estudios de laboratorio",
  "Atención de urgencias: en una urgencia llama al 911",
];

export const forWho = [
  "Tienes 18 años o más",
  "Tu IMC es de 30 o más, o de 27 o más con presión alta, prediabetes, colesterol alto u otra enfermedad relacionada",
  "Ya usas o quieres iniciar un medicamento para bajar de peso con supervisión médica",
];

export const notForWho = [
  "Si estás embarazada, buscas un embarazo o das pecho",
  "Si tienes o tuviste un trastorno de la conducta alimentaria",
  "Si buscas que te vendan el medicamento sin valoración",
];

export const faq = [
  {
    q: "¿Venden el medicamento?",
    a: "No. El médico te valora y, si lo considera adecuado, te da una receta. Tú compras el medicamento en la farmacia que prefieras. Nosotros te acompañamos durante el tratamiento.",
  },
  {
    q: "¿Por qué hay lista de espera?",
    a: "Estamos abriendo un grupo pequeño de pacientes fundadores para dar un seguimiento cercano. Te escribimos por WhatsApp cuando haya lugar.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "El plan fundador cuesta {precio} al mes y no incluye el medicamento. Hoy no cobramos nada: solo te anotas en la lista.",
  },
  {
    q: "¿Atienden en todo México?",
    a: "Sí. Todo es por videollamada y WhatsApp, así que puedes estar en cualquier estado.",
  },
  {
    q: "¿Qué hacen con mis datos?",
    a: "Los usamos solo para darte el servicio. Tus datos de salud se guardan con acceso restringido y nunca se comparten con anunciantes. Los detalles están en el aviso de privacidad.",
  },
  {
    q: "¿Puedo dejar el programa?",
    a: "Sí, cuando quieras. Solo avísanos por WhatsApp.",
  },
];

export const doctors = {
  title: "¿Eres médico?",
  body:
    "Si tienes pacientes que usan un medicamento para el peso y necesitan seguimiento entre consultas, podemos acompañarlos. Tú sigues a cargo del tratamiento y recibes un resumen de su avance.",
  cta: "Escribirnos",
};
