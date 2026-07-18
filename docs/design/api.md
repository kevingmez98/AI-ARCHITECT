# API de Alto Nivel - Arquitecto AI

## Visión General

La API de Arquitecto AI expone los recursos y operaciones necesarios para que el frontend interactúe con el sistema de análisis y diseño de arquitecturas. La API sigue principios REST para operaciones CRUD y utiliza WebSocket para la comunicación en tiempo real del chat.

La API está diseñada para ser consumida exclusivamente por el frontend de la aplicación. No se expone al público general.

---

## Recursos Principales

Basados en el modelo de dominio, los recursos de la API son:

| Recurso | Descripción | Endpoint base |
|---------|-------------|---------------|
| Conversations | Sesiones de análisis | `/api/conversations` |
| Messages | Mensajes del chat | `/api/conversations/:id/messages` |
| InformationObjectives | Fases de captura | `/api/conversations/:id/objectives` |
| Assumptions | Supuestos del sistema | `/api/conversations/:id/assumptions` |
| Requirements | Documento de requerimientos | `/api/conversations/:id/requirements` |
| Designs | Diseños funcionales/técnicos | `/api/conversations/:id/designs` |
| Documents | Documentos exportados | `/api/conversations/:id/documents` |

---

## Casos de Uso y Endpoints

### 1. Gestión de Conversaciones

**Caso de uso:** El usuario crea, consulta, lista y finaliza conversaciones de análisis.

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| Crear conversación | POST | `/api/conversations` | Inicia una nueva sesión de análisis |
| Listar conversaciones | GET | `/api/conversations` | Obtiene todas las conversaciones del usuario |
| Obtener conversación | GET | `/api/conversations/:id` | Obtiene el detalle de una conversación |
| Actualizar conversación | PATCH | `/api/conversations/:id` | Modifica nombre o descripción |
| Eliminar conversación | DELETE | `/api/conversations/:id` | Elimina una conversación y sus datos asociados |

**Flujo típico:**
1. El usuario crea una conversación describiendo su proyecto.
2. El sistema asigna estado `created` y objective `context`.
3. A medida que avanza el diálogo, el estado cambia a `in_progress`.
4. Al finalizar, el estado cambia a `completed`.

---

### 2. Gestión de Mensajes

**Caso de uso:** El usuario envía mensajes y recibe respuestas del sistema en tiempo real.

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| Enviar mensaje | POST | `/api/conversations/:id/messages` | Envía un mensaje del usuario |
| Obtener historial | GET | `/api/conversations/:id/messages` | Obtiene el historial de mensajes |

**Nota:** La recepción de respuestas del sistema se realiza mediante WebSocket, no mediante polling HTTP.

**Flujo típico:**
1. El usuario envía un mensaje via POST.
2. El backend procesa el mensaje con los agentes de IA.
3. El backend envía la respuesta al frontend via WebSocket.
4. El frontend muestra la respuesta en tiempo real.

---

### 3. Consulta de Objetivos de Información

**Caso de uso:** El frontend consulta el progreso de la captura de requerimientos.

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| Obtener objetivos | GET | `/api/conversations/:id/objectives` | Lista los objetivos y su estado |
| Obtener objetivo | GET | `/api/conversations/:id/objectives/:objectiveId` | Detalle de un objetivo específico |

**Nota:** Los objetivos se actualizan automáticamente durante la conversación. No hay operaciones de creación o modificación directa por parte del frontend.

---

### 4. Gestión de Supuestos

**Caso de uso:** El usuario revisa, confirma, modifica o rechaza los supuestos generados por el sistema.

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| Listar supuestos | GET | `/api/conversations/:id/assumptions` | Obtiene todos los supuestos de la conversación |
| Obtener supuesto | GET | `/api/conversations/:id/assumptions/:assumptionId` | Detalle de un supuesto |
| Confirmar supuesto | PATCH | `/api/conversations/:id/assumptions/:assumptionId/confirm` | Marca el supuesto como confirmado |
| Modificar supuesto | PATCH | `/api/conversations/:id/assumptions/:assumptionId` | Cambia el valor asumido |
| Rechazar supuesto | PATCH | `/api/conversations/:id/assumptions/:assumptionId/reject` | Marca el supuesto como rechazado |

**Flujo típico:**
1. El sistema genera supuestos durante la conversación.
2. El frontend lista los supuestos pendientes.
3. El usuario revisa y toma una decisión sobre cada uno.
4. El sistema actualiza el estado del supuesto.

---

### 5. Documento de Requerimientos

**Caso de uso:** El frontend consulta y exporta el documento de requerimientos generado.

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| Obtener requerimientos | GET | `/api/conversations/:id/requirements` | Obtiene el documento de requerimientos |
| Exportar requerimientos | GET | `/api/conversations/:id/requirements/export` | Descarga el documento en formato elegido |

**Parámetros de exportación:**
- `format`: `markdown` (default) o `pdf`

**Nota:** Solo existe un documento de requerimientos por conversación. Se actualiza progresivamente durante el flujo.

---

### 6. Gestión de Diseños

**Caso de uso:** El frontend consulta, genera y exporta diseños funcionales y técnicos.

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| Listar diseños | GET | `/api/conversations/:id/designs` | Obtiene todos los diseños de la conversación |
| Obtener diseño | GET | `/api/conversations/:id/designs/:designId` | Detalle de un diseño específico |
| Generar diseño funcional | POST | `/api/conversations/:id/designs/functional` | Solicita la generación del diseño funcional |
| Generar diseño técnico | POST | `/api/conversations/:id/designs/technical` | Solicita la generación del diseño técnico |
| Exportar diseño | GET | `/api/conversations/:id/designs/:designId/export` | Descarga el diseño en formato elegido |

**Flujo típico:**
1. El usuario solicita generar un diseño (funcional o técnico).
2. El backend orquesta los agentes Diseñador y Revisor.
3. El diseño se almacena en estado `draft`.
4. El agente Revisor lo valida y cambia a `reviewed`.
5. El usuario puede exportar el diseño finalizado.

---

### 7. Documentos Exportados

**Caso de uso:** El frontend consulta y descarga documentos generados.

| Operación | Método | Endpoint | Descripción |
|-----------|--------|----------|-------------|
| Listar documentos | GET | `/api/conversations/:id/documents` | Obtiene todos los documentos exportados |
| Obtener documento | GET | `/api/conversations/:id/documents/:documentId` | Detalle de un documento |
| Descargar documento | GET | `/api/conversations/:id/documents/:documentId/download` | Descarga el archivo |

---

## Comunicación en Tiempo Real

### WebSocket

**Propósito:** Mantener una conexión persistente para el chat conversacional.

**Eventos del cliente al servidor:**

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `message:send` | `{ conversationId, content }` | Envía un mensaje del usuario |

**Eventos del servidor al cliente:**

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `message:received` | `{ message }` | Mensaje recibido del sistema |
| `typing:start` | `{ conversationId }` | El sistema está procesando |
| `typing:stop` | `{ conversationId }` | El sistema terminó de procesar |
| `objective:updated` | `{ objective }` | Un objetivo de información cambió de estado |
| `assumption:created` | `{ assumption }` | Se generó un nuevo supuesto |
| `design:progress` | `{ designId, status }` | Progreso de generación de diseño |

**Justificación:** WebSocket permite una experiencia de chat fluida sin polling. Los eventos de estado mantienen al frontend sincronizado con los cambios del backend.

---

## Flujo General entre Frontend y Backend

### Flujo de Chat

```
┌─────────────┐                              ┌─────────────┐
│   FRONTEND  │                              │   BACKEND   │
└──────┬──────┘                              └──────┬──────┘
       │                                            │
       │  ──── message:send (WebSocket) ──────────> │
       │                                            │
       │                                            │  Procesa con agentes
       │                                            │  Actualiza estado
       │                                            │  Genera supuestos
       │                                            │
       │  <──── typing:start (WebSocket) ─────────  │
       │  <──── message:received (WebSocket) ─────  │
       │  <──── typing:stop (WebSocket) ──────────  │
       │  <──── objective:updated (WebSocket) ────  │
       │  <──── assumption:created (WebSocket) ───  │
       │                                            │
```

### Flujo de Consulta de Documentos

```
┌─────────────┐                              ┌─────────────┐
│   FRONTEND  │                              │   BACKEND   │
└──────┬──────┘                              └──────┬──────┘
       │                                            │
       │  ──── GET /conversations/:id/requirements  │
       │                                            │
       │  <──── 200 OK { requirements } ──────────  │
       │                                            │
       │  ──── GET /conversations/:id/requirements/export?format=pdf
       │                                            │
       │  <──── 200 OK (file download) ───────────  │
       │                                            │
```

### Flujo de Revisión de Supuestos

```
┌─────────────┐                              ┌─────────────┐
│   FRONTEND  │                              │   BACKEND   │
└──────┬──────┘                              └──────┬──────┘
       │                                            │
       │  ──── GET /conversations/:id/assumptions   │
       │  <──── 200 OK [ assumptions ] ───────────  │
       │                                            │
       │  ──── PATCH /assumptions/:id/confirm ────  │
       │  <──── 200 OK { assumption } ────────────  │
       │                                            │
       │  ──── PATCH /assumptions/:id/reject ─────  │
       │  <──── 200 OK { assumption } ────────────  │
       │                                            │
```

---

## Decisiones de Diseño

### 1. REST para operaciones CRUD

**Decisión:** Las operaciones de lectura y escritura de datos utilizan HTTP REST.

**Justificación:** REST es el estándar para APIs de recursos. Facilita el caching, la documentación automática y la interoperabilidad. Las operaciones de conversación y documentos son puntuales y no requieren tiempo real.

### 2. WebSocket para chat en tiempo real

**Decisión:** La comunicación del chat se realiza mediante WebSocket.

**Justificación:** El chat requiere bidireccionalidad y baja latencia. WebSocket evita el polling y permite que el backend notifique al frontend cuando hay cambios de estado o nuevos mensajes.

### 3. Recursos anidados bajo conversations

**Decisión:** Todos los recursos están anidados bajo `/api/conversations/:id`.

**Justificación:** Las conversaciones son la raíz del modelo de dominio. Anidar los recursos refleja esta jerarquía y simplifica las consultas. Un supuesto, mensaje o diseño siempre pertenece a una conversación específica.

### 4. Endpoints de acción para operaciones específicas

**Decisión:** Operaciones como confirmar o rechazar supuestos usan endpoints de acción (`/confirm`, `/reject`) en lugar de PATCH genérico.

**Justificación:** Las acciones sobre supuestos tienen reglas de negocio específicas (validar transiciones de estado, actualizar conversación). Un endpoint de acción hace explícita la operación y facilita la validación.

### 5. Exportación como operación de lectura

**Decisión:** La exportación de documentos se realiza mediante GET con parámetro de formato.

**Justificación:** La exportación es una operación de lectura que genera un archivo. GET es semánticamente correcto para descargar contenido. El parámetro `format` permite elegir entre Markdown y PDF sin crear endpoints separados.

### 6. Generación de diseño como operación asíncrona

**Decisión:** La generación de diseños se inicia con POST y se completa vía WebSocket.

**Justificación:** La generación de diseños puede tomar tiempo (llamadas al LLM, revisión). Un POST síncrono bloquearía la conexión. El flujo asíncrono permite notificar al frontend cuando el diseño está listo.

### 7. Sin autenticación en esta fase

**Decisión:** La API no incluye mecanismos de autenticación.

**Justificación:** El alcance actual no incluye gestión de usuarios. La arquitectura está preparada para incorporar autenticación sin modificar los endpoints existentes. Los endpoints están diseñados para ser protegidos con middleware en el futuro.

---

## Convenciones

### Respuestas exitosas

```json
{
  "data": { ... }
}
```

### Respuestas con lista

```json
{
  "data": [ ... ],
  "meta": {
    "total": 10
  }
}
```

### Errores

```json
{
  "error": {
    "code": "CONVERSATION_NOT_FOUND",
    "message": "La conversación especificada no existe"
  }
}
```

### Códigos de estado HTTP

| Código | Uso |
|--------|-----|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 204 | Eliminación exitosa (sin contenido) |
| 400 | Solicitud inválida |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## Resumen

La API de Arquitecto AI se compone de 7 recursos principales con operaciones REST para CRUD y WebSocket para chat en tiempo real. La estructura anidada bajo `/api/conversations/:id` refleja el modelo de dominio y facilita las consultas. Los endpoints están diseñados para ser extensibles y preparados para incorporar autenticación en futuras fases.
