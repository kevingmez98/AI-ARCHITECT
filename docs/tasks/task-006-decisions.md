# Decisiones Técnicas - TASK-006

## Inicialización del Backend

### 1. Versión de NestJS

**Decisión:** NestJS v11.

**Justificación:** Es la versión estable más reciente al momento de la inicialización. Ofrece soporte completo para TypeScript 5.7, ESM y mejoras en rendimiento.

---

### 2. Configuración de TypeScript

**Decisión:** Usar `moduleResolution: nodenext` con target ES2023.

**Justificación:** Permite compatibilidad nativa con ESM y CommonJS. `nodenext` es la estrategia recomendada por NestJS para nuevos proyectos. Se agregaron path aliases (`@common/*`, `@modules/*`, `@database/*`, `@integrations/*`) para facilitar las importaciones y reflejar la arquitectura de carpetas.

---

### 3. Gestión de Variables de Entorno

**Decisión:** `@nestjs/config` con `ConfigModule` en modo global.

**Justificación:** Proporciona una forma estandarizada de acceder a variables de entorno en cualquier parte del sistema. El modo global evita importar el módulo en cada feature module. Se crearon archivos `.env` y `.env.example` en la raíz del backend.

---

### 4. Prefijo API Global

**Decisión:** `/api` como prefijo global para todos los endpoints.

**Justificación:** Separa claramente las rutas de la API del frontend (que se sirve en la raíz). Facilita configurar un proxy inverso o CORS de forma más sencilla.

---

### 5. Estructura de Carpetas

**Decisión:** Seguir estrictamente la estructura definida en `docs/design/architecture.md`.

**Justificación:** La arquitectura ya fue aprobada y documentada. La estructura refleja la separación por dominios de negocio (módulos), componentes transversales (common), persistencia (database) e integraciones externas (integrations).

---

### 6. Linting y Formato

**Decisión:** Mantener ESLint y Prettier configurados por el CLI de NestJS, con `printWidth: 100`.

**Justificación:** La configuración por defecto del CLI ya integra `typescript-eslint` y `eslint-plugin-prettier`. Se ajustó `printWidth` a 100 caracteres para mejor legibilidad en pantallas modernas.

---

### 7. Gestión de Paquetes

**Decisión:** npm como gestor de paquetes.

**Justificación:** Es el gestor por defecto del ecosistema Node.js y NestJS. No se justifica introducir otro gestor (yarn, pnpm) sin requerimientos específicos que lo demanden.

---

### 8. Scripts de Desarrollo

**Decisión:** Usar los scripts estándar del CLI de NestJS.

**Justificación:** `start:dev` (watch mode), `start:debug`, `build`, `lint`, `test` y `test:e2e` cubren las necesidades de desarrollo, verificación y despliegue.

---

### 9. Eliminación del Controller/Service Demo

**Decisión:** Eliminar `app.controller.ts`, `app.service.ts` y `app.controller.spec.ts` generados por el scaffolding.

**Justificación:** Estos archivos contienen un endpoint de ejemplo ("Hello World") que no forma parte de la arquitectura definida. El `app.module.ts` queda limpio y listo para recibir los módulos reales del sistema.

---

## Archivos Creados/Modificados

| Archivo | Acción |
|---------|--------|
| `backend/src/main.ts` | Configurado con `ConfigService` y prefijo global `/api` |
| `backend/src/app.module.ts` | Limpio, solo importa `ConfigModule` |
| `backend/tsconfig.json` | Agregados path aliases y `types` restringidos |
| `backend/.prettierrc` | Configuración de formato |
| `backend/.env` | Variables de entorno iniciales |
| `backend/.env.example` | Plantilla de variables de entorno |
| `backend/src/modules/*` | 5 carpetas: conversation, agents, documents, assumptions, state |
| `backend/src/common/*` | 4 carpetas: guards, interceptors, dto, filters |
| `backend/src/database/entities` | Carpeta para entidades de persistencia |
| `backend/src/integrations/llm` | Carpeta para abstracción del servicio LLM |
| `.gitignore` | Actualizado con entradas IDE y OS |
