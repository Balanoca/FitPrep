package com.fitprep.demo.suscripciones.infrastructure.adapter.out.persistence;

import com.fitprep.demo.suscripciones.domain.model.PagoSuscripcion;
import com.fitprep.demo.suscripciones.domain.model.Suscripcion;
import com.fitprep.demo.suscripciones.domain.port.out.SuscripcionRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class SuscripcionPersistenceAdapter implements SuscripcionRepositoryPort {

    private final SuscripcionJpaRepository suscripcionJpa;
    private final PagoSuscripcionJpaRepository pagoJpa;

    public SuscripcionPersistenceAdapter(SuscripcionJpaRepository suscripcionJpa,
                                         PagoSuscripcionJpaRepository pagoJpa) {
        this.suscripcionJpa = suscripcionJpa;
        this.pagoJpa = pagoJpa;
    }

    @Override
    public Optional<Suscripcion> findByNegocioId(Integer negocioId) {
        return suscripcionJpa.findProjectionByNegocioId(negocioId).map(SuscripcionMapper::toDomain);
    }

    @Override
    public Suscripcion save(Suscripcion suscripcion) {
        SuscripcionEntity saved = suscripcionJpa.save(SuscripcionMapper.toEntity(suscripcion));
        // Recupera la proyección con los datos del plan para devolver un modelo completo.
        return suscripcionJpa.findProjectionByNegocioId(saved.getNegocioId())
                .map(SuscripcionMapper::toDomain)
                .orElseThrow();
    }

    @Override
    public List<Suscripcion> findAll() {
        return suscripcionJpa.findAllProjections().stream()
                .map(SuscripcionMapper::toDomain)
                .toList();
    }

    @Override
    public PagoSuscripcion savePago(PagoSuscripcion pago) {
        PagoSuscripcionEntity saved = pagoJpa.save(SuscripcionMapper.toEntity(pago));
        return SuscripcionMapper.toDomain(saved);
    }

    @Override
    public List<PagoSuscripcion> findPagosBySuscripcionId(Long suscripcionId) {
        return pagoJpa.findBySuscripcionIdOrderByFechaPagoDesc(suscripcionId).stream()
                .map(SuscripcionMapper::toDomain)
                .toList();
    }
}
