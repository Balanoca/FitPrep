package com.fitprep.demo.catalogo_nutricional.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Repositorio Spring Data sobre la entidad JPA. Detalle de infraestructura.
 */
interface PlatoJpaRepository extends JpaRepository<PlatoEntity, Long> {

    /**
     * Consulta nativa por negocio: al no pasar por el mapeo JPQL de la entidad,
     * NO aplica el filtro de {@code @TenantId}, así que puede leer el catálogo de
     * una cocina distinta a la del contexto. Solo platos disponibles.
     */
    @Query(value = "SELECT * FROM plato WHERE negocio_id = :negocioId AND disponible = TRUE ORDER BY nombre",
            nativeQuery = true)
    List<PlatoEntity> findDisponiblesByNegocioIdNative(@Param("negocioId") Integer negocioId);
}
