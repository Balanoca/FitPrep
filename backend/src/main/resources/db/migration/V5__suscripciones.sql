-- =====================================================================
-- FitPrep · Suscripciones de negocios (B2B)
-- La dark kitchen paga una cuota mensual al SaaS para operar. Pago simulado
-- (sin pasarela): se registra el pago y se extiende el vencimiento.
-- =====================================================================

-- 1. Catálogo de planes del SaaS (global, no por tenant)
CREATE TABLE plan_suscripcion (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL UNIQUE,
    precio_mensual DOUBLE PRECISION NOT NULL,
    max_platos INT,                 -- límite informativo (NULL = ilimitado)
    max_clientes INT,               -- límite informativo (NULL = ilimitado)
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. Suscripción de un negocio (una por negocio)
CREATE TABLE suscripcion (
    id BIGSERIAL PRIMARY KEY,
    negocio_id INT NOT NULL UNIQUE,
    plan_id BIGINT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PRUEBA',   -- PRUEBA, ACTIVA, VENCIDA, CANCELADA
    fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE NOT NULL,
    CONSTRAINT fk_suscripcion_negocio FOREIGN KEY (negocio_id) REFERENCES negocio(id) ON DELETE CASCADE,
    CONSTRAINT fk_suscripcion_plan FOREIGN KEY (plan_id) REFERENCES plan_suscripcion(id) ON DELETE RESTRICT
);

-- 3. Histórico de pagos de la suscripción (simulados)
CREATE TABLE pago_suscripcion (
    id BIGSERIAL PRIMARY KEY,
    suscripcion_id BIGINT NOT NULL,
    monto DOUBLE PRECISION NOT NULL,
    fecha_pago TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    periodo_desde DATE NOT NULL,
    periodo_hasta DATE NOT NULL,
    CONSTRAINT fk_pago_suscripcion FOREIGN KEY (suscripcion_id) REFERENCES suscripcion(id) ON DELETE CASCADE
);

CREATE INDEX idx_suscripcion_negocio ON suscripcion (negocio_id);
CREATE INDEX idx_pago_suscripcion ON pago_suscripcion (suscripcion_id);

-- =====================================================================
-- Seed
-- =====================================================================

-- Planes del SaaS
INSERT INTO plan_suscripcion (nombre, precio_mensual, max_platos, max_clientes) VALUES
 ('Básico', 49.00, 20, 50),
 ('Pro',    99.00, 100, 300),
 ('Premium', 199.00, NULL, NULL);

-- Suscripción activa para las cocinas existentes (Demo y Norte), en plan Básico,
-- vigente un mes desde hoy.
INSERT INTO suscripcion (negocio_id, plan_id, estado, fecha_inicio, fecha_vencimiento)
SELECT 1, (SELECT id FROM plan_suscripcion WHERE nombre='Básico'), 'ACTIVA', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 month';
INSERT INTO suscripcion (negocio_id, plan_id, estado, fecha_inicio, fecha_vencimiento)
SELECT 2, (SELECT id FROM plan_suscripcion WHERE nombre='Básico'), 'ACTIVA', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 month';

-- Un pago inicial para cada una, cubriendo el primer mes.
INSERT INTO pago_suscripcion (suscripcion_id, monto, periodo_desde, periodo_hasta)
SELECT s.id, 49.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 month'
FROM suscripcion s;

-- Usuario ADMIN de la plataforma (gestiona las suscripciones de todos los
-- negocios). Contraseña: password123. Se asocia al negocio 1 por la restricción
-- NOT NULL, pero su rol ADMIN le da acceso global.
INSERT INTO usuario (negocio_id, nombres, apellidos, email, password_hash, rol)
VALUES
 (1, 'Super', 'Admin', 'superadmin@fitprep.com',
  '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'ADMIN');
