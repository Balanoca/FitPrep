package com.fitprep.demo.suscripciones.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

interface PagoSuscripcionJpaRepository extends JpaRepository<PagoSuscripcionEntity, Long> {
    List<PagoSuscripcionEntity> findBySuscripcionIdOrderByFechaPagoDesc(Long suscripcionId);
}
