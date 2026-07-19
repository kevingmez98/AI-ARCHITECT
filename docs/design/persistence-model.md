# Modelo de Persistencia - Arquitecto AI

## Visión General

El modelo de persistencia traduce el modelo de dominio de Arquitecto AI a un esquema relacional compatible con MariaDB. Siete tablas principales reflejan las entidades del dominio, con relaciones definidas mediante claves foráneas y restricciones de integridad.

El diseño prioriza la integridad referencial, el rendimiento en consultas por conversación y la trazabilidad de la información.

---

## Convenciones

- Los nombres de tablas se expresan en **plural** y **snake_case**.
- Los nombres de columnas se expresan en **snake_case**.
- Todas las tablas incluyen un identificador único `id` como **UUID** almacenado en `CHAR(36)`.
- Las columnas de tipo fecha/hora se almacenan en **TIMESTAMP** con zona horaria.
- Los campos de texto largo se almacenan como **TEXT** o **LONGTEXT** según su tamaño esperado.
- Los `enum` del dominio se implementan como **VARCHAR** con restricción `CHECK`.

---

## Tablas Propuestas

### 1. conversations

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | CHAR(36) | PK | UUID de la conversación |
| name | VARCHAR(255) | NOT NULL | Nombre o título del proyecto |
| description | TEXT | | Descripción breve del sistema a diseñar |
| status | VARCHAR(20) | NOT NULL, CHECK('created','in_progress','paused','completed','abandoned') | Estado actual del flujo |
| current_objective_type | VARCHAR(20) | | Tipo del objetivo de información activo (context, functionality, constraints, tech_stack, validation) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Momento de creación |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Última actualización |
| completed_at | TIMESTAMP | | Momento de finalización |

**Índices:**

| Nombre | Columnas | Tipo |
|--------|----------|------|
| idx_conversations_status | status | B-tree |
| idx_conversations_created_at | created_at | B-tree |
| idx_conversations_updated_at | updated_at | B-tree |

---

### 2. messages

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | CHAR(36) | PK | UUID del mensaje |
| conversation_id | CHAR(36) | NOT NULL, FK → conversations(id) | Conversación a la que pertenece |
| role | VARCHAR(10) | NOT NULL, CHECK('user','system','agent') | Remitente del mensaje |
| content | LONGTEXT | NOT NULL | Contenido del mensaje |
| agent_type | VARCHAR(30) | | Tipo de agente que generó el mensaje (analyst, inferrer, designer, reviewer) |
| objective_context | VARCHAR(20) | | Tipo de objetivo de información asociado (context, functionality, constraints, tech_stack, validation) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Momento de envío |

**Índices:**

| Nombre | Columnas | Tipo |
|--------|----------|------|
| idx_messages_conversation | conversation_id | B-tree |
| idx_messages_role | role | B-tree |
| idx_messages_created_at | conversation_id, created_at | B-tree (compuesto) |
| idx_messages_objective_context | objective_context | B-tree |

**Claves Foráneas:**

| Columna | Referencia | Comportamiento ON DELETE |
|---------|------------|--------------------------|
| conversation_id | conversations(id) | CASCADE |

---

### 3. information_objectives

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | CHAR(36) | PK | UUID del objetivo |
| conversation_id | CHAR(36) | NOT NULL, FK → conversations(id) | Conversación a la que pertenece |
| type | VARCHAR(20) | NOT NULL, CHECK('context','functionality','constraints','tech_stack','validation') | Tipo de objetivo de información |
| status | VARCHAR(15) | NOT NULL, CHECK('pending','in_progress','completed') | Estado del objetivo |
| gathered_info | LONGTEXT | | Información recopilada hasta el momento |
| inferred_info | LONGTEXT | | Informaciones inferidas por el sistema |
| is_complete | TINYINT(1) | NOT NULL, DEFAULT 0 | Indica si el objetivo tiene información suficiente |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Momento de creación |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Última actualización |

**Índices:**

| Nombre | Columnas | Tipo |
|--------|----------|------|
| idx_info_objectives_conversation | conversation_id | B-tree |
| idx_info_objectives_type | type | B-tree |
| idx_info_objectives_status | status | B-tree |
| idx_info_objectives_conversation_type | conversation_id, type | UNIQUE (una fila por tipo de objetivo por conversación) |

**Claves Foráneas:**

| Columna | Referencia | Comportamiento ON DELETE |
|---------|------------|--------------------------|
| conversation_id | conversations(id) | CASCADE |

**Restricciones:**

- `UNIQUE(conversation_id, type)`: Garantiza que no existan dos objetivos del mismo tipo dentro de una misma conversación.

---

### 4. assumptions

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | CHAR(36) | PK | UUID del supuesto |
| conversation_id | CHAR(36) | NOT NULL, FK → conversations(id) | Conversación a la que pertenece |
| field | VARCHAR(100) | NOT NULL | Campo o aspecto que se asume |
| assumed_value | TEXT | NOT NULL | Valor decidido por el sistema |
| justification | TEXT | NOT NULL | Razón por la que la decisión es razonable |
| confidence | VARCHAR(10) | NOT NULL, CHECK('high','medium','low') | Nivel de confianza |
| status | VARCHAR(15) | NOT NULL, CHECK('pending','confirmed','modified','rejected') | Estado del supuesto |
| source | TEXT | | Información de la que se infirió |
| information_objective_id | CHAR(36) | FK → information_objectives(id) | Objetivo de información asociado |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Momento de creación |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Última actualización |

**Índices:**

| Nombre | Columnas | Tipo |
|--------|----------|------|
| idx_assumptions_conversation | conversation_id | B-tree |
| idx_assumptions_status | status | B-tree |
| idx_assumptions_confidence | confidence | B-tree |
| idx_assumptions_objective | information_objective_id | B-tree |

**Claves Foráneas:**

| Columna | Referencia | Comportamiento ON DELETE |
|---------|------------|--------------------------|
| conversation_id | conversations(id) | CASCADE |
| information_objective_id | information_objectives(id) | SET NULL |

---

### 5. requirements

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | CHAR(36) | PK | UUID del documento de requerimientos |
| conversation_id | CHAR(36) | NOT NULL, FK → conversations(id), UNIQUE | Conversación a la que pertenece |
| title | VARCHAR(255) | NOT NULL | Título del documento |
| summary | TEXT | | Resumen ejecutivo del sistema |
| functional_requirements | LONGTEXT | | Requerimientos funcionales detallados |
| non_functional_requirements | LONGTEXT | | Requerimientos no funcionales |
| roles | TEXT | | Roles y permisos identificados |
| business_rules | TEXT | | Reglas de negocio documentadas |
| version | INT | NOT NULL, DEFAULT 1 | Versión del documento |
| status | VARCHAR(10) | NOT NULL, CHECK('draft','final') | Estado del documento |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Momento de generación |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Última actualización |

**Índices:**

| Nombre | Columnas | Tipo |
|--------|----------|------|
| idx_requirements_status | status | B-tree |

**Claves Foráneas:**

| Columna | Referencia | Comportamiento ON DELETE |
|---------|------------|--------------------------|
| conversation_id | conversations(id) | CASCADE |

**Restricciones:**

- `UNIQUE(conversation_id)`: Garantiza una fila por conversación (regla de negocio R2: un solo documento de requerimientos por conversación).

---

### 6. designs

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | CHAR(36) | PK | UUID del diseño |
| conversation_id | CHAR(36) | NOT NULL, FK → conversations(id) | Conversación a la que pertenece |
| type | VARCHAR(15) | NOT NULL, CHECK('functional','technical') | Tipo de diseño |
| title | VARCHAR(255) | NOT NULL | Título del diseño |
| modules | LONGTEXT | | Módulos identificados (funcional) |
| use_cases | LONGTEXT | | Casos de uso (funcional) |
| entities | LONGTEXT | | Entidades y relaciones (funcional) |
| architecture | LONGTEXT | | Arquitectura propuesta (técnico) |
| apis | LONGTEXT | | Endpoints definidos (técnico) |
| database | LONGTEXT | | Modelo de datos (técnico) |
| diagrams | LONGTEXT | | Diagramas generados |
| version | INT | NOT NULL, DEFAULT 1 | Versión del diseño |
| status | VARCHAR(15) | NOT NULL, CHECK('draft','reviewed','final') | Estado del diseño |
| reviewed_by | VARCHAR(15) | CHECK('designer','reviewer') | Agente que revisó |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Momento de generación |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Última actualización |

**Índices:**

| Nombre | Columnas | Tipo |
|--------|----------|------|
| idx_designs_conversation | conversation_id | B-tree |
| idx_designs_type | type | B-tree |
| idx_designs_status | status | B-tree |
| idx_designs_conversation_type | conversation_id, type | B-tree (compuesto, sin UNIQUE para permitir versionado futuro) |

**Claves Foráneas:**

| Columna | Referencia | Comportamiento ON DELETE |
|---------|------------|--------------------------|
| conversation_id | conversations(id) | CASCADE |

---

### 7. documents

| Columna | Tipo | Restricciones | Descripción |
|---------|------|---------------|-------------|
| id | CHAR(36) | PK | UUID del documento |
| conversation_id | CHAR(36) | NOT NULL, FK → conversations(id) | Conversación a la que pertenece |
| source_type | VARCHAR(20) | NOT NULL, CHECK('requirements','assumptions','functional_design','technical_design') | Tipo de contenido fuente |
| source_id | CHAR(36) | NOT NULL, FK → requirements(id) o designs(id) | ID de la fuente que originó el documento |
| title | VARCHAR(255) | NOT NULL | Título del documento |
| content | LONGTEXT | NOT NULL | Contenido en formato Markdown |
| format | VARCHAR(10) | NOT NULL, CHECK('markdown','pdf') | Formato de exportación |
| version | INT | NOT NULL, DEFAULT 1 | Versión del documento |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Momento de generación |

**Índices:**

| Nombre | Columnas | Tipo |
|--------|----------|------|
| idx_documents_conversation | conversation_id | B-tree |
| idx_documents_source | source_type, source_id | B-tree |
| idx_documents_created_at | created_at | B-tree |

**Claves Foráneas:**

| Columna | Referencia | Comportamiento ON DELETE |
|---------|------------|--------------------------|
| conversation_id | conversations(id) | CASCADE |

**Restricción adicional:**

- No existe una FK directa sobre `source_id` porque puede referenciar `requirements(id)` o `designs(id)` según el `source_type`. La integridad se gestiona a nivel de aplicación.

---

## Relaciones entre Tablas

```
conversations
├──< messages                (1:N)  via conversation_id
├──< information_objectives  (1:N)  via conversation_id
├──< assumptions             (1:N)  via conversation_id
├──< requirements            (1:1)  via conversation_id (UNIQUE)
├──< designs                 (1:N)  via conversation_id
└──< documents               (1:N)  via conversation_id

information_objectives
└──< assumptions             (1:N)  via information_objective_id (opcional, SET NULL)

requirements ───< documents  (1:N)  via source_id (polimórfica)
designs ───────< documents   (1:N)  via source_id (polimórfica)
```

### Resumen de Relaciones

| Relación | Cardinalidad | FK | Comportamiento ON DELETE |
|----------|--------------|----|--------------------------|
| conversations → messages | 1:N | messages.conversation_id | CASCADE |
| conversations → information_objectives | 1:N | information_objectives.conversation_id | CASCADE |
| conversations → assumptions | 1:N | assumptions.conversation_id | CASCADE |
| conversations → requirements | 1:1 | requirements.conversation_id (UNIQUE) | CASCADE |
| conversations → designs | 1:N | designs.conversation_id | CASCADE |
| conversations → documents | 1:N | documents.conversation_id | CASCADE |
| information_objectives → assumptions | 1:N | assumptions.information_objective_id | SET NULL |
| requirements → documents | 1:N | documents.source_id | CASCADE |
| designs → documents | 1:N | documents.source_id | CASCADE |

---

## Restricciones Relevantes

### CHECK Constraints

| Tabla | Columna | Valores permitidos |
|-------|---------|--------------------|
| conversations | status | created, in_progress, paused, completed, abandoned |
| messages | role | user, system, agent |
| messages | agent_type | analyst, inferrer, designer, reviewer |
| information_objectives | type | context, functionality, constraints, tech_stack, validation |
| information_objectives | status | pending, in_progress, completed |
| assumptions | confidence | high, medium, low |
| assumptions | status | pending, confirmed, modified, rejected |
| requirements | status | draft, final |
| designs | type | functional, technical |
| designs | status | draft, reviewed, final |
| designs | reviewed_by | designer, reviewer |
| documents | source_type | requirements, assumptions, functional_design, technical_design |
| documents | format | markdown, pdf |

### UNIQUE Constraints

| Tabla | Columnas | Propósito |
|-------|----------|-----------|
| information_objectives | conversation_id, type | Evitar duplicación de objetivos del mismo tipo en una conversación |
| requirements | conversation_id | Garantizar una fila por conversación (regla R2) |

### NOT NULL

- Todas las columnas marcadas como PK son NOT NULL.
- Todas las FK son NOT NULL, excepto `assumptions.information_objective_id` (relación opcional).
- Los campos `agent_type` y `objective_context` en messages son opcionales.
- `current_objective_type` en conversations es opcional (no siempre hay objetivo activo).
- `completed_at` en conversations es opcional (solo se completa al finalizar).

---

## Índices Sugeridos

### Índices para Consultas Frecuentes

| Tabla | Consulta típica | Índice |
|-------|-----------------|--------|
| messages | Obtener historial de una conversación ordenado por fecha | idx_messages_conversation + idx_messages_created_at (compuesto) |
| information_objectives | Obtener objetivos pendientes de una conversación | idx_info_objectives_conversation + idx_info_objectives_status |
| assumptions | Obtener supuestos pendientes de revisión por conversación | idx_assumptions_conversation + idx_assumptions_status |
| requirements | Buscar documento por estado | idx_requirements_status |
| designs | Obtener diseños de una conversación por tipo | idx_designs_conversation + idx_designs_type |
| documents | Obtener documentos exportados de una conversación | idx_documents_conversation + idx_documents_created_at |

### Índices de Unicidad

| Tabla | Columnas | Tipo |
|-------|----------|------|
| information_objectives | conversation_id, type | UNIQUE |
| requirements | conversation_id | UNIQUE |

---

## Decisiones de Diseño

### 1. UUID como identificador primario

**Decisión:** Se utiliza UUID (CHAR(36)) en lugar de enteros autoincrementales.

**Justificación:** Los UUID permiten generar identificadores en el backend sin depender de la base de datos, facilitan la trazabilidad entre microservicios futuros y evitan conflictos en operaciones distribuidas. Se almacenan como CHAR(36) en lugar de BINARY(16) para mantener legibilidad directa en consultas.

### 2. CASCADE en eliminaciones

**Decisión:** Todas las relaciones desde `conversations` usan `ON DELETE CASCADE`.

**Justificación:** La conversación es la raíz del modelo. Eliminar una conversación implica eliminar todos los datos asociados (mensajes, objetivos, supuestos, documentos). No hay escenarios donde se conserven datos huérfanos de una conversación eliminada.

### 3. SET NULL para relación opcional Assumption → InformationObjective

**Decisión:** La FK `assumptions.information_objective_id` usa `ON DELETE SET NULL`.

**Justificación:** Un supuesto puede existir sin estar vinculado a un objetivo de información. Si el objetivo se elimina, el supuesto debe conservarse para mantener la trazabilidad de la decisión.

### 4. UNIQUE(conversation_id, type) en information_objectives

**Decisión:** No pueden existir dos objetivos del mismo tipo en una misma conversación.

**Justificación:** El flujo de captura está diseñado para tener un objetivo activo por tipo. Permitir múltiples objetivos del mismo tipo complicaría la lógica de progreso sin beneficio real (regla R5).

### 5. UNIQUE(conversation_id) en requirements

**Decisión:** Solo un documento de requerimientos por conversación.

**Justificación:** Regla de negocio R2 del modelo de dominio.

### 6. Sin FK directa para documents.source_id

**Decisión:** `source_id` no tiene una FK única porque puede referenciar `requirements(id)` o `designs(id)` según `source_type`.

**Justificación:** MariaDB no soporta FK polimórficas. La alternativa (tablas separadas por tipo) añadiría complejidad innecesaria. La integridad referencial se valida a nivel de aplicación.

### 7. LONGTEXT para contenido extenso

**Decisión:** Las columnas que almacenan contenido generado por IA (mensajes, información recopilada, documentos) usan LONGTEXT.

**Justificación:** El contenido generado por los agentes puede exceder los 65535 caracteres de TEXT. LONGTEXT permite hasta 4 GB, cubriendo cualquier documento de arquitectura futuro.

### 8. TIMESTAMP con actualización automática

**Decisión:** Las columnas `updated_at` usan `ON UPDATE CURRENT_TIMESTAMP`.

**Justificación:** Simplifica el mantenimiento de la fecha de última modificación sin lógica en la aplicación. Especialmente útil para detectar conversaciones abandonadas o diseños desactualizados.

### 9. Índices compuestos para consultas por conversación

**Decisión:** Se priorizan índices compuestos que incluyen `conversation_id` + columna de filtro.

**Justificación:** La mayoría de consultas del sistema filtran por conversación. Un índice compuesto que incluye `conversation_id` como primera columna permite búsquedas eficientes de todos los datos de una sesión.

### 10. VARCHAR con CHECK en lugar de ENUM

**Decisión:** Los tipos枚举 del dominio se implementan como VARCHAR con CHECK.

**Justificación:** MariaDB soporta CHECK constraints desde la versión 10.2. VARCHAR + CHECK es más portátil que ENUM y evita problemas al modificar la lista de valores permitidos (ALTER TABLE para ENUM requiere reconstrucción de la tabla).

---

## Resumen

El modelo de persistencia de Arquitecto AI consta de **7 tablas** que reflejan fielmente el modelo de dominio. Las decisiones de diseño priorizan:

1. **Integridad referencial:** Todas las relaciones están protegidas mediante FK con comportamiento definido.
2. **Rendimiento en consultas por conversación:** Índices compuestos optimizan el acceso a datos de una sesión.
3. **Flexibilidad:** Tipos polimórficos (documentos), columnas opcionales (relaciones no obligatorias) y VARCHAR con CHECK (futuras extensiones de valores).
4. **Trazabilidad:** UUID, timestamps y versionado permiten rastrear cada cambio.

| Tabla | Propósito | Registros esperados por conversación |
|-------|-----------|--------------------------------------|
| conversations | Sesiones de análisis | 1 |
| messages | Historial de intercambios | Decenas a cientos |
| information_objectives | Fases de captura | 5 (uno por tipo) |
| assumptions | Decisiones registradas | Pocos a decenas |
| requirements | Documento de requerimientos | 1 |
| designs | Diseños funcionales/técnicos | 2 (funcional + técnico) |
| documents | Exportaciones | Pocos (depende de exportaciones) |

Este diseño sirve como guía directa para la implementación del esquema de base de datos en MariaDB durante la fase técnica del proyecto.
