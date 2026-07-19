package com.fitprep.demo.gestion_usuarios.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

interface NegocioJpaRepository extends JpaRepository<NegocioEntity, Long> {
    Optional<NegocioEntity> findBySlug(String slug);

    List<NegocioEntity> findByEstadoOrderByNombreComercialAsc(String estado);

    /**
     * Resumen de todos los negocios con conteos. SQL nativo con subconsultas: al
     * no pasar por el mapeo de entidades con @TenantId, cuenta globalmente (cross
     * tenant), que es lo que necesita el panel del ADMIN.
     */
    @Query(value = """
            SELECT n.id AS id,
                   n.nombre_comercial AS nombreComercial,
                   n.slug AS slug,
                   n.estado AS estado,
                   n.fecha_registro AS fechaRegistro,
                   (SELECT COUNT(*) FROM usuario u WHERE u.negocio_id = n.id AND u.rol = 'ATHLETE') AS totalDeportistas,
                   (SELECT COUNT(*) FROM plato p WHERE p.negocio_id = n.id) AS totalPlatos
            FROM negocio n
            ORDER BY n.nombre_comercial
            """, nativeQuery = true)
    List<ResumenRow> findAllResumen();

    /** Fila de la proyección del resumen (Spring mapea por alias de columna). */
    interface ResumenRow {
        Long getId();
        String getNombreComercial();
        String getSlug();
        String getEstado();
        java.time.Instant getFechaRegistro();
        long getTotalDeportistas();
        long getTotalPlatos();
    }
}
