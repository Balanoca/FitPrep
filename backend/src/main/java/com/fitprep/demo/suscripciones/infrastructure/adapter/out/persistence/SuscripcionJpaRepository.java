package com.fitprep.demo.suscripciones.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

interface SuscripcionJpaRepository extends JpaRepository<SuscripcionEntity, Long> {

    Optional<SuscripcionEntity> findByNegocioId(Integer negocioId);

    /** Suscripción de un negocio con nombre y precio del plan resueltos. */
    @Query("""
            SELECT new com.fitprep.demo.suscripciones.infrastructure.adapter.out.persistence.SuscripcionJpaRepository$SuscripcionProjection(
                s.id, s.negocioId, s.planId, s.estado, s.fechaInicio, s.fechaVencimiento, p.nombre, p.precioMensual)
            FROM SuscripcionEntity s
            JOIN PlanSuscripcionEntity p ON p.id = s.planId
            WHERE s.negocioId = :negocioId
            """)
    Optional<SuscripcionProjection> findProjectionByNegocioId(@Param("negocioId") Integer negocioId);

    /** Todas las suscripciones con datos del plan (para el panel admin). */
    @Query("""
            SELECT new com.fitprep.demo.suscripciones.infrastructure.adapter.out.persistence.SuscripcionJpaRepository$SuscripcionProjection(
                s.id, s.negocioId, s.planId, s.estado, s.fechaInicio, s.fechaVencimiento, p.nombre, p.precioMensual)
            FROM SuscripcionEntity s
            JOIN PlanSuscripcionEntity p ON p.id = s.planId
            ORDER BY s.negocioId
            """)
    List<SuscripcionProjection> findAllProjections();

    /** Proyección de la suscripción con datos del plan. */
    record SuscripcionProjection(Long id, Integer negocioId, Long planId, String estado,
                                 java.time.LocalDate fechaInicio, java.time.LocalDate fechaVencimiento,
                                 String planNombre, Double planPrecioMensual) {
    }
}
