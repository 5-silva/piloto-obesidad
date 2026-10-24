# Estado del piloto

Actualizado: 24 de octubre de 2026.

## Listo

- Esquema de base de datos con permisos por fila; 13 pruebas de permisos aprueban.
- Landing con lista de espera, canal de origen y analítica sin cookies.
- Aviso de privacidad y términos (borradores para el abogado).
- Cuestionario de tamizaje con consentimiento expreso y reglas de elegibilidad.
- Panel del equipo: resumen con HC1–HC8, lista diaria, lista de espera, pacientes, costos.
- Portal del paciente con acceso por código, check-in semanal, orientación y gráfica.
- Recordatorios por correo (días 1 y 5) con Vercel Cron.
- 41 pruebas unitarias y 3 recorridos de punta a punta en celular emulado.
- Documentación: puesta en marcha, operación, métricas y contenido clínico.

## Bloqueos

| Bloqueo | Quién | Bloquea |
|---|---|---|
| Repositorio `5-silva/piloto-obesidad` en GitHub | Diego | Publicar en Vercel |
| Sesión iniciada en Vercel y Supabase en el navegador de la app | Diego | Configurar los servicios |
| Dominio para «Lunes» | Equipo | Correos, aviso de privacidad, publicación |
| Abogado sanitario y responsable del aviso con domicilio | Equipo | Abrir la lista de espera |
| Médico aliado con cédula | Equipo | Aprobar contenido clínico y primer paciente |

## Decisiones pendientes

- Nombre de marca: «Lunes» como nombre de trabajo; falta confirmar dominio y registro de marca ante el IMPI.
- Pasarela de pago (Mercado Pago recomendado), después del visto bueno legal.
- Tiempo máximo de respuesta a alertas (lo define el médico).

## Siguientes pasos

1. Conectar el repositorio y publicar la demo en Vercel.
2. Crear el proyecto de Supabase, correr la migración y configurar el código por correo.
3. Prueba real de punta a punta con una cuenta del equipo.
4. Auditoría de privacidad con REA.
5. Abrir la lista de espera cuando el aviso esté aprobado.
