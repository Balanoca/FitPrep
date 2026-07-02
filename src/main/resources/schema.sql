-- 1. Tabla Negocio (Tenants)
CREATE TABLE negocio (
    id SERIAL PRIMARY KEY,
    nombre_comercial VARCHAR(150) NOT NULL,
    slug VARCHAR(50) NOT NULL UNIQUE,
    ruc VARCHAR(11) NOT NULL UNIQUE,
    telefono VARCHAR(15),
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla Usuario (Clientes)
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    negocio_id INT NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'ATHLETE',
    objetivo_fitness VARCHAR(50),
    requerimiento_kcal NUMERIC(6,2),
    req_proteinas_g NUMERIC(5,2),
    req_carbohidratos_g NUMERIC(5,2),
    req_grasas_g NUMERIC(5,2),
    CONSTRAINT fk_usuario_negocio FOREIGN KEY (negocio_id) REFERENCES negocio(id) ON DELETE CASCADE
);

-- 3. Tabla Plato (Catálogo)
CREATE TABLE plato (
    id SERIAL PRIMARY KEY,
    negocio_id INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(6,2) NOT NULL,
    calorias NUMERIC(6,2) NOT NULL,
    proteinas NUMERIC(5,2) NOT NULL,
    carbohidratos NUMERIC(5,2) NOT NULL,
    grasas NUMERIC(5,2) NOT NULL,
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_plato_negocio FOREIGN KEY (negocio_id) REFERENCES negocio(id) ON DELETE CASCADE
);

-- 4. Tabla Plan Semanal (Cabecera)
CREATE TABLE plan_semanal (
    id SERIAL PRIMARY KEY,
    negocio_id INT NOT NULL,
    usuario_id INT NOT NULL,
    fecha_inicio_semana DATE NOT NULL,
    estado_pago VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    monto_total NUMERIC(7,2) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_plan_negocio FOREIGN KEY (negocio_id) REFERENCES negocio(id) ON DELETE CASCADE,
    CONSTRAINT fk_plan_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- 5. Tabla Detalle Plan (Distribución)
CREATE TABLE detalle_plan (
    id SERIAL PRIMARY KEY,
    plan_semanal_id INT NOT NULL,
    plato_id INT NOT NULL,
    dia_semana VARCHAR(15) NOT NULL,
    tipo_comida VARCHAR(20) NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    CONSTRAINT fk_detalle_plan FOREIGN KEY (plan_semanal_id) REFERENCES plan_semanal(id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_plato FOREIGN KEY (plato_id) REFERENCES plato(id) ON DELETE RESTRICT
);
