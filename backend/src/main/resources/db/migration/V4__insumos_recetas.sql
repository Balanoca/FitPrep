-- =====================================================================
-- FitPrep · Insumos (ingredientes) y recetas
-- Permite a la cocina saber cuánto comprar: cada plato tiene una receta
-- (insumos + cantidades) que se consolida contra los pedidos de la semana.
-- =====================================================================

-- 1. Catálogo de insumos por cocina (tenant)
CREATE TABLE insumo (
    id BIGSERIAL PRIMARY KEY,
    negocio_id INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    unidad VARCHAR(20) NOT NULL,               -- kg, g, l, ml, unidad, ...
    precio_unitario DOUBLE PRECISION,          -- opcional: costo por unidad, para estimar la compra
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_insumo_negocio FOREIGN KEY (negocio_id) REFERENCES negocio(id) ON DELETE CASCADE,
    CONSTRAINT uq_insumo_negocio_nombre UNIQUE (negocio_id, nombre)
);

-- 2. Receta: qué insumos y cuánta cantidad lleva UNA unidad de un plato
CREATE TABLE receta (
    id BIGSERIAL PRIMARY KEY,
    negocio_id INT NOT NULL,
    plato_id BIGINT NOT NULL,
    insumo_id BIGINT NOT NULL,
    cantidad DOUBLE PRECISION NOT NULL,        -- cantidad de insumo por 1 plato (en la unidad del insumo)
    CONSTRAINT fk_receta_negocio FOREIGN KEY (negocio_id) REFERENCES negocio(id) ON DELETE CASCADE,
    CONSTRAINT fk_receta_plato FOREIGN KEY (plato_id) REFERENCES plato(id) ON DELETE CASCADE,
    CONSTRAINT fk_receta_insumo FOREIGN KEY (insumo_id) REFERENCES insumo(id) ON DELETE RESTRICT,
    CONSTRAINT uq_receta_plato_insumo UNIQUE (plato_id, insumo_id)
);

CREATE INDEX idx_insumo_negocio ON insumo (negocio_id);
CREATE INDEX idx_receta_negocio ON receta (negocio_id);
CREATE INDEX idx_receta_plato ON receta (plato_id);
CREATE INDEX idx_receta_insumo ON receta (insumo_id);

-- =====================================================================
-- Seed de ejemplo
-- =====================================================================

-- Insumos de la cocina 1 (FitPrep Demo)
INSERT INTO insumo (negocio_id, nombre, unidad, precio_unitario) VALUES
 (1, 'Pechuga de pollo', 'kg', 14.00),
 (1, 'Quinua',           'kg', 12.00),
 (1, 'Salmón',           'kg', 45.00),
 (1, 'Arroz integral',   'kg',  6.50),
 (1, 'Palta',            'unidad', 2.50),
 (1, 'Atún',             'lata',  8.00),
 (1, 'Huevo',            'unidad', 0.50);

-- Insumos de la cocina 2 (FitPrep Norte)
INSERT INTO insumo (negocio_id, nombre, unidad, precio_unitario) VALUES
 (2, 'Lomo de res',      'kg', 32.00),
 (2, 'Camote',           'kg',  4.00),
 (2, 'Pescado fresco',   'kg', 22.00),
 (2, 'Fideo integral',   'kg',  7.00),
 (2, 'Albahaca',         'atado', 2.00);

-- Recetas de la cocina 1. Se referencian los platos por (negocio, nombre) en
-- lugar de por id fijo, para no depender del estado de la secuencia.
INSERT INTO receta (negocio_id, plato_id, insumo_id, cantidad)
SELECT 1,
       (SELECT id FROM plato  WHERE negocio_id=1 AND nombre='Pechuga a la plancha con quinua'),
       (SELECT id FROM insumo WHERE negocio_id=1 AND nombre=x.insumo),
       x.cantidad
FROM (VALUES ('Pechuga de pollo', 0.25), ('Quinua', 0.10)) AS x(insumo, cantidad);

INSERT INTO receta (negocio_id, plato_id, insumo_id, cantidad)
SELECT 1,
       (SELECT id FROM plato  WHERE negocio_id=1 AND nombre='Bowl de salmón'),
       (SELECT id FROM insumo WHERE negocio_id=1 AND nombre=x.insumo),
       x.cantidad
FROM (VALUES ('Salmón', 0.20), ('Arroz integral', 0.12), ('Palta', 0.50)) AS x(insumo, cantidad);

-- Recetas de la cocina 2
INSERT INTO receta (negocio_id, plato_id, insumo_id, cantidad)
SELECT 2,
       (SELECT id FROM plato  WHERE negocio_id=2 AND nombre='Lomo saltado fit'),
       (SELECT id FROM insumo WHERE negocio_id=2 AND nombre=x.insumo),
       x.cantidad
FROM (VALUES ('Lomo de res', 0.20), ('Camote', 0.15)) AS x(insumo, cantidad);

INSERT INTO receta (negocio_id, plato_id, insumo_id, cantidad)
SELECT 2,
       (SELECT id FROM plato  WHERE negocio_id=2 AND nombre='Tallarín verde con pollo'),
       (SELECT id FROM insumo WHERE negocio_id=2 AND nombre=x.insumo),
       x.cantidad
FROM (VALUES ('Fideo integral', 0.12), ('Albahaca', 0.25)) AS x(insumo, cantidad);
