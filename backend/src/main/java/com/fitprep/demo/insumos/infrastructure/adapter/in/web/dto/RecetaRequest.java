package com.fitprep.demo.insumos.infrastructure.adapter.in.web.dto;

import lombok.*;

import java.util.List;

/** Reemplazo completo de la receta de un plato. */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecetaRequest {
    private List<Linea> lineas;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Linea {
        private Long insumoId;
        private Double cantidad;
    }
}
