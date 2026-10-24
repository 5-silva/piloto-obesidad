# Contenido clínico para aprobación médica

Todo texto con implicación clínica vive en código y aquí se lista para que el médico responsable lo revise. Marca cada punto, anota cambios y fecha. Ningún paciente entra antes de esta aprobación.

Médico responsable: ______________________ Cédula: ____________ Fecha: __________

## 1. Criterios de tamizaje (`src/lib/screening.ts`)

- [ ] **No apto** si: menor de 18 años; IMC < 27; o IMC 27–29.9 sin enfermedad asociada.
- [ ] **Revisar con médico antes de agendar** si marca cualquier pregunta de seguridad, IMC ≥ 40 o edad ≥ 65.
- [ ] **Apto** en cualquier otro caso. El resultado es orientativo; el médico decide en consulta.

Enfermedades asociadas que cuentan para IMC 27–29.9:

- [ ] Hipertensión, dislipidemia, prediabetes o resistencia a la insulina, diabetes tipo 2, hígado graso, apnea del sueño, dolor articular por el peso, síndrome de ovario poliquístico.

Preguntas de seguridad (cada una manda a revisión):

- [ ] Embarazo, búsqueda de embarazo o lactancia.
- [ ] Trastorno de la conducta alimentaria actual o pasado.
- [ ] Antecedente personal o familiar de cáncer medular de tiroides o MEN2.
- [ ] Pancreatitis previa.
- [ ] Litiasis vesicular.
- [ ] Diabetes tipo 1.
- [ ] Uso de insulina o sulfonilureas.
- [ ] ¿Falta alguna? ________________________________

## 2. Check-in semanal (`src/lib/checkin.ts`)

Se genera alerta para el equipo si:

- [ ] Marca una señal de alarma: dolor abdominal fuerte que no se quita; vómito persistente o intolerancia a líquidos; mareo intenso, boca muy seca u orina escasa; otro síntoma que le preocupe mucho.
- [ ] Ánimo «muy mal» (1 de 5).
- [ ] Náusea «mucho» (3 de 3).

Mensajes que ve el paciente al guardar (`src/components/checkin-form.tsx`):

- [ ] Señal de alarma: «Si los síntomas son fuertes ahora, llama al 911 o ve a urgencias. El equipo ya recibió el aviso y te contactará hoy.»
- [ ] Ánimo muy bajo: «Alguien del equipo te escribirá hoy. Si estás pasando por un momento muy difícil o piensas en hacerte daño, llama a la Línea de la Vida al 800 911 2000, las 24 horas.»
- [ ] Náusea fuerte: «Come porciones pequeñas, toma líquidos a sorbos y evita lo muy grasoso. Te escribiremos hoy para revisarlo con el médico antes de tu siguiente dosis.»
- [ ] Mientras marca una señal de alarma: «Si lo tienes ahora y es fuerte, no esperes: llama al 911 o ve a urgencias.»

## 3. Landing (`src/content/landing.ts`)

- [ ] No menciona marcas de medicamentos ni promete kilos o resultados.
- [ ] «Es para ti si» y «Por ahora no es para ti» coinciden con los criterios del punto 1.
- [ ] Lo que incluye el plan (valoración y revisiones médicas, nutrióloga, check-in, WhatsApp, guía de fuerza) es lo que el equipo puede cumplir.

## 4. Protocolo de alertas (`docs/RUNBOOK.md`)

- [ ] Tiempo máximo de respuesta a una alerta: ______ horas en horario hábil.
- [ ] Quién llama al paciente y cuándo se escala al médico.
- [ ] Qué hacer fuera de horario.
