# Guía de Infraestructura Docker

Guía práctica para levantar y detener los servicios de desarrollo del proyecto Arquitecto AI usando Docker Compose.

## Prerrequisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.
- Docker Compose incluido (viene con Docker Desktop v2.0+).
- Verificar instalación:

```bash
docker --version
docker compose version
```

## Estructura

```
infrastructure/docker/
├── docker-compose.yml   # Definición de servicios
├── .env                 # Variables de entorno (no commitear)
└── .env.example         # Plantilla de variables
```

## Configuración inicial

Si es la primera vez, copia el archivo de ejemplo y ajusta las credenciales:

```bash
cd infrastructure/docker
cp .env.example .env
```

Edita `.env` y cambia los valores por defecto por contraseñas seguras antes de levantar los servicios.

## Comandos principales

Todos los comandos se ejecutan desde el directorio `infrastructure/docker/`.

### Levantar servicios

```bash
docker compose up -d
```

- `-d` (detached): ejecuta los contenedores en segundo plano.
- La primera ejecución descarga la imagen de MariaDB 11.8, lo cual puede tardar unos minutos.
- MariaDB queda disponible en `localhost:3306`.

### Verificar que los servicios están corriendo

```bash
docker compose ps
```

Muestra el estado de cada contenedor. Busca que `arquitecto-db` tenga estado `Up`.

### Ver logs

```bash
docker compose logs
```

Para seguir los logs en tiempo real:

```bash
docker compose logs -f mariadb
```

Presiona `Ctrl+C` para salir del seguimiento.

### Detener servicios

```bash
docker compose stop
```

Detiene los contenedores pero **conserva los datos** en el volume. Puedes reanudar después con `docker compose start`.

### Detener y eliminar contenedores

```bash
docker compose down
```

Detiene y elimina los contenedores. Los datos en el volume **se mantienen**.

### Detener y eliminar todo (incluidos datos)

```bash
docker compose down -v
```

- `-v` elimina los volumes asociados.
- **Esto borra permanentemente todos los datos de la base de datos.**
- Solo usar en desarrollo cuando necesites reiniciar desde cero.

## Referencia rápida

| Comando | Qué hace |
|---|---|
| `docker compose up -d` | Levanta servicios en segundo plano |
| `docker compose ps` | Muestra estado de contenedores |
| `docker compose logs -f mariadb` | Sigue logs de MariaDB en tiempo real |
| `docker compose stop` | Detiene contenedores (conserva datos) |
| `docker compose start` | Reanuda contenedores detenidos |
| `docker compose down` | Detiene y elimina contenedores (conserva datos) |
| `docker compose down -v` | Detiene, elimina contenedores y volumes (borra datos) |
| `docker compose restart mariadb` | Reinicia un servicio específico |

## Conexión a la base de datos

### Desde la línea de comandos

```bash
docker exec -it arquitecto-db mariadb -u arquitecto -p
```

Te solicitará la contraseña definida en `MARIADB_PASSWORD` del archivo `.env`.

### Desde una herramienta gráfica (DBeaver, TablePlus, etc.)

| Campo | Valor |
|---|---|
| Host | `localhost` |
| Port | `3306` |
| Database | `arquitecto_ai` |
| User | `arquitecto` |
| Password | (la de `MARIADB_PASSWORD` en `.env`) |

## Solución de problemas

### El contenedor no arranca

```bash
docker compose logs mariadb
```

Causas comunes:
- Puerto 3306 ya en uso: cierra la otra instancia o cambia el puerto en `docker-compose.yml` (`"3307:3306"`).
- Archivo `.env` con variables vacías: verifica que exista y tenga valores.

### La conexión es rechazada

- Verifica que el contenedor esté corriendo: `docker compose ps`.
- Verifica que MariaDB terminó de iniciar: `docker compose logs mariadb | grep ready`.
- Espera unos segundos tras el `up -d` y vuelve a intentar.

### Error de permisos en el volume

```bash
docker compose down -v
docker compose up -d
```

Esto recrea el volume desde cero. Los datos se perderán.

### Puerto 3306 ya en uso en el host

Si tienes MariaDB o MySQL instalado localmente, el puerto puede estar ocupado. Soluciones:

1. Detener el servicio local.
2. Cambiar el mapeo de puertos en `docker-compose.yml`:

```yaml
ports:
  - "3307:3306"
```

Y actualizar `MARIADB_PORT` en `.env` a `3307`.
