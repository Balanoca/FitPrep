package com.fitprep.demo.insumos.infrastructure.adapter.in.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecetaItemResponse {
    private Long id;
    private Long insumoId;
    private String insumoNombre;
    private String insumoUnidad;
    private Double cantidad;
}
