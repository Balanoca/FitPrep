package com.fitprep.demo.suscripciones.domain.port.out;

import com.fitprep.demo.suscripciones.domain.model.PlanSuscripcion;

import java.util.List;
import java.util.Optional;

public interface PlanSuscripcionRepositoryPort {

    List<PlanSuscripcion> findAllActivos();

    Optional<PlanSuscripcion> findById(Long id);
}
