# Flujo de Captura de Requerimientos

## Visión General

El sistema se comporta como un Arquitecto de Software Senior. No formula preguntas de forma secuencial, sino que mantiene una conversación natural donde cada respuesta del usuario influye en lo que se pregunta después.

El flujo está orientado a objetivos, no a cuestionarios. El agente decide qué información necesita en función de lo que ya conoce, qué puede inferir y qué realmente falta.

---

## Principios del Flujo

### 1. Conversación, no formulario

El sistema no sigue una lista fija de preguntas. Cada interacción es una oportunidad para:
- Confirmar información inferida.
- Solicitar solo lo que realmente falta.
- Profundizar en áreas ambiguas.
- Avanzar cuando la información es suficiente.

### 2. Respuestas flexibles

El usuario puede responder de cualquier forma:
- "No sé." → El sistema registra la incertidumbre y propone una alternativa razonable.
- "Me da igual." → El sistema toma una decisión técnica estándar y la registra como supuesto.
- "Confío en tu criterio." → El sistema aplica la mejor práctica para ese contexto.
- Respuestas directas → El sistema las valida y continua.

En todos los casos, el sistema debe registrar la decisión tomada y permitir al usuario revisarla después.

### 3. Inferencias activas

El sistema debe aprovechar la información recibida para deducir datos relacionados:
- Si el usuario menciona "tienda en línea", el sistema puede proponer entidades como Producto, Carrito, Pedido, Pago.
- Si el usuario indica que es una aplicación interna, puede inferir roles como Admin y Empleado.
- Si menciona que maneja datos sensibles, puede sugerir requisitos de seguridad.

Las inferencias se presentan como propuestas que el usuario debe confirmar o rechazar.

### 4. Validaciones semánticas

Las validaciones no son reglas rígidas como "mínimo 10 palabras". En su lugar, se evalúa:
- ¿La información es suficiente para comprender la intención?
- ¿Es coherente con lo que ya se sabe?
- ¿Permite tomar decisiones técnicas informadas?
- ¿Existen ambigüedades que deban resolverse?

### 5. Supuestos registrados

Cuando el usuario no proporciona información o delega la decisión, el sistema genera un supuesto justificado. Todos los supuestos quedan registrados en un documento separado que el usuario puede revisar y modificar al final del proceso.

---

## Objetivos del Flujo

Cada fase tiene un objetivo de información, no una lista de preguntas. El agente decide cómo alcanzarlo según el contexto.

### Objetivo 1: Comprender el Contexto

**Qué necesita el sistema saber:**
- Nombre o identificador del proyecto.
- Dominio o industria.
- Problema que resuelve.
- Usuarios finales.

**Cómo lo obtiene:**
- Puede empezar preguntando directamente por el objetivo del proyecto.
- Si el usuario menciona un dominio conocido (ej: "una app para restaurantes"), el sistema puede inferir usuarios típicos y proponerlos.
- Si el usuario no sabe cómo formular el problema, el sistema puede pedir que lo describa con un ejemplo concreto.

**Resultado esperado:**
- Una comprensión clara de qué es el sistema y para quién es.
- Al menos un caso de uso representativo.

---

### Objetivo 2: Identificar Qué Debe Hacer el Sistema

**Qué necesita el sistema saber:**
- Funcionalidades principales.
- Interacciones del usuario.
- Roles y permisos.
- Reglas de negocio.

**Cómo lo obtiene:**
- A partir de la descripción del problema, el sistema puede proponer funcionalidades comunes para ese dominio.
- El usuario confirma, rechaza o modifica las propuestas.
- Si el usuario describe un flujo específico, el sistema lo descompone en funcionalidades.
- Si el usuario delega, el sistema propone un conjunto base y justifica cada elección.

**Inferencias típicas:**
| Dominio | Funcionalidades inferidas |
|---------|---------------------------|
| Tienda en línea | Catálogo, Carrito, Checkout, Pagos, Envíos |
| App de reservas | Calendario, Reservas, Notificaciones, Pagos |
| CRM | Contactos, Oportunidades, Pipeline, Reportes |
| Dashboard interno | Métricas, Filtros, Exportación, Roles |

**Resultado esperado:**
- Lista de funcionalidades con descripción breve.
- Roles de usuario identificados.
- Reglas de negocio documentadas.

---

### Objetivo 3: Definir Restricciones y Calidad

**Qué necesita el sistema saber:**
- Volumen esperado de usuarios.
- Tiempo de respuesta aceptable.
- Nivel de seguridad.
- Disponibilidad requerida.
- Integraciones con otros sistemas.
- Plataformas objetivo.

**Cómo lo obtiene:**
- El sistema puede preguntar por el contexto de uso (¿es interno? ¿público? ¿móvil?).
- A partir de ahí, inferir volúmenes y requisitos de rendimiento.
- Si el usuario indica que maneja datos sensibles (salud, finanzas), el sistema propone requisitos de seguridad.
- Si no hay restricciones conocidas, el sistema aplica estándares razonables para ese tipo de aplicación.

**Supuestos comunes:**
| Contexto | Supuesto razonable |
|----------|---------------------|
| App interna, < 50 usuarios | Rendimiento moderado, seguridad básica |
| App pública, miles de usuarios | Alta disponibilidad, seguridad estricta |
| App móvil + web | Responsive, sincronización de datos |
| Datos financieros o de salud | Cifrado, auditoría, cumplimiento normativo |

**Resultado esperado:**
- Requerimientos no funcionales definidos.
- Supuestos registrados cuando no hay información directa.

---

### Objetivo 4: Definir el Stack Técnico

**Qué necesita el sistema saber:**
- Preferencias de tecnología (si las hay).
- Restricciones de infraestructura.
- Equipo disponible (si aplica).
- Base de datos preferida.

**Cómo lo obtiene:**
- Si el usuario no tiene preferencia, el sistema propone una stack coherente según el tipo de aplicación.
- Si el usuario menciona tecnologías específicas, el sistema valida compatibilidad.
- Si hay restricciones (ej: "debe correr en AWS"), se ajusta la propuesta.

**Propuestas típicas por tipo de aplicación:**
| Tipo de app | Stack sugerido |
|-------------|----------------|
| MVP rápido | Next.js + Supabase |
| App empresarial | NestJS + React + PostgreSQL |
| App móvil | React Native + NestJS |
| Microservicios | NestJS + Docker + Kafka |

**Resultado esperado:**
- Stack técnico propuesto y justificado.
- Supuestos de infraestructura registrados.

---

### Objetivo 5: Validar Completitud y Coherencia

**Qué necesita el sistema hacer:**
- Resumir toda la información capturada e inferida.
- Identificar inconsistencias o ambigüedades.
- Listar los supuestos tomados.
- Confirmar con el usuario que todo es correcto.

**Cómo lo hace:**
- Presenta un resumen organizado por categorías.
- Resalta las decisiones que tomó el sistema (supuestos) para que el usuario las revise.
- Si detecta información contradictoria, la señala y pide clarificación.
- El usuario puede modificar cualquier aspecto antes de finalizar.

**Resultado esperado:**
- Documento de requerimientos completo.
- Lista de supuestos confirmados o modificados.
- Lista de dudas pendientes (si las hay).

---

## Estructura de la Conversación

### Ejemplo de Flujo Natural

```
Sistema: Hola, soy tu Arquitecto de Software. ¿Qué estás intentando construir?

Usuario: Quiero una plataforma para que los clientes de mi restaurante puedan hacer pedidos online.

Sistema: Entendido. ¿Es solo para pedidos para llevar o también para mesas?

Usuario: Solo para llevar.

Sistema: Perfecto. Para una app de pedidos de restaurante, las funcionalidades típicas serían:
- Menú con categorías y precios
- Carrito de compras
- Proceso de checkout
- Pago en línea
- Seguimiento del pedido
- Notificaciones

¿Te parece correcto o hay algo que quieras agregar o quitar?

Usuario: Me da igual, tú decides.

Sistema: OK, mantengo esas funcionalidades. Para los usuarios, propongo:
- Cliente (puede ver menú, hacer pedidos, pagar)
- Admin del restaurante (puede gestionar menú, ver pedidos, cambiar estados)

¿Estás de acuerdo?

Usuario: Sí.

Sistema: ¿Cuántos pedidos simultáneos esperas en horas pico?

Usuario: No sé, 100 quizás.

Sistema: Tomo 100 como referencia. Para ese volumen, propongo:
- Tiempo de respuesta: menos de 2 segundos
- Disponibilidad: 99% (considerando horarios del restaurante)
- Seguridad media (datos de pago, pero sin datos sensibles de salud)

¿Te parece bien?

Usuario: Sí.

Sistema: ¿Tienes preferencia por alguna tecnología?

Usuario: No, confío en tu criterio.

Sistema: Propongo Next.js para el frontend y NestJS para el backend, con PostgreSQL como base de datos. 
Esta stack es robusta, escalable y tiene buena documentación.

¿Algo que cambiar o seguimos con esto?

Usuario: Está bien.

Sistema: [Genera resumen con todos los supuestos para revisión]
```

---

## Gestión de Supuestos

### ¿Qué es un supuesto?

Un supuesto es una decisión técnica o funcional que el sistema toma cuando el usuario no proporciona información específica o delega la decisión.

### Formato de registro

Cada supuesto se registra con:
- **Campo:** Qué se está asumiendo.
- **Valor asumido:** Qué decidió el sistema.
- **Justificación:** Por qué esa decisión es razonable.
- **Confianza:** Alta / Media / Baja (según cuánto se infiera del contexto).

### Ejemplo

| Campo | Valor asumido | Justificación | Confianza |
|-------|---------------|---------------|-----------|
| Usuarios simultáneos | 100 | El usuario mencionó "100 quizás" | Alta |
| Tiempo de respuesta | < 2 segundos | Estándar para apps de pedidos | Media |
| Seguridad | Media | Maneja pagos, no datos sensibles | Alta |
| Stack | Next.js + NestJS + PostgreSQL | Estándar para este tipo de app | Alta |
| Hosting | Cloud (AWS/Vercel) | Sin restricciones mencionadas | Media |

### Revisión de supuestos

Al final del flujo, el sistema presenta todos los supuestos al usuario para que:
- Confirme los correctos.
- Modifique los que quiera cambiar.
- Añada información que falte.

---

## Información Mínima Requerida

Para que el sistema pueda generar un diseño técnico, necesita al menos:

### Información esencial (no negociable)
- Qué problema resuelve el sistema.
- Para quién es (usuarios finales).

Si falta esta información, el sistema solicita clarificación antes de continuar, incluso si el usuario intenta delegar. Sin embargo, si el usuario describe un dominio conocido (ej: "tienda en línea"), el sistema puede inferir el problema y los usuarios, y solo confirma la inferencia.

### Información que puede inferirse o delegarse
- Funcionalidades principales.
- Roles de usuario.
- Volumen de usuarios.
- Restricciones de seguridad.
- Preferencias tecnológicas.

Cuando el usuario delega una decisión (ej: "tú decides"), el sistema genera supuestos justificados que se revisan al final.

### Información complementaria
- Integraciones existentes.
- Presupuesto o restricciones de infraestructura.
- Plazos de entrega.
- Equipo de desarrollo disponible.

Si esta información no se proporciona, se registra como pendiente pero no bloquea el flujo.

---

## Validaciones Semánticas

En lugar de reglas rígidas, el sistema valida:

### Suficiencia
- ¿Hay suficiente información para comprender la intención del usuario?
- ¿Se puede tomar una decisión técnica con lo que se sabe?

### Coherencia
- ¿La nueva información es consistente con lo que ya se dijo?
- ¿Hay contradicciones que deban resolverse?

### Claridad
- ¿Hay ambigüedades en la descripción?
- ¿Se entiende qué debe hacer el sistema en cada caso?

### Completitud
- ¿Falta información crítica para el diseño?
- ¿Hay áreas del sistema que no se han cubierto?

Si alguna validación falla, el sistema solicita aclaración de forma conversacional, no como error de formulario.

---

## Documentos de Salida

Al finalizar el flujo, el sistema genera:

### 1. Documento de Requerimientos
- Resumen ejecutivo del sistema.
- Requerimientos funcionales detallados.
- Requerimientos no funcionales.
- Roles y permisos.
- Reglas de negocio.

### 2. Documento de Supuestos
- Lista completa de supuestos tomados.
- Justificación de cada uno.
- Estado: confirmado / modificado / pendiente.

### 3. Lista de Dudas
- Información ambigua que necesita clarificación.
- Decisiones que el usuario dejó pendientes.
- Áreas que requieren más profundización.

### 4. Modelo Preliminar
- Entidades identificadas.
- Relaciones entre entidades.
- Flujo de usuario principal.

---

## Notas de Implementación

- El sistema debe mantener contexto completo de la conversación.
- El usuario puede revisar o modificar respuestas anteriores en cualquier momento.
- El sistema debe ser capaz de retomar la conversación desde cualquier punto.
- Los supuestos se actualizan en tiempo real a medida que el usuario proporciona información.
- El resumen final debe ser exportable (Markdown, PDF).
- El sistema debe poder justificar cada recomendación que haga.