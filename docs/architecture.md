# Propuesta: estructura inicial de API para interacción SNMP

## 1) Estado actual del repositorio (readiness check)

### Estructura detectada
- `src/app`: bootstrap de Fastify y servidor.
- `src/shared`: configuración de entorno, logger y tipos SNMP.
- `src/modules`: módulos por dominio (`snmp`, `olt`, `audit`, `security`), hoy mayormente placeholders.
- `docs/api/openapi.yaml`: existe pero vacío.
- `tests/unit` y `tests/integration`: estructura creada, sin casos aún.

### Implementación funcional actualmente
- Arranque de API Fastify.
- Middleware de seguridad base (`helmet`, `cors`, `rate-limit`).
- Endpoint `GET /health`.
- Validación de variables de entorno con `zod`.
- Logger centralizado con `winston`.
- Tipos base SNMP (`SNMPVersion`, `SNMPOperation`, `OLTVendor`, etc.).

## 2) Requisitos iniciales para iniciar desarrollo (MVP)

### Requisitos mínimos de plataforma
1. **Runtime y build**
   - TypeScript estricto habilitado.
   - Scripts de `dev`, `build`, `start`, `lint`, `test` pendientes de normalizar en `package.json`.
2. **Infra local**
   - PostgreSQL y Redis definidos en `docker-compose.dev.yml`.
3. **Configuración**
   - Variables críticas ya definidas (`DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `SNMP_TIMEOUT`, `SNMP_RETRIES`).
4. **Seguridad base**
   - Capa HTTP base configurada (helmet/cors/rate-limit).

### Requisitos mínimos de dominio SNMP
1. **Modelo de OLT gestionada**
   - Crear repositorio persistente para `OLTConfig`.
2. **Abstracción por vendor**
   - Implementar interfaz única para adapters (`huawei`, `zte`, `generic`).
3. **Política de OIDs permitidas**
   - Enforzar allowlist/denylist antes de ejecutar operaciones SNMP.
4. **Auditoría**
   - Registrar cada operación (quién, contra qué OLT, qué OID, latencia, resultado).
5. **Errores estandarizados**
   - Contrato uniforme para timeout SNMP, auth, OID bloqueada y host inalcanzable.

## 3) Estructura de API propuesta (v1)

Base path: `/api/v1`

### Salud
- `GET /health`

### OLTs
- `POST /olts` — alta de equipo OLT y configuración SNMP.
- `GET /olts` — listado paginado.
- `GET /olts/:oltId` — detalle.
- `PATCH /olts/:oltId` — actualización parcial.
- `DELETE /olts/:oltId` — baja lógica.

### SNMP
- `POST /snmp/get`
- `POST /snmp/get-next`
- `POST /snmp/walk`
- `POST /snmp/set` (sujeto a política más restrictiva)

Body común sugerido:
```json
{
  "oltId": "olt_001",
  "oid": "1.3.6.1.2.1.1.1.0",
  "options": {
    "timeout": 5000,
    "retries": 2,
    "maxRepetitions": 20
  }
}
```

### Auditoría
- `GET /audit/events` — consulta de eventos de operación.

## 4) Criterios de aceptación iniciales

1. OpenAPI v1 con rutas SNMP/OLT/audit publicadas.
2. Validación de payloads (request/response) en todas las rutas.
3. Operación SNMP GET funcionando end-to-end con 1 adapter real (generic).
4. Auditoría persistida para éxito/error.
5. Manejo de errores tipado y respuesta HTTP consistente.
6. Tests mínimos:
   - unit: validadores y normalizador de OIDs.
   - integration: `POST /snmp/get` y `GET /health`.

## 5) Evaluación de cumplimiento actual vs. requisitos

- ✅ **Cumplido**: base de servidor, seguridad HTTP, config/entorno, tipos de dominio iniciales.
- ⚠️ **Parcial**: estructura modular creada pero sin implementación en rutas/módulos.
- ❌ **Pendiente crítico**: contrato OpenAPI, endpoints SNMP, persistencia OLT/auditoría, pruebas automatizadas.

## 6) Plan de arranque recomendado (sprints técnicos)

1. **Sprint 0 (setup):** scripts npm, lint/test/build, esqueleto OpenAPI, health route versionada.
2. **Sprint 1 (SNMP core):** `snmp.service` + adapter generic + `POST /snmp/get`.
3. **Sprint 2 (gobierno):** OID policy, auditoría y JWT middleware en rutas de negocio.
4. **Sprint 3 (catálogo OLT):** CRUD OLT + integración DB.
5. **Sprint 4 (hardening):** observabilidad, rate-limit por token/IP, pruebas de carga y seguridad.

---

## Conclusión

La base técnica está **suficientemente preparada para iniciar** el desarrollo de la propuesta “Define API structure for SNMP interaction”, pero todavía en fase de **scaffolding**. El siguiente paso correcto es formalizar el contrato OpenAPI y habilitar el primer flujo vertical `POST /snmp/get` con auditoría básica para validar arquitectura y riesgos tempranos.

## 7) Sprint 1 completado: checklist de cierre

Estado objetivo de Sprint 1: `snmp.service` + adapter generic + `POST /api/v1/snmp/get`.

- ✅ Servicio SNMP implementado con selección de adapter por vendor (`generic`, `huawei`, `zte`).
- ✅ Adapter generic implementado con `net-snmp` y operación `get` real (v2c).
- ✅ Endpoint `POST /api/v1/snmp/get` implementado y validado con `zod`.
- ✅ Normalización/validación de OID centralizada.
- ✅ Contrato OpenAPI inicial para `POST /api/v1/snmp/get` y `GET /health`.

### Cómo finalizar Sprint 1 completamente (operativo)

1. **Levantar API**
   - `npm run dev`
2. **Probar health**
   - `curl http://localhost:3000/health`
3. **Probar SNMP GET contra dispositivo real/lab**
   - `curl -X POST http://localhost:3000/api/v1/snmp/get \
     -H 'content-type: application/json' \
     -d '{
       "vendor": "generic",
       "oid": "1.3.6.1.2.1.1.1.0",
       "connection": {
         "host": "10.0.0.10",
         "community": "public",
         "timeout": 5000,
         "retries": 2
       }
     }'`
4. **Criterio de Done**
   - Respuesta `200` con `status=ok` y `data` con `oid/type/value/timestamp`.
   - Errores de payload inválido responden `400`.
   - Error handler central captura errores inesperados con `500`.

Con esto, Sprint 1 queda técnicamente cerrado y listo para iniciar Sprint 2 (OID policy + auditoría + auth en rutas de negocio).
