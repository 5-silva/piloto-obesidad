# Puesta en marcha

Orden recomendado. Los pasos marcados con 🔒 llevan llaves secretas: pégalas tú directamente en Vercel o Supabase, nunca en el chat.

## 1. Supabase (base de datos y acceso)

1. Crea el proyecto en la región **East US (North Virginia)**. Guarda la contraseña de la base en tu gestor de contraseñas.
2. En **SQL Editor**, pega y ejecuta `supabase/migrations/20261024000000_init.sql`.
3. En **Authentication › Sign In / Providers › Email**:
   - Email habilitado, **Confirm email** activado.
   - **Allow new users to sign up: desactivado.** Las cuentas de pacientes las crea el panel al activar a alguien; nadie más puede registrarse.
   - Longitud del código (OTP): 6. Vigencia: 600 segundos.
4. En **Authentication › Emails › Templates › Magic Link**, reemplaza el contenido por:
   - Asunto: `Tu código para entrar`
   - Cuerpo:
     ```html
     <p>Tu código para entrar es:</p>
     <p style="font-size:28px;font-weight:bold;letter-spacing:4px">{{ .Token }}</p>
     <p>Vence en 10 minutos. Si no lo pediste, ignora este correo.</p>
     ```
5. 🔒 En **Authentication › Emails › SMTP Settings**, activa SMTP propio con Resend (paso 3): host `smtp.resend.com`, puerto `465`, usuario `resend`, contraseña = tu API key de Resend, remitente `hola@tudominio.mx`.
6. En **Authentication › URL Configuration**, pon el dominio en **Site URL**.
7. En **Project Settings › API Keys** copia la **publishable key** y la **secret key** (la secreta solo va a Vercel).
8. Al recibir al primer paciente, cambia a plan **Pro** y confirma que los respaldos diarios estén activos.

### Dar acceso al equipo

1. **Authentication › Users › Add user › Create new user** con el correo de la persona (marca *Auto confirm*).
2. En SQL Editor:
   ```sql
   insert into public.staff (user_id, name, role)
   select id, 'Nombre Apellido', 'admin' from auth.users where email = 'persona@tudominio.mx';
   ```
   Roles: `admin`, `coordinador`, `medico`. Todos ven el panel completo en el piloto.

## 2. Vercel (sitio)

1. **Add New › Project** e importa el repositorio de GitHub. Framework: Next.js (se detecta solo).
2. 🔒 En **Settings › Environment Variables** (Production y Preview) agrega todas las de `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`
   - `RESEND_API_KEY`, `EMAIL_FROM`, `STAFF_ALERT_EMAIL`
   - `CRON_SECRET`: una cadena larga aleatoria (por ejemplo, de tu gestor de contraseñas)
   - `NEXT_PUBLIC_SITE_URL` con el dominio final, sin diagonal al final
   - Marca, precio, WhatsApp, Cal.com, contacto y datos del responsable del aviso
   - `NEXT_PUBLIC_PAYMENTS_ENABLED=false` hasta el visto bueno legal
3. **Settings › Domains**: agrega el dominio y crea en tu registrador los registros que Vercel indique.
4. Cambia a plan **Pro** antes de publicar la landing con precio (el plan Hobby no permite uso comercial).
5. **Settings › Cron Jobs**: confirma que aparece `/api/cron/recordatorios` diario a las 16:00 UTC (10:00 en CDMX).

### Publicar una demo sin Supabase

Agrega solo `DEMO_MODE=true` y no definas variables de Supabase. Cada página muestra el aviso de datos ficticios. Úsalo para enseñar el flujo, nunca con pacientes reales.

## 3. Resend (correos)

1. Agrega el dominio en **Domains** y crea los registros DNS (SPF, DKIM y MX de retorno) en tu registrador.
2. 🔒 Crea una API key con permiso de envío y pégala en Vercel (`RESEND_API_KEY`) y en el SMTP de Supabase.

## 4. Cal.com (valoraciones)

Crea el evento «Valoración inicial por videollamada» (30 min, Google Meet o Zoom) en la cuenta del médico o del coordinador. Pega la liga pública en `NEXT_PUBLIC_CAL_URL`. El cuestionario muestra el botón de agendar solo a quien resulta apto.

## 5. WhatsApp Business

Un número dedicado al piloto, en `NEXT_PUBLIC_WHATSAPP_NUMBER` (10 dígitos). Los mensajes los manda el equipo desde la app; el panel prepara el texto.

## 6. Antes de abrir la lista de espera

- [ ] Aviso de privacidad revisado por el abogado y con nombre y domicilio reales del responsable.
- [ ] Textos de [CONTENIDO-CLINICO.md](CONTENIDO-CLINICO.md) aprobados por el médico.
- [ ] Prueba real: registrarte, contestar el cuestionario, activarte desde el panel y entrar al portal con el código.
- [ ] Auditoría de privacidad con REA (ver RUNBOOK).

## 7. Antes del primer paciente (puerta legal)

- [ ] Opinión legal sobre el modelo (servicio de acompañamiento, médico independiente, publicidad sin marcas de medicamento).
- [ ] Médico aliado con cédula, convenio firmado y protocolo de alertas acordado.
- [ ] Supabase Pro con respaldos diarios.
