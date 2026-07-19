package com.fitprep.demo.suscripciones.infrastructure.adapter.out.persistence;

import com.fitprep.demo.suscripciones.domain.model.PagoSuscripcion;
import com.fitprep.demo.suscripciones.domain.model.PlanSuscripcion;
import com.fitprep.demo.suscripciones.domain.model.Suscripcion;

final class SuscripcionMapper {

    private SuscripcionMapper() {
    }

    static PlanSuscripcion toDomain(PlanSuscripcionEntity e) {
        if (e == null) return null;
        return PlanSuscripcion.builder()
                .id(e.getId())
                .nombre(e.getNombre())
                .precioMensual(e.getPrecioMensual())
                .maxPlatos(e.getMaxPlatos())
                .maxClientes(e.getMaxClientes())
                .activo(e.getActivo())
                .build();
    }

    static Suscripcion toDomain(SuscripcionJpaRepository.SuscripcionProjection p) {
        if (p == null) return null;
        return Suscripcion.builder()
                .id(p.id())
                .negocioId(p.negocioId())
                .planId(p.planId())
                .estado(p.estado())
                .fechaInicio(p.fechaInicio())
                .fechaVencimiento(p.fechaVencimiento())
                .planNombre(p.planNombre())
                .planPrecioMensual(p.planPrecioMensual())
                .build();
    }

    static SuscripcionEntity toEntity(Suscripcion s) {
        if (s == null) return null;
        return SuscripcionEntity.builder()
                .id(s.getId())
                .negocioId(s.getNegocioId())
                .planId(s.getPlanId())
                .estado(s.getEstado())
                .fechaInicio(s.getFechaInicio())
                .fechaVencimiento(s.getFechaVencimiento())
                .build();
    }

    static PagoSuscripcion toDomain(PagoSuscripcionEntity e) {
        if (e == null) return null;
        return PagoSuscripcion.builder()
                .id(e.getId())
                .suscripcionId(e.getSuscripcionId())
                .monto(e.getMonto())
                .fechaPago(e.getFechaPago())
                .periodoDesde(e.getPeriodoDesde())
                .periodoHasta(e.getPeriodoHasta())
                .build();
    }

    static PagoSuscripcionEntity toEntity(PagoSuscripcion p) {
        if (p == null) return null;
        return PagoSuscripcionEntity.builder()
                .id(p.getId())
                .suscripcionId(p.getSuscripcionId())
                .monto(p.getMonto())
                .fechaPago(p.getFechaPago())
                .periodoDesde(p.getPeriodoDesde())
                .periodoHasta(p.getPeriodoHasta())
                .build();
    }
}
