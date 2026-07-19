package com.fitprep.demo.insumos.infrastructure.adapter.out.persistence;

import com.fitprep.demo.insumos.domain.model.ItemReceta;

final class RecetaMapper {

    private RecetaMapper() {
    }

    static ItemReceta toDomain(RecetaJpaRepository.LineaProjection p) {
        if (p == null) {
            return null;
        }
        return ItemReceta.builder()
                .id(p.id())
                .negocioId(p.negocioId())
                .platoId(p.platoId())
                .insumoId(p.insumoId())
                .cantidad(p.cantidad())
                .insumoNombre(p.insumoNombre())
                .insumoUnidad(p.insumoUnidad())
                .insumoPrecioUnitario(p.insumoPrecioUnitario())
                .build();
    }

    static RecetaEntity toEntity(ItemReceta i) {
        if (i == null) {
            return null;
        }
        return RecetaEntity.builder()
                .id(i.getId())
                .negocioId(i.getNegocioId())
                .platoId(i.getPlatoId())
                .insumoId(i.getInsumoId())
                .cantidad(i.getCantidad())
                .build();
    }
}
