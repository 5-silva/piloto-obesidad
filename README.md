# Constante · piloto digital

Aplicación web del piloto de acompañamiento para personas que usan o van a iniciar un medicamento para bajar de peso en México. Valida la demanda con 15 a 30 pacientes antes del MVP.

Tres vistas sobre una sola base de datos:

| Vista | Ruta | Para quién |
|---|---|---|
| Landing y lista de espera | `/` | Visitantes. Mide demanda y canal de origen. |
| Cuestionario de tamizaje | `/tamizaje/[liga]` | Cada registro, con su liga personal. |
| Portal del paciente | `/portal` | Pacientes activos: check-in semanal y gráfica. |
| Panel del equipo | `/panel` | Coordinación y médicos: lista diaria, embudo, métricas. |

El piloto **no receta, no vende medicamento y no guarda el expediente clínico**. El médico aliado lleva el expediente en su sistema.

## Correr en tu computadora

```bash
npm install
npm run dev          # http://localhost:3000, en modo demo
```

Sin variables de Supabase la app corre en **modo demo**: datos ficticios en memoria y acceso con un clic en `/login`. Copia `.env.example` a `.env.local` para conectar servicios reales.

## Pruebas

```bash
npm run check        # lint + tipos + pruebas unitarias y de permisos (RLS)
npm run test:e2e     # recorrido completo en un celular emulado, en modo demo
```

Las pruebas de permisos cargan la migración real en un Postgres embebido (PGlite) y comprueban que cada paciente vea solo lo suyo.

## Estructura

```
src/app/            páginas, acciones de servidor y rutas de API
src/components/     interfaz (landing, formularios, panel, gráfica)
src/content/        textos de la landing, editables sin tocar diseño
src/lib/            reglas de negocio puras (tamizaje, check-in, métricas)
src/lib/data/       acceso a datos: Supabase o memoria (demo)
supabase/migrations esquema, triggers y permisos por fila
tests/              unitarias, permisos (db) y punta a punta (e2e)
docs/               puesta en marcha, operación, métricas y contenido clínico
```

## Documentos

- [STATUS.md](STATUS.md): avance, bloqueos, decisiones pendientes y siguientes pasos.
- [docs/SETUP.md](docs/SETUP.md): cómo publicar (Supabase, Vercel, Resend, Cal.com).
- [docs/RUNBOOK.md](docs/RUNBOOK.md): operación diaria y qué hacer ante alertas o incidentes.
- [docs/METRICAS.md](docs/METRICAS.md): cómo se calcula cada métrica y qué decide.
- [docs/CONTENIDO-CLINICO.md](docs/CONTENIDO-CLINICO.md): textos que debe aprobar el médico responsable.
