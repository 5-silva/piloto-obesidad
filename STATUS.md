# Estado del piloto

Actualizado: 25 de octubre de 2026.

## Listo

- Esquema de base de datos con permisos por fila; 13 pruebas de permisos aprueban.
- Landing con lista de espera, canal de origen y analítica sin cookies.
- Aviso de privacidad y términos (borradores para el abogado).
- Cuestionario de tamizaje con consentimiento expreso y reglas de elegibilidad.
- Panel del equipo: resumen con HC1–HC8, lista diaria, lista de espera, pacientes, costos.
- Portal del paciente con acceso por código, check-in semanal, orientación y gráfica.
- Recordatorios por correo (días 1 y 5) con Vercel Cron.
- 42 pruebas unitarias y de permisos, y 6 recorridos de punta a punta (celular y escritorio).
- Documentación: puesta en marcha, operación, métricas y contenido clínico.
- Rediseño de UI/UX con sistema visual propio (docs/DISENO.md). Cuestionario y check-in van por pasos. Sin violaciones de accesibilidad (axe) en celular, tableta y escritorio, y recorridos e2e en celular y escritorio.
- Auditoría de accesibilidad reproducible: `npm run test:a11y` revisa con axe las páginas públicas, el cuestionario, el portal y el panel en celular, tableta y escritorio.
- Traspaso al agente CMO: brief en `docs/cmo/BRIEF.md`, investigación anonimizada en `docs/research/` y definición del agente en `.claude/agents/cmo.md`.

## Demo publicada

https://lunes-piloto.vercel.app (Vercel, plan Hobby, `DEMO_MODE=true`). Usa datos ficticios en memoria: lo que se registre puede borrarse en cualquier momento. Para entrar: `/login` con cualquier correo y el código `123456`, o con los botones de demo.

## Bloqueos

| Bloqueo | Quién | Bloquea |
|---|---|---|
| Sesión iniciada en Vercel y Supabase en el navegador de la app | Diego | Configurar los servicios |
| Dominio para «Lunes» | Equipo | Correos, aviso de privacidad, publicación |
| Abogado sanitario y responsable del aviso con domicilio | Equipo | Abrir la lista de espera |
| Médico aliado con cédula | Equipo | Aprobar contenido clínico y primer paciente |

## Decisiones pendientes

- Nombre de marca: «Lunes» como nombre de trabajo; falta confirmar dominio y registro de marca ante el IMPI.
- Pasarela de pago (Mercado Pago recomendado), después del visto bueno legal.
- Tiempo máximo de respuesta a alertas (lo define el médico).

## Siguientes pasos

1. Crear el proyecto de Supabase, correr la migración y configurar el código por correo.
2. Prueba real de punta a punta con una cuenta del equipo.
3. Auditoría de privacidad con REA sobre la demo publicada.
4. Abrir la lista de espera cuando el aviso esté aprobado.
