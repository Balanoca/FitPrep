package com.fitprep.demo.logistica_cocina.infrastructure.adapter.in.web.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListaCompraItemResponse {
    private Long insumoId;
    private String insumoNombre;
    private String unidad;
    private Double cantidadTotal;
    private Double precioUnitario;
    private Double costoEstimado;
}
