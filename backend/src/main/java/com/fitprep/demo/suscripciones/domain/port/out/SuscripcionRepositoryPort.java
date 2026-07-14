package com.fitprep.demo.suscripciones.domain.port.out;

import com.fitprep.demo.suscripciones.domain.model.PagoSuscripcion;
import com.fitprep.demo.suscripciones.domain.model.Suscripcion;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida para la persistencia de suscripciones y sus pagos. La
 * suscripción referencia al negocio (tenant), por eso se consulta por negocio_id
 * explícito y no hay filtro de @TenantId.
 */
public interface SuscripcionRepositoryPort {

    /** Suscripción del negocio, con nombre y precio del plan resueltos. */
    Optional<Suscripcion> findByNegocioId(Integer negocioId);

    Suscripcion save(Suscripcion suscripcion);

    /** Todas las suscripciones con datos de plan (para el panel admin). */
    List<Suscripcion> findAll();

    PagoSuscripcion savePago(PagoSuscripcion pago);

    List<PagoSuscripcion> findPagosBySuscripcionId(Long suscripcionId);
}
