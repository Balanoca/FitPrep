package com.fitprep.demo.suscripciones.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

interface PlanSuscripcionJpaRepository extends JpaRepository<PlanSuscripcionEntity, Long> {
    List<PlanSuscripcionEntity> findByActivoTrueOrderByPrecioMensualAsc();
}
