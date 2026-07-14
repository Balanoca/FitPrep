package com.fitprep.demo.insumos.infrastructure.adapter.out.persistence;

import com.fitprep.demo.insumos.domain.model.Insumo;

final class InsumoMapper {

    private InsumoMapper() {
    }

    static Insumo toDomain(InsumoEntity e) {
        if (e == null) {
            return null;
        }
        return Insumo.builder()
                .id(e.getId())
                .negocioId(e.getNegocioId())
                .nombre(e.getNombre())
                .unidad(e.getUnidad())
                .precioUnitario(e.getPrecioUnitario())
                .activo(e.getActivo())
                .build();
    }

    static InsumoEntity toEntity(Insumo i) {
        if (i == null) {
            return null;
        }
        return InsumoEntity.builder()
                .id(i.getId())
                .negocioId(i.getNegocioId())
                .nombre(i.getNombre())
                .unidad(i.getUnidad())
                .precioUnitario(i.getPrecioUnitario())
                .activo(i.getActivo() != null ? i.getActivo() : true)
                .build();
    }
}
