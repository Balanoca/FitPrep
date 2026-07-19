-- =====================================================================
-- FitPrep · Segunda cocina (dark kitchen) de ejemplo
-- Permite probar la elección de cocina al registrarse (Opción B).
-- Contraseña en claro para el usuario: password123
-- =====================================================================

-- Segundo negocio/tenant
INSERT INTO negocio (id, nombre_comercial, slug, ruc, telefono, estado)
VALUES (2, 'FitPrep Norte', 'fitprep-norte', '20987654321', '988777666', 'ACTIVO');

-- Admin (rol TENANT) de la segunda cocina
INSERT INTO usuario (negocio_id, nombres, apellidos, email, password_hash, rol,
                     objetivo_fitness, requerimiento_kcal, req_proteinas_g, req_carbohidratos_g, req_grasas_g)
VALUES
 (2, 'Admin', 'Norte', 'admin@fitprep-norte.com',
  '$2a$10$WVL6RyzeGLd5QNj6j52jJ.YLJVwJN2mAPMV0YaUjcT/HIqpH9dCnu', 'TENANT',
  NULL, NULL, NULL, NULL, NULL);

-- Catálogo propio de la segunda cocina
INSERT INTO plato (negocio_id, nombre, descripcion, precio, calorias, proteinas, carbohidratos, grasas, disponible)
VALUES
 (2, 'Lomo saltado fit', 'Lomo magro, camote al horno y verduras salteadas', 22.00, 560.00, 42.00, 48.00, 18.00, TRUE),
 (2, 'Tallarín verde con pollo', 'Pesto de albahaca ligero, pollo y fideo integral', 19.00, 590.00, 38.00, 55.00, 20.00, TRUE),
 (2, 'Ceviche de pescado', 'Pescado fresco, camote y choclo', 20.00, 340.00, 36.00, 30.00, 6.00, TRUE);

-- Resincronizar la secuencia de negocio tras el INSERT con id explícito
SELECT setval(pg_get_serial_sequence('negocio', 'id'), (SELECT MAX(id) FROM negocio));
