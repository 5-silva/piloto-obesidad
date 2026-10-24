# Métricas del piloto

Todas se calculan en `src/lib/metrics.ts` a partir de los datos crudos y se ven en **Panel › Resumen**. Las pruebas en `tests/unit/metrics.test.ts` fijan cada definición.

## Embudo

| Paso | Cómo se cuenta |
|---|---|
| Visitantes únicos | Sesiones distintas con vista de la landing. Una sesión vive mientras la pestaña está abierta; no usamos cookies. |
| Lista de espera | Registros del formulario. |
| Tamizaje completo | Registros con cuestionario contestado. |
| Aptos o por revisar | Cuestionarios con resultado «apto» o «revisar con médico». |
| Valoración agendada | Registros marcados «agendado» o ya activos. |
| Pacientes activos | Pacientes con estado activo hoy. |

El porcentaje junto a cada paso compara con el paso anterior.

## Canal

- Un registro con código `ref` cuenta como canal **Médico**, aunque traiga `utm_source`.
- Sin `ref`, el canal es `utm_source` en minúsculas; sin ninguno, **Directo**.
- **Costo por paciente** = gasto registrado del canal ÷ pacientes activados de ese canal, en todo el piloto.
- La meta del costo por paciente es 2 meses de margen bruto: `2 × precio × 36%` (con $2,500, menos de $1,800).

Para que un canal se mida, sus ligas deben llevar UTM. Ejemplos:

```
https://tudominio.mx/?utm_source=instagram&utm_medium=paid&utm_campaign=fundadores
https://tudominio.mx/?ref=dra-mendoza           ← liga de cada médico que refiere
```

## Retención y adopción

- **Retención a k semanas** (k = 4, 8, 12): de los pacientes que ya llevan al menos k semanas completas desde su inicio, cuántos registraron un check-in en la semana k o después. Quien aún no llega a k semanas no cuenta ni a favor ni en contra.
- **Completa 4 semanas en línea (HC3)**: de quienes ya llevan 4 semanas, cuántos registraron al menos 3 de las semanas 1 a 4 y siguen registrando en la semana 4 o después.
- **Check-in de esta semana**: pacientes activos con check-in en su semana actual ÷ pacientes activos.

## Hipótesis que decide la semana 16

| Id | Hipótesis | Cumple si |
|---|---|---|
| HC1 | Pagan el servicio | ≥ 20 depósitos pagados y conversión visitante → lista ≥ 5% |
| HC3 | Aceptan el formato digital | ≥ 70% completa 4 semanas en línea |
| HC4 | El acompañamiento retiene | Retención a 12 semanas ≥ 70% |
| HC5 | Hay un canal rentable | Costo por paciente global < 2 meses de margen |
| HC8 | Los médicos refieren | ≥ 3 códigos de médico distintos con registros |

HC2, HC6 y HC7 se responden fuera de la app (entrevistas, opinión legal y costos de operación grupal).

## Límites conocidos

- Con menos de 10 pacientes por cohorte, un paciente mueve la retención más de 10 puntos: lee el número junto con el «n de m».
- Los visitantes se cuentan por sesión; la misma persona en dos días cuenta dos veces. Sirve para comparar canales, no como cifra exacta de personas.
- Si los eventos superan unos 50 mil, conviene mover el conteo a una vista SQL.
