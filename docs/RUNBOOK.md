# Operación del piloto

## Todos los días (menos de 10 minutos)

Abre **Panel › Hoy** y trabaja de arriba abajo:

1. **Alertas de check-in.** Escríbele hoy a cada persona (botón «Escribir»). Si marcó una señal de alarma, avisa al médico en cuanto la leas; el médico decide si necesita valoración o urgencias. Si la persona menciona hacerse daño, dale la Línea de la Vida (800 911 2000, 24 horas) y avisa al médico de inmediato.
2. **Nuevos en la lista.** «Primer mensaje» abre WhatsApp con el saludo y la liga del cuestionario. Después pulsa «Ya le escribí».
3. **Por agendar valoración.** Quien sale «Apto» recibe la liga de Cal.com. Quien sale «Revisar con médico» espera el visto bueno del médico antes de agendar; los motivos aparecen en amarillo. Cuando agende, pulsa «Ya agendó».
4. **Sin check-in esta semana.** El sistema manda correo el día 1 y el día 5. A partir del día 5, escribe por WhatsApp.

## Después de cada valoración

Si el médico aprueba el programa: **Lista de espera › la persona › Activar como paciente**, con la fecha en que empieza su semana 1. Eso crea su acceso al portal. Avísale que entra en `/login` con su correo y un código.

Si no lo aprueba: cambia el estado a «Descartado» y anota el motivo general en notas (sin datos clínicos).

## Cada lunes

- Registra en **Costos por canal** lo gastado la semana anterior (anuncios, materiales) y las horas del equipo por canal.
- Revisa el **Resumen**: retención, check-ins de la semana y costo por paciente. Anota en el registro de aprendizajes qué cambiaron y por qué.

## Bajas y pausas

En el paciente, cambia el estado y escribe el motivo («costo del medicamento», «horario», «efectos secundarios»). Es el dato que explica la retención en la semana 16.

## Derechos ARCO y borrado de datos

Responde en máximo 20 días hábiles. Para borrar a una persona, en Supabase › SQL Editor (reemplaza el correo):

```sql
-- Revisa primero qué se va a borrar
select id, name, status from public.leads where email = 'persona@correo.mx';
-- Borra lead, tamizaje, paciente y check-ins (en cascada) y su acceso
delete from public.patients where email = 'persona@correo.mx';
delete from public.leads where email = 'persona@correo.mx';
delete from auth.users where email = 'persona@correo.mx';
```

Los eventos de la landing no tienen datos personales y no se borran.

## Incidentes

- **El sitio no carga.** Revisa el estado del último despliegue en Vercel y vuelve al anterior con «Promote to Production».
- **No llegan los códigos de acceso.** Revisa en Resend › Logs si salieron; revisa spam. Como último recurso, en Supabase › Users puedes enviar un enlace mágico manual.
- **Sospecha de acceso indebido a datos.** Cambia de inmediato la `SUPABASE_SECRET_KEY` (Supabase › API Keys › Roll), actualízala en Vercel y vuelve a desplegar. Documenta qué pasó y avisa al abogado: la ley obliga a informar a las personas afectadas si la vulneración afecta sus derechos de forma significativa.
- **Restaurar datos.** Supabase › Database › Backups (requiere plan Pro).

## Auditoría de privacidad con REA

Antes de abrir la lista de espera y después de cada cambio que agregue scripts o servicios externos:

1. En tu computadora, con REA instalado en Claude Code, pide: «Audita las peticiones de red de https://tudominio.mx, /tamizaje/<una liga de prueba> y /portal. Lista cada dominio externo, qué datos recibe y si alguna petición incluye datos del formulario».
2. Resultado esperado: solo tu dominio, Vercel (`/_vercel/insights`) y, al agendar, Cal.com. Ninguna petición externa con peso, enfermedades o respuestas del cuestionario.
3. Guarda el reporte con fecha junto a los documentos del piloto.

REA se usa solo con nuestro propio sitio.
