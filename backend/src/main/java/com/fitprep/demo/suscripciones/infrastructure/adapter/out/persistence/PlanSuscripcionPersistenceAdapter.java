package com.fitprep.demo.suscripciones.infrastructure.adapter.out.persistence;

import com.fitprep.demo.suscripciones.domain.model.PlanSuscripcion;
import com.fitprep.demo.suscripciones.domain.port.out.PlanSuscripcionRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class PlanSuscripcionPersistenceAdapter implements PlanSuscripcionRepositoryPort {

    private final PlanSuscripcionJpaRepository jpaRepository;

    public PlanSuscripcionPersistenceAdapter(PlanSuscripcionJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public List<PlanSuscripcion> findAllActivos() {
        return jpaRepository.findByActivoTrueOrderByPrecioMensualAsc().stream()
                .map(SuscripcionMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<PlanSuscripcion> findById(Long id) {
        return jpaRepository.findById(id).map(SuscripcionMapper::toDomain);
    }
}
