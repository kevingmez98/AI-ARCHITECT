# Arquitectura de Alto Nivel - Arquitecto AI

## Visión General

Arquitecto AI es una aplicación web compuesta por un frontend de interfaz conversacional y un backend que orquesta agentes de inteligencia artificial para diseñar arquitecturas de software.

El sistema sigue un modelo cliente-servidor con separación clara de responsabilidades. El backend actúa como orquestador central que coordina la interacción entre el usuario, los agentes de IA y la persistencia de datos.

```
┌─────────────────────────────────────────────────────────────┐
│                       FRONTEND                             │
│                   React + TypeScript                       │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Interfaz   │  │   Chat      │  │   Visualización     │ │
│  │  Conversac. │  │   Widget    │  │   Documentos        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP / WebSocket
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       BACKEND                              │
│                    NestJS + TypeScript                      │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   API       │  │  Servicio   │  │   Servicio          │ │
│  │   Gateway   │  │  Conversac. │  │   Documentos        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │  Orquestador│  │  Servicio   │  │   Servicio          │ │
│  │  de Agentes │  │  de Estado  │  │   de Supuestos      │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Capa de Persistencia                    │   │
│  │                   MariaDB                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                SERVICIO EXTERNO: LLM                        │
│                  API de OpenAI / Claude                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Componentes Principales

### 1. Frontend (React + TypeScript + Tailwind)

**Responsabilidad:** Proporcionar la interfaz de usuario para interactuar con el sistema de forma conversacional.

**Componentes internos:**

#### 1.1 Interfaz Conversacional
- Muestra el historial de mensajes entre el usuario y el sistema.
- Presenta las respuestas del usuario y las propuestas del agente.
- Permite al usuario revisar y modificar respuestas anteriores.
- Renderiza documentos generados (requerimientos, supuestos, diseño).

#### 1.2 Widget de Chat
- Gestiona la entrada de texto del usuario.
- Envía mensajes al backend mediante HTTP para consultas puntuales o WebSocket para interacciones en tiempo real.
- Muestra indicadores de carga mientras el sistema procesa.

#### 1.3 Visualización de Documentos
- Muestra los documentos generados por el sistema (requerimientos, diseño funcional, diseño técnico).
- Permite exportar documentos en formato Markdown o PDF.
- Presenta diagramas de arquitectura y modelos de datos.

**Justificación:** React con TypeScript ofrece un ecosistema robusto, tipado estático y un modelo de componentes que facilita la separación de concerns. Tailwind permite un diseño ágil sin necesidad de crear un sistema de diseño desde cero.

---

### 2. Backend (NestJS + TypeScript)

**Responsabilidad:** Orquestar toda la lógica del sistema, coordinar agentes de IA, gestionar el estado de las conversaciones y persistir datos.

**Componentes internos:**

#### 2.1 API Gateway
- Expone los endpoints HTTP/REST para comunicación con el frontend.
- Valida y transforma las peticiones entrantes.
- Enruta las peticiones al servicio correspondiente.

#### 2.2 Servicio de Conversación
- Gestiona el ciclo de vida de cada conversación.
- Mantiene el contexto completo del diálogo.
- Controla el flujo entre los objetivos de información (contexto, funcionalidades, restricciones, stack técnico, validación).
- Decide cuándo avanzar de objetivo según la información recibida.

#### 2.3 Orquestador de Agentes
- Coordina la ejecución de agentes especializados.
- Administra el orden de ejecución y las dependencias entre agentes.
- Gestiona la comunicación entre agentes.
- Maneja la degradación graceful si un agente falla.

#### 2.4 Servicio de Estado
- Mantiene el estado actual de cada conversación.
- Registra qué objetivo de información está activo.
- Almacena las respuestas del usuario y las inferencias del sistema.
- Permite retomar conversaciones interrumpidas.

#### 2.5 Servicio de Documentos
- Genera documentos estructurados a partir de la información capturada.
- Gestiona la versión de cada documento.
- Controla la exportación en distintos formatos.

#### 2.6 Servicio de Supuestos
- Registra cada supuesto tomado por el sistema.
- Asocia supuestos a la información que los originó.
- Permite al usuario revisar, confirmar o modificar supuestos.
- Mantiene la trazabilidad de decisiones.

**Justificación:** NestJS proporciona una arquitectura basada en módulos que facilita la separación de responsabilidades. Su sistema de inyección de dependencias permite un diseño desacoplado. TypeScript comparte el mismo lenguaje con el frontend, reduciendo el costo de context switching.

---

### 3. Agentes de IA

**Responsabilidad:** Ejecutar tareas específicas de análisis y diseño utilizando modelos de lenguaje.

**Agentes definidos:**

#### 3.1 Agente Analista
- Evalúa la información proporcionada por el usuario.
- Detecta información faltante o ambigua.
- Genera preguntas relevantes para cada objetivo.
- Valida la completitud y coherencia de las respuestas.

#### 3.2 Agente Inferidor
- Analiza el contexto para deducir información relacionada.
- Propone funcionalidades, entidades y roles basados en el dominio.
- Genera supuestos justificados cuando falta información.
- Presenta inferencias como propuestas para confirmación del usuario.

#### 3.3 Agente Diseñador
- Genera el diseño funcional: módulos, casos de uso, entidades, relaciones.
- Produce el diseño técnico: arquitectura, APIs, base de datos.
- Propone stack técnico justificado.
- Genera diagramas y modelos conceptuales.

#### 3.4 Agente Revisor
- Valida la coherencia global del diseño generado.
- Detecta inconsistencias entre requerimientos y diseño.
- Identifica riesgos o áreas débiles.
- Propone mejoras al diseño.

**Justificación:** La especialización de agentes permite que cada uno se enfoque en una tarea concreta, mejorando la calidad de las respuestas. El patrón de orquestación facilita la adición de nuevos agentes sin modificar los existentes.

---

### 4. Capa de Persistencia (MariaDB)

**Responsabilidad:** Almacenar de forma persistente el estado del sistema.

**Entidades principales:**

- **Conversations:** Registra cada sesión de conversación con su estado actual.
- **Messages:** Almacena el historial completo de mensajes.
- **Requirements:** Documento de requerimientos generado.
- **Assumptions:** Lista de supuestos con su estado de confirmación.
- **Designs:** Diseños funcionales y técnicos generados.
- **Documents:** Documentos exportados y su historial de versiones.

**Justificación:** MariaDB es una base de datos relacional madura, compatible con MySQL y con buen rendimiento para el volumen esperado. Su naturaleza relacional se adapta bien a la estructura jerárquica de conversaciones → mensajes → documentos.

---

### 5. Servicio Externo: LLM

**Responsabilidad:** Procesar el lenguaje natural y generar respuestas inteligentes.

**Integración:**
- El backend se comunica con la API del LLM mediante llamadas HTTP.
- Cada agente utiliza prompts específicos diseñados para su tarea.
- Se gestiona el contexto de la ventana de conversación.
- Se implementa reintentos y manejo de errores.

**Justificación:** Externalizar el LLM permite cambiar de proveedor sin modificar la arquitectura interna. La abstracción del servicio de IA facilita pruebas con mocks y migraciones entre modelos.

---

## Flujo General de Información

### Flujo Principal: Captura de Requerimientos

```
Usuario → Frontend → API Gateway → Servicio de Conversación
                                         │
                                         ▼
                                   Orquestador de Agentes
                                         │
                                         ▼
                                   Agente Analista (evalúa información)
                                         │
                                         ▼
                                   Agente Inferidor (propone inferencias)
                                         │
                                         ▼
                                   Servicio de Estado (actualiza contexto)
                                         │
                                         ▼
                                   Servicio de Supuestos (registra supuestos)
                                         │
                                         ▼
                                   LLM (genera respuesta)
                                         │
                                         ▼
                                   Servicio de Conversación (arma respuesta)
                                         │
                                         ▼
                                   Frontend (muestra al usuario)
```

### Flujo de Generación de Diseño

```
Servicio de Conversación → Orquestador de Agentes
                                    │
                                    ▼
                            Agente Diseñador
                                    │
                                    ▼
                            Agente Revisor (valida)
                                    │
                                    ▼
                            Servicio de Documentos (genera documentos)
                                    │
                                    ▼
                            Capa de Persistencia (almacena)
                                    │
                                    ▼
                            Frontend (presenta al usuario)
```

### Flujo de Revisión de Supuestos

```
Usuario → Frontend → Servicio de Supuestos
                              │
                              ▼
                    Lista de supuestos confirmados
                              │
                              ▼
                    Servicio de Conversación
                    (actualiza contexto)
                              │
                              ▼
                    Servicio de Estado
                    (refleja cambios)
```

---

## Tecnologías

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Frontend | React + TypeScript | Ecosistema robusto, tipado estático, componentes reutilizables |
| Estilos | Tailwind CSS | Desarrollo ágil, diseño responsive sin framework pesado |
| Backend | NestJS + TypeScript | Arquitectura modular, inyección de dependencias, mismo lenguaje que frontend |
| Base de datos | MariaDB | Relacional, compatible MySQL, maduro, buen rendimiento |
| LLM | API externa (OpenAI/Claude) | Flexibilidad para cambiar proveedor, acceso a modelos de última generación |
| Comunicación | HTTP REST + WebSocket | REST para operaciones puntuales, WebSocket para chat en tiempo real |

---

## Decisiones Arquitectónicas

### 1. Separación Frontend/Backend

**Decisión:** Arquitectura cliente-servidor con APIs REST.

**Justificación:** Permite desplegar frontend y backend de forma independiente. Facilita el escalado horizontal del backend sin afectar al frontend. Permite que múltiples clientes consuman la misma API.

### 2. Orquestación de Agentes

**Decisión:** Un orquestador central coordina agentes especializados.

**Justificación:** El patrón de orquestación permite un control explícito del flujo. Cada agente se enfoca en una tarea, mejorando la calidad. La adición de nuevos agentes no afecta a los existentes.

### 3. Persistencia Relacional

**Decisión:** MariaDB como base de datos principal.

**Justificación:** Las relaciones entre conversaciones, mensajes y documentos son naturales en un modelo relacional. MariaDB ofrece compatibilidad con MySQL y buena documentación.

### 4. Abstracción del LLM

**Decisión:** El servicio de IA se abstrae detrás de una interfaz común.

**Justificación:** Permite cambiar de proveedor de LLM sin modificar la lógica de negocio. Facilita las pruebas unitarias con mocks. Habilita el uso de diferentes modelos para diferentes agentes.

### 5. Estado de Conversación

**Decisión:** El estado se gestiona en el backend, no en el frontend.

**Justificación:** Permite retomar conversaciones desde cualquier dispositivo. Garantiza la integridad del estado ante caídas del cliente. Facilita la auditoría y el análisis de uso.

### 6. Comunicación en Tiempo Real

**Decisión:** WebSocket para interacciones de chat, HTTP para operaciones puntuales.

**Justificación:** WebSocket permite una experiencia de conversación fluida sin polling. HTTP simplifica operaciones como exportar documentos o consultar estado.

---

## Consideraciones No Funcionales

### Escalabilidad
- El backend puede escalar horizontalmente añadiendo instancias.
- La capa de persistencia puede escalar con réplicas de lectura.
- El LLM se consume como servicio externo con su propia escalabilidad.

### Disponibilidad
- El sistema debe tolerar fallos en el servicio de LLM con mensajes informativos.
- Las conversaciones deben poder retomarse tras interrupciones.
- La persistencia garantiza que no se pierda información.

### Seguridad
- Cifrado en tránsito (HTTPS).
- Rate limiting en los endpoints públicos.

### Mantenibilidad
- Arquitectura modular facilita cambios localizados.
- TypeScript en frontend y backend reduce errores de tipos.
- Sepación clara de responsabilidades en cada capa.

---

## Mapa de Módulos del Backend

```
backend/src/
├── modules/
│   ├── conversation/     # Servicio de conversación y contexto
│   ├── agents/           # Orquestador y agentes especializados
│   ├── documents/        # Generación y gestión de documentos
│   ├── assumptions/      # Gestión de supuestos
│   └── state/            # Estado de conversaciones
├── common/
│   ├── guards/           # (pendiente: definición futura)
│   ├── interceptors/     # Logging, transformación
│   └── dto/              # objetos de transferencia
├── database/
│   └── entities/         # Entidades de persistencia
└── integrations/
    └── llm/              # Abstracción del servicio de LLM
```

---

## Decisiones Pendientes

Las siguientes áreas serán definidas en fases posteriores:

### Gestión de Usuarios, Autenticación y Autorización

El alcance actual del sistema no incluye gestión de usuarios ni mecanismos de autenticación. Por diseño, la arquitectura está preparada para incorporar esta funcionalidad sin modificar los componentes existentes.

**Qué se definirá en futuro:**
- Modelo de usuarios (entidades, roles, permisos).
- Mecanismo de autenticación (tecnología y flujo).
- Estrategia de autorización (control de acceso por rol o permiso).
- Integración con el API Gateway y la capa de persistencia.

**Qué se mantiene abierto:**
- La estructura de conversaciones no depende de un usuario autenticado.
- El API Gateway está preparado para recibir middleware de autenticación.
- Los guards del backend están previstos pero no implementados.

**Justificación:** Definir la autenticación en esta fase agregaría complejidad innecesaria al diseño. La arquitectura actual permite incorporarla de forma natural cuando el proyecto lo requiera.

---

## Resumen

La arquitectura de Arquitecto AI se basa en:

1. **Frontend conversacional** que presenta una interfaz amigable para el diálogo con el sistema.
2. **Backend orquestador** que coordina agentes especializados y gestiona el estado.
3. **Agentes de IA** que ejecutan tareas específicas de análisis y diseño.
4. **Persistencia relacional** que garantiza la integridad y continuidad de las conversaciones.
5. **Servicio LLM externo** que proporciona la inteligencia artificial.

Esta arquitectura permite construir el sistema de forma incremental, comenzando por la captura de requerimientos y expandiéndose hacia el diseño funcional, técnico y generación de código en futuras fases.
