package com.fitprep.demo.insumos.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

interface RecetaJpaRepository extends JpaRepository<RecetaEntity, Long> {

    List<RecetaEntity> findByPlatoId(Long platoId);

    /**
     * Borrado por query nativa + flush inmediato: garantiza que el DELETE se
     * ejecute en la BD antes de los INSERT del reemplazo (si no, Hibernate ordena
     * INSERT antes que DELETE en el mismo flush y choca la unique key).
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = "DELETE FROM receta WHERE plato_id = :platoId", nativeQuery = true)
    void deleteByPlatoIdNative(@Param("platoId") Long platoId);

    /**
     * Receta de un plato con el nombre y la unidad del insumo resueltos (JPQL con
     * join). Devuelve proyecciones para presentar la receta sin N+1.
     */
    @Query("""
            SELECT new com.fitprep.demo.insumos.infrastructure.adapter.out.persistence.RecetaJpaRepository$LineaProjection(
                r.id, r.negocioId, r.platoId, r.insumoId, r.cantidad, i.nombre, i.unidad, i.precioUnitario)
            FROM RecetaEntity r
            JOIN InsumoEntity i ON i.id = r.insumoId
            WHERE r.platoId = :platoId
            ORDER BY i.nombre
            """)
    List<LineaProjection> findLineasByPlatoId(@Param("platoId") Long platoId);

    /** Proyección de una línea de receta con datos del insumo. */
    record LineaProjection(Long id, Integer negocioId, Long platoId, Long insumoId,
                           Double cantidad, String insumoNombre, String insumoUnidad,
                           Double insumoPrecioUnitario) {
    }
}
