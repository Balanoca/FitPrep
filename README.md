# FitPrep · SaaS de comidas fit (multi-tenant)

Monorepo con el backend (Spring Boot, arquitectura hexagonal) y el frontend
(Angular + Material). Cada parte vive en su propia carpeta y se ejecuta de forma
independiente.

```
FitPrep/
├── backend/     → API REST · Spring Boot 4 · Java 17 · PostgreSQL · Flyway
│                  Arquitectura hexagonal (puertos y adaptadores) por bounded context
├── frontend/    → SPA · Angular 20 (standalone) · Angular Material · Tailwind
│                  Feature-based + Core/Shared, la "capa web" del hexágono
├── scripts/     → utilidades (creación de BD, etc.)
└── README.md
```

## Arquitectura

- **Backend — Hexagonal estricta.** Cada contexto (`catalogo_nutricional`,
  `gestion_usuarios`, `planificacion_semanal`, `logistica_cocina`) separa
  `domain/` (modelo puro + puertos) de `infrastructure/adapter/{in/web,out/persistence}`.
  El dominio no conoce JPA ni Spring.
- **Frontend — Feature-based + Clean ligera.** `core/` (auth, interceptors,
  guards, layout), `shared/ui/` (componentes de presentación), `features/`
  (una carpeta por dominio, espeja los contextos del backend). Standalone
  components, Signals para estado, lazy loading por rol.
- **Multi-tenant.** El backend resuelve el tenant vía JWT (`tenantId`) y el
  filtro de Hibernate `@TenantId`. El frontend adjunta el JWT en cada request
  mediante un interceptor.

## Requisitos

- Java 17+ y PostgreSQL 16 (para `backend/`)
- Node 20+ y npm (para `frontend/`)

## Puesta en marcha

### 1. Base de datos + Backend

```bash
cd backend
./scripts/create-db.sh        # crea la BD "Fitprep" en el Postgres local
./mvnw spring-boot:run        # Flyway migra + seed, API en http://localhost:8080
```

### 2. Frontend

```bash
cd frontend
npm install                   # solo la primera vez
npm start                     # dev-server en http://localhost:4200 (proxy → :8080)
```

Abre http://localhost:4200 y entra con las credenciales de ejemplo.

## Credenciales de ejemplo (seed)

| Rol       | Email                | Contraseña    |
|-----------|----------------------|---------------|
| Tenant    | `admin@fitprep.com`  | `password123` |
| Deportista| `atleta@fitprep.com` | `password123` |

## Endpoints principales (backend)

- `POST /api/v1/auth/login` · `POST /api/v1/auth/register/*` · `GET /api/v1/auth/me`
- `GET/POST/PUT/DELETE /api/v1/platos`
- `POST/GET /api/v1/planes`
- `GET /api/v1/logistica/produccion`
