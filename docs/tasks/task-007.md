# TASK-007

## Descripción
Realizar la configuración Prisma ORM usando la instancia de mariaDB

## Objetivo

Configurar Prisma ORM como capa de persistencia del proyecto, utilizando la instancia de MariaDB ya disponible.

## Alcance

Esta tarea únicamente configura Prisma y la conexión a la base de datos.

No implementa el modelo de dominio.

## Restricciones
No crear modelos Prisma.
No implementar tablas.
No generar migraciones del dominio.
No implementar repositorios.
No implementar servicios.
No modificar la infraestructura Docker.
No cambiar la configuración de MariaDB.
Entregables

##  Entregables
Como mínimo deberá:

Instalar Prisma.
Instalar @prisma/client.
Inicializar Prisma.
Crear prisma/schema.prisma.
Configurar el datasource para MariaDB.
Configurar el generator.
Configurar Prisma para utilizar la variable DATABASE_URL.
Agregar los scripts necesarios en package.json.
Verificar la conexión con la base de datos.
Documentar las decisiones técnicas tomadas.

## Criterios de aceptación

La tarea estará completa cuando:

Prisma pueda generar correctamente el cliente.
El proyecto pueda conectarse a MariaDB utilizando DATABASE_URL.
Exista la configuración base lista para comenzar a implementar el esquema del modelo de persistencia en la siguiente tarea.

Estado: Completada

## Decisiones técnicas

### Versión de Prisma

Se utilizó Prisma 7.9.0, que es la versión estable más reciente al momento de la implementación.

### Generador de cliente

Se configuró el generador `prisma-client` con salida a `../src/generated/prisma` para mantener el código generado separado del código fuente y facilitar su exclusión en `.gitignore`.

### Datasource

Se configuró el provider como `mysql` (compatible con MariaDB) y se utilizó la variable de entorno `DATABASE_URL` para la conexión, siguiendo las mejores prácticas de 12-factor app.

### Scripts en package.json

Se agregaron los siguientes scripts para facilitar el trabajo con Prisma:

- `prisma:generate` - Genera el cliente Prisma
- `prisma:migrate:dev` - Crea migraciones en desarrollo
- `prisma:migrate:deploy` - Aplica migraciones en producción
- `prisma:studio` - Abre la interfaz visual de Prisma
- `prisma:validate` - Valida el esquema Prisma
- `prisma:format` - Formatea el esquema Prisma

### Variables de entorno

Se utilizó la configuración de MariaDB existente en `infrastructure/docker/.env`:
- Usuario: `arquitecto` (no root)
- Base de datos: `arquitecto_ai`
- Puerto: `3306`

### Verificación de conexión

Se verificó exitosamente la conexión ejecutando `prisma db execute` con una consulta SQL simple, confirmando que Prisma puede conectarse correctamente a MariaDB.

### Driver Adapter (Prisma 7)

Prisma 7 introdujo un cambio fundamental: el nuevo provider `prisma-client` (el Rust-free client) **requiere un driver adapter para todas las bases de datos**. Esto se debe a que Prisma 7 separó el query compiler del cliente, haciéndolo más ligero y modular.

Para MariaDB/MySQL, se utilizaron los paquetes:
- `@prisma/adapter-mariadb` - Driver adapter oficial de Prisma para MariaDB
- `mariadb` - Driver nativo de MariaDB para Node.js

El adapter se instancia en `PrismaService` y se pasa al constructor de `PrismaClient`:

```typescript
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });
```

Uso del PrismaService
En cualquier servicio de NestJS:
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SomeService {
  constructor(private prisma: PrismaService) {}
}
```
### Integración con NestJS

Se implementaron los siguientes archivos en `src/database/`:

- `prisma.service.ts` - Servicio que extiende `PrismaClient` e implementa los ciclos de vida de NestJS (`OnModuleInit`, `OnModuleDestroy`)
- `prisma.module.ts` - Módulo global que exporta `PrismaService` para inyección de dependencias

El módulo se registra en `AppModule` para que `PrismaService` esté disponible en toda la aplicación.

### Próximos pasos

La configuración base está lista para la siguiente tarea, que deberá:
1. Definir el esquema del modelo de persistencia en `prisma/schema.prisma`
2. Crear las migraciones iniciales
3. Implementar los repositorios correspondientes