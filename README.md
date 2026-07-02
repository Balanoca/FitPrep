#  balanoca
#  FitPrep · SaaS de comidas fit (multi-tenant)

Aplicación web para negocios de comida saludable ("meal prep") y sus clientes
deportistas. Permite gestionar un catálogo de platos, planificar comidas
semanales con control de macros y consolidar la producción de cocina.

Este repositorio es un proyecto back/front con dos partes independientes:

```
FitPrep/
├── backend/     → API REST · Spring Boot 4 · Java 17 · PostgreSQL · Flyway
│                  Arquitectura hexagonal (puertos y adaptadores)
├── frontend/    → SPA · Angular 20 · Angular Material · Tailwind CSS
└── README.md    → este archivo
```

---

## 1. Requisitos previos

Antes de empezar necesitas tener instalado en tu equipo:

| Herramienta    | Versión mínima | Cómo verificar          | Para qué |
|----------------|----------------|-------------------------|----------|
| **Java (JDK)** | 17             | `java -version`         | Backend |
| **PostgreSQL** | 16             | `psql --version`        | Base de datos |
| **Node.js**    | 20             | `node --version`        | Frontend |
| **npm**        | 10             | `npm --version`         | Frontend |

> **Nota:** Maven **no** hace falta instalarlo: el backend incluye el *wrapper*
> `./mvnw` que lo descarga automáticamente. En Windows usa `mvnw.cmd` en lugar
> de `./mvnw`.

### Instalación rápida en macOS (con Homebrew)

```bash
brew install openjdk@17 postgresql@16 node
brew services start postgresql@16   # deja Postgres corriendo en segundo plano
```

---

## 2. Preparar la base de datos

El backend usa **PostgreSQL**. Por defecto se conecta con estos datos (puedes
cambiarlos, ver la sección *Configuración*):

| Parámetro   | Valor por defecto |
|-------------|-------------------|
| Host        | `localhost`       |
| Puerto      | `5432`            |
| Usuario     | `postgres`        |
| Contraseña  | `root`            |
| Base datos  | `Fitprep`         |

### Paso 2.1 · Asegúrate de que PostgreSQL esté corriendo

```bash
brew services start postgresql@16      # macOS
# o en Linux:  sudo systemctl start postgresql
```

### Paso 2.2 · Crea la base de datos vacía

Desde la carpeta `backend/` ejecuta el script incluido:

```bash
cd backend
./scripts/create-db.sh
```

Este script **solo crea la base de datos `Fitprep` vacía** (es idempotente: si
ya existe, no hace nada). Las **tablas y los datos de ejemplo** se crean solos
al arrancar el backend (paso 3), gracias a **Flyway**.

> Si tu usuario o contraseña de Postgres son distintos, pásalos como variables:
> ```bash
> PGUSER=miusuario PGPASSWORD=miclave ./scripts/create-db.sh
> ```
>
> **Alternativa manual** (si no quieres usar el script):
> ```bash
> psql -U postgres -c "CREATE DATABASE \"Fitprep\";"
> ```

---

## 3. Levantar el BACKEND (API)

En una terminal, desde la carpeta `backend/`:

```bash
cd backend
./mvnw spring-boot:run
```

La **primera vez** tardará un poco (descarga dependencias). Al arrancar, Flyway
crea automáticamente las tablas y carga los datos de ejemplo.

**Está listo cuando veas en la consola:** `Started DemoApplication`

La API queda disponible en **http://localhost:8080**

> Deja esta terminal abierta. Para detener el backend: `Ctrl + C`.

---

## 4. Levantar el FRONTEND (interfaz web)

Abre una **segunda terminal** (deja la del backend corriendo). Desde la carpeta
`frontend/`:

```bash
cd frontend
npm install     # solo la primera vez: descarga las dependencias
npm start
```

**Está listo cuando veas:** `➜  Local:   http://localhost:4200/`

> El frontend usa un *proxy* que reenvía las llamadas `/api` al backend en el
> puerto 8080, así que **ambos deben estar corriendo a la vez**.
>
> Deja esta terminal abierta. Para detener el frontend: `Ctrl + C`.

---

## 5. Probar la aplicación

Abre tu navegador en **http://localhost:4200**

Inicia sesión con una de las cuentas de ejemplo (ya vienen cargadas):

 **Negocio** (tenant)    | `admin@fitprep.com`  | `password123` | acceso a Panel, Catálogo de platos (crear/editar), Producción |
| **Deportista** (atleta) | `atleta@fitprep.com` | `password123` | acceso aPanel, Plan semanal, Mis pedidos                     |

### Flujo recomendado para probarlo todo

1. **Entra como negocio** (`admin@fitprep.com`) → ve al **Catálogo** y crea o
   edita algún plato.
2. **Cierra sesión y entra como deportista** (`atleta@fitprep.com`) → ve a
   **Plan semanal**, agrega comidas a los días y **guarda el plan** (verás cómo
   se calculan las calorías y macros en vivo).
3. En **Mis pedidos**, **confirma** el plan que creaste.
4. **Vuelve a entrar como negocio** → en **Producción**, elige la semana del
   plan: verás cuántas unidades de cada plato hay que cocinar.

> También puedes crear tu propia cuenta desde el botón **"Crear cuenta"** en la
> pantalla de inicio de sesión (como atleta o como negocio).

---

## Configuración (opcional)

Si tu PostgreSQL usa credenciales distintas, no hace falta editar código:
puedes pasar variables de entorno al arrancar el backend.

```bash
DB_URL=jdbc:postgresql://localhost:5432/Fitprep \
DB_USERNAME=miusuario \
DB_PASSWORD=miclave \
./mvnw spring-boot:run
```

| Variable      | Por defecto                                    |
|---------------|------------------------------------------------|
| `DB_URL`      | `jdbc:postgresql://localhost:5432/Fitprep`     |
| `DB_USERNAME` | `postgres`                                      |
| `DB_PASSWORD` | `root`                                          |

---

## Resumen ultrarrápido

Para quien ya tiene todo instalado y solo quiere arrancar:

```bash
# 1. Base de datos (una sola vez)
cd backend && ./scripts/create-db.sh

# 2. Backend (terminal 1) — http://localhost:8080
cd backend && ./mvnw spring-boot:run

# 3. Frontend (terminal 2) — http://localhost:4200
cd frontend && npm install && npm start
```

Abre **http://localhost:4200** y entra con `admin@fitprep.com` / `password123`.


### Endpoints principales del backend

- `POST /api/v1/auth/login` · `POST /api/v1/auth/register/{deportista|negocio}` · `GET /api/v1/auth/me`
- `GET/POST/PUT/DELETE /api/v1/platos`
- `POST /api/v1/planes` · `GET /api/v1/planes/mis-planes` · `PATCH /api/v1/planes/{id}/estado`
- `GET /api/v1/logistica/produccion?fechaSemana=AAAA-MM-DD`
