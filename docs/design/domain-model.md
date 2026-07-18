# Modelo de Dominio - Arquitecto AI

## Visión General

El modelo de dominio de Arquitecto AI representa los conceptos centrales del sistema: conversaciones, mensajes, objetivos de información, supuestos, requerimientos, diseños y documentos. Cada entidad refleja un aspecto del proceso de análisis y diseño de arquitecturas de software asistido por IA.

El diseño prioriza la trazabilidad: cada decisión, supuesto y generación debe ser rastreable hasta su origen en la conversación.

---

## Entidades Principales

### 1. Conversation

**Propósito:** Representa una sesión completa de interacción entre el usuario y el sistema para diseñar una arquitectura de software.

**Atributos:**

| Atributo | Tipo | Descripción | Justificación |
|----------|------|-------------|---------------|
| id | Identificador único | Identificador de la conversación | Permite referenciar la conversación en todo el sistema |
| name | Texto | Nombre o título del proyecto | Identifica rápidamente el propósito de la conversación |
| description | Texto largo | Descripción breve del sistema a diseñar | Contexto inicial para los agentes |
| status | Estado | Estado actual de la conversación | Controla el flujo y permite retomar conversaciones |
| currentObjective | Texto | Objetivo de información activo | Indica en qué fase del flujo se encuentra |
| createdAt | Fecha/hora | Momento de creación | Auditoría y ordenamiento |
| updatedAt | Fecha/hora | Última actualización | Detecta conversaciones abandonadas |
| completedAt | Fecha/hora | Momento de finalización | Métricas de uso |

**Ciclo de vida:**

```
[created] → [in_progress] → [completed]
                          ↘ [paused] → [in_progress]
                          ↘ [abandoned]
```

- **created:** Conversación iniciada, sin mensajes aún.
- **in_progress:** Conversación activa, capturando o procesando información.
- **paused:** Conversación interrumpida, puede retomarse.
- **completed:** Flujo finalizado, documentos generados.
- **abandoned:** El usuario dejó la conversación sin finalizar.

---

### 2. Message

**Propósito:** Almacena cada intercambio de información entre el usuario y el sistema dentro de una conversación.

**Atributos:**

| Atributo | Tipo | Descripción | Justificación |
|----------|------|-------------|---------------|
| id | Identificador único | Identificador del mensaje | Referencia única |
| conversationId | Referencia | Conversación a la que pertenece | Vincula el mensaje con su conversación |
| role | Enum | Remitente: user / system / agent | Distingue quién generó el contenido |
| content | Texto largo | Contenido del mensaje | Almacena el texto intercambiado |
| agentType | Texto (opcional) | Tipo de agente que generó el mensaje | Identifica qué agente actuó (analista, inferidor, diseñador, revisor) |
| objectiveContext | Texto (opcional) | Objetivo de información asociado | Permite filtrar mensajes por fase del flujo |
| createdAt | Fecha/hora | Momento de envío | Cronología de la conversación |

**Relaciones:**
- Pertenece a una Conversation.
- Puede estar asociado a un InformationObjective.

---

### 3. InformationObjective

**Propósito:** Representa cada fase de información que el sistema debe capturar durante la conversación. Define qué necesita saber el sistema y en qué estado se encuentra esa información.

**Atributos:**

| Atributo | Tipo | Descripción | Justificación |
|----------|------|-------------|---------------|
| id | Identificador único | Identificador del objetivo | Referencia única |
| conversationId | Referencia | Conversación a la que pertenece | Vincula el objetivo con su conversación |
| type | Enum | Tipo de objetivo: context / functionality / constraints / tech_stack / validation | Clasifica la información capturada |
| status | Estado | Estado del objetivo: pending / in_progress / completed | Controla el progreso del flujo |
| gatheredInfo | Texto largo | Información recopilada hasta el momento | Acumula lo que el sistema sabe |
| inferredInfo | Texto largo | Informaciones inferidas por el sistema | Separa lo explícito de lo inferido |
| isComplete | Booleano | Si el objetivo tiene información suficiente | Determina cuándo avanzar |
| createdAt | Fecha/hora | Momento de creación | Cronología |
| updatedAt | Fecha/hora | Última actualización | Detecta estancamientos |

**Tipos de objetivo:**

| Tipo | Descripción |
|------|-------------|
| context | Comprender el problema, dominio y usuarios |
| functionality | Identificar funcionalidades, roles y reglas de negocio |
| constraints | Definir restricciones de calidad, seguridad y volumen |
| tech_stack | Seleccionar tecnologías e infraestructura |
| validation | Validar completitud y coherencia general |

**Ciclo de vida:**

```
[pending] → [in_progress] → [completed]
```

---

### 4. Assumption

**Propósito:** Registra cada decisión que el sistema toma cuando el usuario no proporciona información específica o delega la decisión. Garantiza la trazabilidad de las decisiones.

**Atributos:**

| Atributo | Tipo | Descripción | Justificación |
|----------|------|-------------|---------------|
| id | Identificador único | Identificador del supuesto | Referencia única |
| conversationId | Referencia | Conversación a la que pertenece | Vincula el supuesto con su conversación |
| field | Texto | Campo o aspecto que se asume | Identifica qué se está asumiendo |
| assumedValue | Texto | Valor decidido por el sistema | La decisión tomada |
| justification | Texto largo | Razón por la que la decisión es razonable | Explica la lógica detrás de la decisión |
| confidence | Enum | Nivel de confianza: high / medium / low | Indica cuánto se infiere del contexto |
| status | Estado | Estado del supuesto: pending / confirmed / modified / rejected | Permite al usuario revisar |
| source | Texto (opcional) | Información de la que se inferió | Trazabilidad hacia la fuente |
| informationObjectiveId | Referencia (opcional) | Objetivo de información asociado | Vincula el supuesto con la fase |
| createdAt | Fecha/hora | Momento de creación | Cronología |
| updatedAt | Fecha/hora | Última actualización | Registra modificaciones |

**Ciclo de vida:**

```
[pending] → [confirmed]
         ↘ [modified] → [confirmed]
         ↘ [rejected]
```

- **pending:** Supuesto generado, esperando revisión del usuario.
- **confirmed:** El usuario aceptó el supuesto.
- **modified:** El usuario cambió el valor asumido.
- **rejected:** El usuario descartó el supuesto.

---

### 5. Requirement

**Propósito:** Representa el documento de requerimientos generado a partir de la información capturada en la conversación.

**Atributos:**

| Atributo | Tipo | Descripción | Justificación |
|----------|------|-------------|---------------|
| id | Identificador único | Identificador del requerimiento | Referencia única |
| conversationId | Referencia | Conversación a la que pertenece | Vincula el documento con su conversación |
| title | Texto | Título del documento | Identificación rápida |
| summary | Texto largo | Resumen ejecutivo del sistema | Visión general para el usuario |
| functionalRequirements | Texto largo | Requerimientos funcionales detallados | Lo que el sistema debe hacer |
| nonFunctionalRequirements | Texto largo | Requerimientos no funcionales | Calidad, rendimiento, seguridad |
| roles | Texto largo | Roles y permisos identificados | Actores del sistema |
| businessRules | Texto largo | Reglas de negocio documentadas | Restricciones del dominio |
| version | Número | Versión del documento | Control de versiones |
| status | Estado | Estado: draft / final | Indica si está en revisión |
| createdAt | Fecha/hora | Momento de generación | Cronología |
| updatedAt | Fecha/hora | Última actualización | Registra modificaciones |

**Relaciones:**
- Pertenece a una Conversation.
- Se genera a partir de la información de los InformationObjective.
- Utiliza los Assumption confirmados.

---

### 6. Design

**Propósito:** Representa los diseños funcionales y técnicos generados por el sistema.

**Atributos:**

| Atributo | Tipo | Descripción | Justificación |
|----------|------|-------------|---------------|
| id | Identificador único | Identificador del diseño | Referencia única |
| conversationId | Referencia | Conversación a la que pertenece | Vincula el diseño con su conversación |
| type | Enum | Tipo: functional / technical | Distingue diseño funcional del técnico |
| title | Texto | Título del diseño | Identificación |
| modules | Texto largo | Módulos identificados (funcional) | Estructura del sistema |
| useCases | Texto largo | Casos de uso (funcional) | Interacciones del usuario |
| entities | Texto largo | Entidades y relaciones (funcional) | Modelo conceptual |
| architecture | Texto largo | Arquitectura propuesta (técnico) | Estructura técnica |
| apis | Texto largo | Endpoints definidos (técnico) | Interfaz de comunicación |
| database | Texto largo | Modelo de datos (técnico) | Diseño de persistencia |
| diagrams | Texto largo | Diagramas generados | Visualización |
| version | Número | Versión del diseño | Control de versiones |
| status | Estado | Estado: draft / reviewed / final | Flujo de aprobación |
| reviewedBy | Enum (opcional) | Agente que revisó: designer / reviewer | Traza la revisión |
| createdAt | Fecha/hora | Momento de generación | Cronología |
| updatedAt | Fecha/hora | Última actualización | Registra modificaciones |

**Ciclo de vida:**

```
[draft] → [reviewed] → [final]
```

- **draft:** Diseño generado, pendiente de revisión.
- **reviewed:** Revisado por el Agente Revisor.
- **final:** Aprobado y listo para exportar.

---

### 7. Document

**Propósito:** Representa los documentos exportados por el sistema (requerimientos, supuestos, diseño funcional, diseño técnico).

**Atributos:**

| Atributo | Tipo | Descripción | Justificación |
|----------|------|-------------|---------------|
| id | Identificador único | Identificador del documento | Referencia única |
| conversationId | Referencia | Conversación a la que pertenece | Vincula el documento con su conversación |
| type | Enum | Tipo: requirements / assumptions / functional_design / technical_design | Clasifica el documento |
| title | Texto | Título del documento | Identificación |
| content | Texto largo | Contenido en formato Markdown | El documento en sí |
| format | Enum | Formato de exportación: markdown / pdf | Formato disponible |
| version | Número | Versión del documento | Control de versiones |
| createdAt | Fecha/hora | Momento de generación | Cronología |

**Relaciones:**
- Pertenece a una Conversation.
- Se genera a partir de un Requirement o Design.

---

## Relaciones entre Entidades

```
┌──────────────────┐
│   Conversation   │
└────────┬─────────┘
         │
         │ 1
         │
         ├───< Message >                (1:N)
         │
         ├───< InformationObjective >   (1:N)
         │
         ├───< Assumption >             (1:N)
         │
         ├───< Requirement >            (1:1)
         │
         ├───< Design >                 (1:N)
         │
         └───< Document >               (1:N)
```

### Descripción de Relaciones

| Relación | Cardinalidad | Descripción |
|----------|--------------|-------------|
| Conversation → Message | 1:N | Una conversación contiene muchos mensajes |
| Conversation → InformationObjective | 1:N | Una conversación tiene múltiples objetivos de información |
| Conversation → Assumption | 1:N | Una conversación genera múltiples supuestos |
| Conversation → Requirement | 1:1 | Una conversación produce un único documento de requerimientos |
| Conversation → Design | 1:N | Una conversación puede generar múltiples diseños (funcional y técnico) |
| Conversation → Document | 1:N | Una conversación produce múltiples documentos exportables |
| Message → InformationObjective | N:1 | Un mensaje puede estar asociado a un objetivo de información |
| Assumption → InformationObjective | N:1 | Un supuesto puede originarse en un objetivo de información |
| Requirement → InformationObjective | N:N | El documento de requerimientos se construye a partir de múltiples objetivos |
| Document → Requirement/Design | N:1 | Un documento exportado se genera a partir de un requerimiento o diseño |

---

## Reglas de Negocio Relevantes

### R1: Trazabilidad de decisiones
Cada supuesto debe estar vinculado a la conversación y, opcionalmente, al objetivo de información que lo originó. Esto permite al usuario entender por qué se tomó cada decisión.

### R2: Un solo documento de requerimientos por conversación
Cada conversación produce un único documento de requerimientos que se actualiza a medida que avanza el flujo. No se generan múltiples versiones concurrentes.

### R3: Múltiples diseños por conversación
Una conversación puede generar un diseño funcional y uno técnico. Cada uno se gestiona de forma independiente con su propio ciclo de vida.

### R4: Supuestos revisables
Todos los supuestos comienzan en estado `pending`. El usuario debe revisarlos antes de que el diseño se considere final. Los supuestos `rejected` no deben influir en el diseño final.

### R5: Objetivos secuenciales
Los objetivos de información siguen un orden sugerido (contexto → funcionalidad → restricciones → stack → validación), pero el agente puede reordenar según el contexto de la conversación.

### R6: Documentos generados al final
Los documentos exportables (Requirement, Design) se generan cuando el objetivo de validación está completo y todos los supuestos han sido revisados.

### R7: Versionado simple
Los documentos y diseños usan un número de versión incremental. No se implementa control de versiones complejo en esta fase.

---

## Decisiones de Diseño

### 1. Conversación como raíz del modelo

**Decisión:** Conversation es la entidad central de la que dependen todas las demás.

**Justificación:** El sistema está orientado a conversaciones. Cada interacción, supuesto, requerimiento y diseño pertenece a una conversación específica. Esto facilita el aislamiento de datos entre proyectos y simplifica las consultas.

### 2. InformationObjective como entidad separada

**Decisión:** Los objetivos de información se modelan como entidades independientes, no como propiedades de la conversación.

**Justificación:** Permite rastrear el progreso de cada fase de forma independiente. Facilita retomar conversaciones desde el punto exacto en que se interrumpieron. Permite al agente saber exactamente qué información falta.

### 3. Assumption como entidad de primer nivel

**Decisión:** Los supuestos son entidades independientes con su propio ciclo de vida.

**Justificación:** Los supuestos son fundamentales para la trazabilidad del sistema. Deben ser revisados, confirmados o rechazados por el usuario. Un modelo donde los supuestos son propiedades de otros objetos dificultaría esta gestión.

### 4. Requirement como entidad singular por conversación

**Decisión:** Solo existe un documento de requerimientos por conversación, no múltiples versiones concurrentes.

**Justificación:** El flujo de captura produce un único documento que se enriquece progresivamente. No hay escenarios donde se necesiten múltiples documentos de requerimientos simultáneos.

### 5. Design con tipos separados

**Decisión:** Un mismo tipo de entidad (Design) maneja tanto diseños funcionales como técnicos mediante un atributo `type`.

**Justificación:** Ambos tipos de diseño comparten estructura similar (título, contenido, versionado, ciclo de vida). Separarlos en entidades distintas añadiría complejidad sin beneficio claro en esta fase.

### 6. Document como entidad de exportación

**Decisión:** Los documentos exportables son entidades separadas de los requerimientos y diseños.

**Justificación:** Permite generar múltiples formatos (Markdown, PDF) del mismo contenido sin duplicar la fuente. Facilita el historial de exportaciones y el control de versiones de exportación.

---

## Entidades Futuras (No incluidas en esta fase)

Las siguientes entidades se incorporarán cuando el proyecto las requiera:

- **User:** Gestión de usuarios y autenticación.
- **AgentExecution:** Registro detallado de la ejecución de cada agente (para auditoría y métricas).
- **PromptTemplate:** Plantillas de prompts utilizadas por los agentes.
- **ExportHistory:** Historial completo de exportaciones con metadatos.

---

## Resumen

El modelo de dominio de Arquitecto AI se estructura en torno a siete entidades principales que cubren el ciclo completo de una conversación de análisis y diseño:

1. **Conversation** - Sesión de interacción
2. **Message** - Historial de intercambios
3. **InformationObjective** - Fases de captura
4. **Assumption** - Decisiones registradas
5. **Requirement** - Documento de requerimientos
6. **Design** - Diseños funcionales y técnicos
7. **Document** - Exportaciones

Este modelo garantiza trazabilidad completa, permite retomar conversaciones y facilita la generación de documentación estructurada.
